import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { stageId, StageStackProps } from './common';
import { CognitoUserPool } from './stacks/cognito.constructs';
import { nestAuthstack } from './stacks/nest-auth.constructs';


export class CdkNestAuthStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StageStackProps) {
    super(scope, id, props);

    const cognitoResources = new CognitoUserPool(this, stageId('cognito', props.stage));

    const userPoolId= cognitoResources.userPoolId
    const userPoolClientId= cognitoResources.userPoolClientId

    const nestAuthresources = new nestAuthstack(this, stageId('auth-api', props.stage),{
      userPoolId,
	    userPoolClientId,
    });
  }
}
