import { StackProps } from 'aws-cdk-lib';
import { StageEnv } from './deployment-environments';
import { CDK_CONFIG, getBranchName, PACKAGE_JSON } from './utils';
import { Notification } from '@diligentcorp/library-cdk-codepipeline-notifier/dist/types';

/**
 * Sanitizes branch name to make it a string compatible with AWS naming conventions
 * @param branchName Repository branch name
 * @returns Sanitized string based on branch name
 */
export function sanitizeBranchName(branchName: string) {
  // Replace all non-alphanumeric or `-` characters` with `-` and truncate to 60 chars (stack names are limited to 128, and we need room for other bits to get added)
  // Remove `dependabot-npm-and-yarn` from the branch name.
  return branchName
    .replace(/[^a-zA-Z\d-]/g, '-')
    .replace('dependabot-npm-and-yarn-', 'npm-')
    .replace('diligentcorp-', '')
    .substring(0, 59);
}

const gitBranchName = getBranchName();

/** Code pipeline source */
type Source = 'diligentCorp';

type GitHubConnection = {
  /** ARN of secret with GitHub token */
  githubTokenSecretArn: string;
};

type CodeStarConnection = {
  /** Code star connection ARN  */
  connectionArn: string;
};

/**
 * Source connection - for non gov environment it's CodeStar connection ARN
 * For gov environment - it's a Secret with GitHub token, and KMS key to decrypt it
 *
 * More than one connection may be required because a CodeStar connection can only be connected to a single GitHub organization.
 */
type Connections =
  | {
      /** This is not gov environment */
      isGov: false;
      connections: Partial<Record<Source, CodeStarConnection>>;
    }
  | {
      /** This is gov environment */
      isGov: true;
      connections: Partial<Record<Source, GitHubConnection>>;
    };

export type PipelineEnvironment = Connections &
  StackProps & {
    fullRepositoryName: string;
    branchName: string;
    tags: Record<string, string>;
    isDevBranch: boolean;
    deploymentStages: StageEnv[];
    notifications?: Notification[];
  };

const tagMap: Record<string, string> = {
  'github-organization': PACKAGE_JSON.githubOrganization,
  'github-repository': PACKAGE_JSON.githubRepository,
  'github-branch-name': sanitizeBranchName(gitBranchName),
};

const commonPipelineEnvironmentSettings = {
  stackName: `${PACKAGE_JSON.name}-pipeline-${sanitizeBranchName(gitBranchName)}`,
  fullRepositoryName: `${PACKAGE_JSON.githubOrganization}/${PACKAGE_JSON.githubRepository}`,
  branchName: gitBranchName,
  tags: tagMap,
};

const mainDeploymentStages: StageEnv[] =
  PACKAGE_JSON.githubRepository === `template-serverless-cdk`
    ? ['dev', 'staging', 'production'] // deployment stages for the template
    : ['dev', 'staging' /*, 'production'*/]; // TODO: Uncomment deployment stages for service when ready to deploy to them

const mainGovDeploymentStages: StageEnv[] =
  PACKAGE_JSON.githubRepository === `template-serverless-cdk`
    ? ['staging-gov', 'production-sled', 'production-gov', 'production-dod'] // deployment stages for template
    : ['staging-gov' /*, 'production-sled', 'production-gov', 'production-dod'*/]; // TODO: Uncomment deployment stages for service when ready to deploy to them

export const pipelineEnvironments: Record<string, PipelineEnvironment> =
  gitBranchName === 'main'
    ? {
        main: {
          ...commonPipelineEnvironmentSettings,
          isGov: false,
          connections: {
            diligentCorp: {
              connectionArn: CDK_CONFIG.pipeline.main.codeStarArns.diligentCorp,
            },
          },
          env: {
            account: CDK_CONFIG.account.aws.tools,
            region: CDK_CONFIG.pipeline.main.region,
          },
          isDevBranch: false,
          deploymentStages: mainDeploymentStages,
          notifications: CDK_CONFIG.pipeline.main.notifications as Notification[],
        },
        'main-gov': {
          ...commonPipelineEnvironmentSettings,
          connections: {
            diligentCorp: {
              // This connection is common across all govCloud deployments, and does not need to be changed
              githubTokenSecretArn:
                'arn:aws-us-gov:secretsmanager:us-gov-west-1:117420681603:secret:GITHUB/CODEPIPELINE_TOKEN-Ir3LR7',
            },
          },
          env: {
            account: CDK_CONFIG.account.aws_us_gov.tools,
            region: CDK_CONFIG.pipeline.main_gov.region,
          },
          isDevBranch: false,
          isGov: true,
          deploymentStages: mainGovDeploymentStages,
          notifications: CDK_CONFIG.pipeline['main_gov'].notifications as Notification[],
        },
      }
    : {
        dev: {
          ...commonPipelineEnvironmentSettings,
          isGov: false,
          connections: {
            diligentCorp: {
              connectionArn: CDK_CONFIG.pipeline.dev.codeStarArns.diligentCorp,
            },
          },
          env: {
            account: CDK_CONFIG.account.aws.dev,
            region: CDK_CONFIG.pipeline.dev.region,
          },
          isDevBranch: true,
          deploymentStages: ['dev'],
          notifications: CDK_CONFIG.pipeline.dev.notifications as Notification[],
        },
        'dev-gov': {
          ...commonPipelineEnvironmentSettings,
          connections: {
            diligentCorp: {
              // This connection is common across all govCloud deployments, and does not need to be changed
              githubTokenSecretArn:
                'arn:aws-us-gov:secretsmanager:us-gov-west-1:117420681603:secret:GITHUB/CODEPIPELINE_TOKEN-Ir3LR7',
            },
          },
          env: {
            account: CDK_CONFIG.account.aws_us_gov.dev,
            region: CDK_CONFIG.pipeline.dev_gov.region,
          },
          isDevBranch: true,
          isGov: true,
          deploymentStages: ['dev-gov'],
          notifications: CDK_CONFIG.pipeline['dev_gov'].notifications as Notification[],
        },
      };
