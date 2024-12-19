import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private readonly usersService: UsersService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async validateToken(accessToken: string): Promise<any> {
    try {
      const command = new GetUserCommand({AccessToken: accessToken});
      const response = await this.cognitoClient.send(command);
      let user = await this.usersService.getUserByCognitoId(response.Username);
      if (!user) { 
        user = await this.usersService.createUser({
          cognitoId: response.Username,
          email: response.UserAttributes.find(attr => attr.Name === 'email')?.Value || '',
        });
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
