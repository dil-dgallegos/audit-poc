import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Alias } from 'aws-cdk-lib/aws-kms';

export interface ApplicationProps extends cdk.StackProps {
  topicDisplayName: string;
}

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    //TODO: replace with your constructs here.
    new Topic(this, 'AppTopic', {
      displayName: props.topicDisplayName,
      masterKey: Alias.fromAliasName(this, 'master-key', 'alias/aws/sns'),
    });
  }
}

export interface ApplicationStageProps extends cdk.StageProps {
  tags: Record<string, string>;
  topicDisplayName: string;
}

/**
 * Declare the stacks you'd want to be deployed here.
 */
export class ApplicationStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: ApplicationStageProps) {
    super(scope, id, props);
    Object.entries(props.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });
    new ApplicationStack(this, 'app', {
      topicDisplayName: props.topicDisplayName,
    });
  }
}
