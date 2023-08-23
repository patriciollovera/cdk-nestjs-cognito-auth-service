import { RemovalPolicy } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';




export class CognitoUserPool extends Construct {
    
    readonly userPoolId: string;
	readonly userPoolClientId: string;
    
    constructor(scope: Construct, id: string)
    {
      super(scope, id);
  
      const userPool = new UserPool(this, id, {
        signInAliases: { username: true, email: true },
        selfSignUpEnabled: true,
        removalPolicy: RemovalPolicy.DESTROY,
    });

    const appClient = userPool.addClient(id, {
        authFlows: {userPassword: true },
    });

    this.userPoolId = userPool.userPoolId;
    this.userPoolClientId = appClient.userPoolClientId;
      
    }
}