import { SecretValue, Stack, PhysicalName, RemovalPolicy } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { BlockPublicAccess, Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { GitHubStep } from '@diligentcorp/pipeline-github-token';
import { PipelineEnvironment, sanitizeBranchName } from './pipeline-environments';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Region, deploymentStages } from './deployment-environments';
import { ApplicationStage } from './application-stack';
import { CodePipelineNotifier } from '@diligentcorp/library-cdk-codepipeline-notifier';
import { checkovSkip } from '@diligentcorp/checkov-helper';
import { getBranchName, PACKAGE_JSON } from './utils';
import { Notification } from '@diligentcorp/library-cdk-codepipeline-notifier/dist/types';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineEnvironment) {
    super(scope, id, props);

    const sourceStep =
      props.connections.diligentCorp &&
      (props.isGov
        ? CodePipelineSource.gitHub(props.fullRepositoryName, props.branchName, {
            authentication: SecretValue.secretsManager(props.connections.diligentCorp.githubTokenSecretArn),
          })
        : CodePipelineSource.connection(props.fullRepositoryName, props.branchName, {
            connectionArn: (props.connections.diligentCorp as any).connectionArn,
            triggerOnPush: true,
          }));

    // note: if one or more additional pipeline sources connected to GitHub organization other than DiligentCorp are
    // required, connections for them can be added to the pipeline environment, then the sources can be defined here
    // and added to steps as needed by passing the sources to the additionalInputs prop of any construct compatible
    // with the CodeBuildStepProps interface. For example, a project may depend on source code in both DiligentCorp
    // and acl-services GitHub organizations

    const synthStep = new GitHubStep('SynthStep', {
      useGovGithubToken: props.isGov,
      env: {
        GITBRANCH: props.branchName,
      },
      input: sourceStep,
      commands: [
        'corepack enable',
        'pnpm i',
        `pnpm cdk synth -c is-gov=${props.isGov}`,
        // self-mutation
        `pnpm cdk deploy -a ./cdk.out ${id} --require-approval=never --verbose  -c is-gov=${props.isGov}`,
      ],
      // from https://github.com/aws/aws-cdk/blob/75967e17b8ce3a9d1e0068a3aa210abb247191e6/packages/aws-cdk-lib/pipelines/lib/codepipeline/codepipeline.ts#L777
      rolePolicyStatements: [
        // allow the self-mutating project permissions to assume the bootstrap Action role
        new PolicyStatement({
          actions: ['sts:AssumeRole'],
          resources: [`arn:*:iam::${props.env!.account}:role/*`],
          conditions: {
            'ForAnyValue:StringEquals': {
              'iam:ResourceTag/aws-cdk:bootstrap-role': ['image-publishing', 'file-publishing', 'deploy'],
            },
          },
        }),
        new PolicyStatement({
          actions: ['cloudformation:DescribeStacks'],
          resources: ['*'], // this is needed to check the status of the bootstrap stack when doing `cdk deploy`
        }),
        // S3 checks for the presence of the ListBucket permission
        new PolicyStatement({
          actions: ['s3:ListBucket'],
          resources: ['*'],
        }),
      ],
    });

    const pipelineName = `${props.stackName!}${props.isGov ? '-gov' : ''}`;

    const rawPipeline = new Pipeline(this, props.stackName!, {
      pipelineName,
      crossAccountKeys: !props.isDevBranch, // Only allow cross-account publishing for main branch
      enableKeyRotation: !props.isDevBranch,
      crossRegionReplicationBuckets: props.isDevBranch ? devReplicationBuckets(this, props.isGov) : undefined,
      restartExecutionOnUpdate: true,
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      codePipeline: rawPipeline,
      synth: synthStep,
      codeBuildDefaults: {
        partialBuildSpec: BuildSpec.fromObject({
          env: {
            variables: {
              GITBRANCH: props.branchName,
            },
          },
        }),
      },
      publishAssetsInParallel: false, // see https://bliskavka.com/2022/09/25/speed-up-cdk-pipelines/
      useChangeSets: false,
      selfMutation: false, // moved to Synth step
    });

    // looping thru all deployment stages (dev, staging, etc.)
    props.deploymentStages.forEach((stageName) => {
      const deploymentStage = deploymentStages[stageName];

      // if approval is required before deploying this stage - put it here.
      if (deploymentStage.requiresApproval) {
        // this will add a codepipeline stage with a manual approval action.
        pipeline.addWave('ManualApproval', {
          pre: [new ManualApprovalStep('ProductionApproval')],
        });
      }

      // looping thru all waves within the stage
      Object.entries(deploymentStage.waves).forEach(([waveId, waveConfig]) => {
        const wave = pipeline.addWave(`${stageName}-${waveId}`, {
          // if approval is required before deploying this wave - put it here.
          pre: waveConfig?.requiresApproval ? [new ManualApprovalStep('ProductionApproval')] : undefined,
        });

        // looping thru all regions within the wave
        waveConfig.regions.forEach((deploymentRegion) => {
          const envName = `${PACKAGE_JSON.name}-${stageName}-${deploymentRegion}-${sanitizeBranchName(
            props.branchName,
          )}`;

          // create regular stage
          const regionDeploymentApp = new ApplicationStage(this, envName, {
            tags: props.tags,
            env: {
              account: deploymentStage.awsAccount,
              region: deploymentRegion,
            },
            topicDisplayName: `Topic for ${envName}`,
          });

          // and add the stage to the wave
          wave.addStage(regionDeploymentApp);

          // create CodeBuild that will run post-deployment verification
          const postDeploymentTest = new GitHubStep(`${envName}-system-test`, {
            useGovGithubToken: props.isGov,
            input: sourceStep,
            commands: [
              'corepack enable',
              'pnpm install',
              `pnpm run post-deployment-test ${deploymentStage.awsAccount} ${deploymentRegion} ${envName} ${
                props.isGov ? 'aws-us-gov' : 'aws'
              }`,
            ],
            rolePolicyStatements: [
              new PolicyStatement({
                actions: ['sts:AssumeRole'],
                resources: ['*'],
                conditions: {
                  StringEquals: {
                    'iam:ResourceTag/aws-cdk:bootstrap-role': 'lookup',
                  },
                },
              }),
            ],
          });

          wave.addPost(postDeploymentTest);
        });
      });
    });

    // *** NOTIFICATIONS ***

    // always including GitHub commit status notifications
    const notifications: Notification[] = [
      {
        state: {
          pipeline: ['STARTED', 'SUCCEEDED', 'FAILED'],
        },
        destination: {
          github: {
            setCommitStatus: true,
          },
        },
      },
    ];

    // adding user-configured notifications
    if (props.notifications) notifications.push(...props.notifications);

    const notifyConstruct = new CodePipelineNotifier(this, 'pipeline-notifier', {
      pipelineName: [pipelineName],
      notifications: notifications,
    });

    rawPipeline.node.addDependency(notifyConstruct);

    checkovSkip(this, { idPattern: /DefaultPolicy/, type: 'AWS::IAM::Policy' }, [
      { id: 'CKV_AWS_111', comment: 'Pipeline default policy does not need constrains' },
    ]);

    checkovSkip(this, { idPattern: /ArtifactsBucket/, type: 'AWS::S3::Bucket' }, [
      { id: 'CKV_AWS_18', comment: 'Pipeline artifact bucket does not need logging' },
      { id: 'CKV_AWS_21', comment: 'Pipeline artifact bucket does not need versioning' },
    ]);

    pipeline.buildPipeline();
  }
}

