import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as gateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Cors, EndpointType, IResource, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';


export interface AuthApiProps {
	userPoolId: string;
	userPoolClientId: string;
};


export class nestAuthstack extends Construct {
	private auth: IResource;
	private userPoolId: string;
	private userPoolClientId: string;

  constructor(scope: Construct, id: string, props: AuthApiProps)
    {
      super(scope, id);
  
      ({ userPoolId: this.userPoolId, userPoolClientId: this.userPoolClientId } = props);

    // pack all external deps in layer
    const nestAuthLayer = new cdk.aws_lambda.LayerVersion(this, "nestAuthLayer", {
      code: cdk.aws_lambda.Code.fromAsset("api/auth/node_modules"),
      compatibleRuntimes: [
        cdk.aws_lambda.Runtime.NODEJS_16_X,
      ],
    });
        
    // add handler to respond to all our api requests
    const nestAuthLambda = new cdk.aws_lambda.Function(this, "nestAuthHandler", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("api/auth/dist"),
      handler: "main.api",
      layers: [nestAuthLayer],
      environment: {
        NODE_PATH: "$NODE_PATH:/opt",
				CLIENT_ID: this.userPoolClientId,
        USERPOOL_ID: this.userPoolId,
      },
    });
    
    const nestapi = new cdk.aws_apigateway.RestApi(this, `nestAuthEndpoint`, {
      restApiName: `nestAuthLambda`,
      defaultMethodOptions: {
        apiKeyRequired: false,
      },
      deployOptions: {
        stageName: 'v1',
      },
      defaultCorsPreflightOptions: {
				allowOrigins: Cors.ALL_ORIGINS,
			},

    });

    // add api key to enable monitoring
    const api_Key = nestapi.addApiKey('ApiKey');
    
    const usagePlan = nestapi.addUsagePlan('UsagePlan', {
      description: 'Standard',
      name: 'Standard',
    });

    usagePlan.addApiKey(api_Key);

    usagePlan.addApiStage({
      stage: nestapi.deploymentStage,
    });

    
    // add proxy resource to handle all api requests
    const apiResource = nestapi.root.addProxy({
      defaultIntegration: new cdk.aws_apigateway.LambdaIntegration(nestAuthLambda),
      // anyMethod:  false,  // this is necessary otherwise you get conflict in Methods
    });
   
    new cdk.CfnOutput(this, `nestAuth-gateway`, {
      exportName: `nestAuth-gateway-arn`,
      value: nestapi.restApiName,
    });
      
    }
}