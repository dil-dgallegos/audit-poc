import { CDK_CONFIG, getBranchName } from './utils';

const gitBranchName = getBranchName();

export type StageEnv =
  | 'dev'
  | 'staging'
  | 'production'
  | 'dev-gov'
  | 'staging-gov'
  | 'production-sled'
  | 'production-gov'
  | 'production-dod';

export type Region =
  | 'us-west-2'
  | 'us-east-1'
  | 'eu-central-1'
  | 'ca-central-1'
  | 'ap-southeast-1'
  | 'ap-southeast-2'
  | 'sa-east-1'
  | 'af-south-1'
  | 'ap-northeast-1'
  | 'us-gov-west-1';

export interface WaveConfig {
  /** Whether manual approval is required before deploying this wave */
  requiresApproval?: boolean;
  /** List of regions the wave will deploy to */
  regions: Region[];
}

export interface DeploymentStageConfig {
  /** Whether manual approval is required before deploying this stage */
  requiresApproval?: boolean;
  /** AWS Account to deploy to */
  awsAccount: string;
  /** Waves to deploy */
  waves: Record<string, WaveConfig>;
}

/** Common waves that will be deployed by main commercial pipeline */
const mainWaves: Record<string, WaveConfig> = {
  CA: {
    regions: ['ca-central-1'],
  },
  US: {
    regions: ['us-east-1'],
  },
  WORLD: {
    regions: ['eu-central-1', 'ap-southeast-1', 'ap-southeast-2', 'sa-east-1', 'af-south-1'],
  },
  SENSITIVE: {
    regions: ['ap-northeast-1'],
  },
};

/** Common waves regions that will be deployed by dev branch pipelines */
const devWaves: Record<string, WaveConfig> = {
  'US-AF': {
    regions: ['us-west-2', 'af-south-1'],
  },
};

/** Common waves regions that will be deployed gov pipeline */
const govWaves: Record<string, WaveConfig> = {
  US: {
    regions: ['us-gov-west-1'],
  },
};

/** Common waves regions that will be deployed gov dev pipeline */
const govDevWaves: Record<string, WaveConfig> = {
  US: {
    regions: ['us-gov-west-1'],
  },
};

/** Configuration of all deployment stages */
export const deploymentStages: Record<StageEnv, DeploymentStageConfig> = {
  dev: {
    awsAccount: CDK_CONFIG.account.aws.dev,
    waves: gitBranchName === 'main' ? mainWaves : devWaves,
  },
  staging: {
    awsAccount: CDK_CONFIG.account.aws.staging,
    waves: mainWaves,
  },
  production: {
    awsAccount: CDK_CONFIG.account.aws.prod,
    waves: mainWaves,
  },
  'dev-gov': {
    awsAccount: CDK_CONFIG.account.aws_us_gov.dev,
    waves: govDevWaves,
  },
  'staging-gov': {
    awsAccount: CDK_CONFIG.account.aws_us_gov.staging,
    waves: govWaves,
  },
  'production-sled': {
    /**
     * After 'staging-gov' is deployed successfully - require manual approval before deploying
     * to prod environments. Once approved - deployment will continue to sled, gov, and dod - in that sequence.
     */
    requiresApproval: true,
    awsAccount: CDK_CONFIG.account.aws_us_gov.sled,
    waves: govWaves,
  },
  'production-gov': {
    awsAccount: CDK_CONFIG.account.aws_us_gov.prod,
    waves: govWaves,
  },
  'production-dod': {
    awsAccount: CDK_CONFIG.account.aws_us_gov.dod,
    waves: govWaves,
  },
};
