import { Controller, Post, Logger, Headers, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async auth(@Headers('authorization') authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      Logger.error(`Authorization header is missing or malformed`);
      throw new BadRequestException('Authorization header is missing or malformed');
    }
    try {
      const accessToken = authorization.split(' ')[1];
      Logger.log(`Validating user`);
      const validation =  this.authService.validateToken(accessToken);
      Logger.log(`Successfully validated user`);
      return validation;
    } catch (error) {
      Logger.error(`Couldnt validate user`);
      throw new Error(error);
    }
  }
}
