#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';
import { pipelineEnvironments } from '../lib/pipeline-environments';

/* export const app = new cdk.App();
const isGov = app.node.tryGetContext('is-gov') === 'true';

Object.entries(pipelineEnvironments).forEach(([envName, pipelineEnvironment]) => {
  if (pipelineEnvironment.isGov === isGov) {
    new PipelineStack(app, `pipeline-${envName}`, pipelineEnvironment);
  }
}); */

console.log('Hello World!');
