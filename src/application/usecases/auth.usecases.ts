import { Injectable } from '@nestjs/common';
import {
  AuthLoginDTO,
  AuthRegisterDTO,
  AuthResetPasswordDTO,
} from 'src/domain/dtos/auth.dtos';
import { ErrorCodeEnum } from 'src/domain/enums/errorCode.enum';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { IdendityService } from '../services/identity.service';
import { AuthUser } from 'src/infrastructure/decorators/auth.decorator';

@Injectable()
export class AuthUseCases {
  constructor(
    private readonly identityService: IdendityService,
    private readonly exceptionService: ExceptionsService,
  ) {}
  async signUp(variables: AuthRegisterDTO) {
    const user = await this.identityService.userRegister(variables);
    await this.identityService.sendConfirmEmail(user.id);
    return user;
  }
  async signIn(variables: AuthLoginDTO) {
    try {
      return await this.identityService.login(variables);
    } catch (error) {
      this.exceptionService.unAuthorizedException();
    }
  }
  async confirmEmail(encodedToken: string) {
    try {
      await this.identityService.verifyUser(encodedToken);
    } catch (error) {
      this.exceptionService.badRequestException({
        codeError: ErrorCodeEnum.INVALID_TOKEN,
      });
    }
  }
  async signOut(auth: AuthUser) {
    await this.identityService.logout(auth.token);
  }
  async resetPasswordEmail(email: string) {
    try {
      await this.identityService.sendResetPasswordMail(email);
    } catch (error) {
      this.exceptionService.badRequestException({
        codeError: ErrorCodeEnum.INVALID_EMAIL,
      });
    }
  }
  async resetPassword(variables: AuthResetPasswordDTO) {
    try {
      await this.identityService.resetPassword(
        variables.token,
        variables.password,
      );
    } catch (error) {
      this.exceptionService.badRequestException({
        codeError: ErrorCodeEnum.INVALID_TOKEN,
      });
    }
  }
  async revokeSessions(auth: AuthUser) {
    await this.identityService.revokeAllSessions(auth.user.id);
  }
}
