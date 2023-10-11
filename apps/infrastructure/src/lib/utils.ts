import { execSync } from 'child_process';
import { config } from 'process';

/**
 * @returns Current branch name
 */
export function getBranchName(): string {
  if ((process.env.CI || process.env.CODEBUILD_BUILD_ID) && !process.env.GITBRANCH) {
    throw new Error('Missing GITBRANCH environment variable'); // When running in CI (Github action or CodeBuild) - branch name should be set by the action
  }
  return process.env.GITBRANCH ?? execSync('git branch --show-current', { stdio: 'pipe' }).toString().trim();
}

// FIXME: this should be defined in package.json NOT HERE!, just for testing purposes.
export const PACKAGE_JSON = {
  githubRepository: 'rc-audit',
  githubOrganization: 'DiligentCorp',
  name: 'rc-audit',
};

export const CDK_CONFIG = {
  account: {
    aws: {
      tools: '896825236827',
      dev: '627418988246',
      staging: '407978966934',
      prod: '563463039784',
    },
    aws_us_gov: {
      tools: '',
      dev: '',
      staging: '',
      prod: '',
      sled: '',
      dod: '',
    },
  },
  pipeline: {
    dev: {
      codeStarArns: {
        diligentCorp:
          'arn:aws:codestar-connections:us-west-2:627418988246:connection/a726952c-96df-4e9b-bef0-9b2124d832bb',
      },
      region: 'us-west-2',
      notifications: [],
    },
    main: {
      codeStarArns: {
        diligentCorp:
          'arn:aws:codestar-connections:us-west-2:896825236827:connection/1b4a3243-bff2-4dac-afb5-7a8a86cc3c25',
      },
      region: 'us-west-2',
      notifications: [
        {
          state: {
            pipeline: ['SUCCEEDED', 'FAILED'],
          },
          destination: {
            slack: {
              channelName: '#dil-vanguard',
            },
          },
        },
      ],
    },
    dev_gov: {
      region: 'us-gov-west-1',
      notifications: [],
    },
    main_gov: {
      region: 'us-gov-west-1',
      notifications: [
        {
          state: {
            pipeline: ['SUCCEEDED', 'FAILED'],
          },
          destination: {
            slack: {
              channelName: '#dil-vanguard',
            },
          },
        },
        {
          state: {
            approve: ['STARTED'],
          },
          destination: {
            slack: {
              channelName: '#ops-govcloud',
              tagUsers: ['U036G1HV01W', 'S04U49ZB0JC'],
            },
          },
        },
      ],
    },
  },
};
