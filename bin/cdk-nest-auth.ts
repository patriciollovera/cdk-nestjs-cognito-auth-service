#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkNestAuthStack } from '../lib/cdk-nest-auth-stack';

const app = new cdk.App();
new CdkNestAuthStack(app, 'CdkNestAuthStack', {
  stage: 'dev',
});