// creates replication buckets that are destroyed when stacks are destroyed
export function devReplicationBuckets(parent: Stack, isGov: boolean) {
  // collecting all deployable regions from dev environment
  const regions = Object.values(deploymentStages[isGov ? 'dev-gov' : 'dev'].waves)
    .map((wave) => wave.regions)
    .flat()
    .map((region) => region)
    .concat(parent.region as Region)
    .filter((awsRegion, index, self) => self.indexOf(awsRegion) == index);

  const buckets: Record<string, IBucket> = {};

  for (const region of regions) {
    const replicationStack = new Stack(parent, `ReplicationStack-${region}`, {
      stackName: `${PACKAGE_JSON.name}-replication-${sanitizeBranchName(getBranchName())}`,
      env: { account: deploymentStages[isGov ? 'dev-gov' : 'dev'].awsAccount, region },
    });

    const replicationBucket = new Bucket(replicationStack, 'ReplicationBucket', {
      bucketName: PhysicalName.GENERATE_IF_NEEDED,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    buckets[region] = replicationBucket;

    checkovSkip(replicationStack, { idPattern: /ReplicationBucket/, type: 'AWS::S3::Bucket' }, [
      { id: 'CKV_AWS_18', comment: 'Pipeline replication bucket does not need logging' },
      { id: 'CKV_AWS_21', comment: 'Pipeline replication bucket does not need versioning' },
    ]);

    checkovSkip(replicationStack, { idPattern: /S3AutoDeleteObjects/, type: 'AWS::Lambda::Function' }, [
      { id: 'CKV_AWS_117', comment: 'Pipeline custom resource lambda does not need VPC' },
      { id: 'CKV_AWS_116', comment: 'Pipeline custom resource lambda does not need DLQ' },
      { id: 'CKV_AWS_115', comment: 'Pipeline custom resource lambda does not need concurrency' },
    ]);
  }

  return buckets;
}
