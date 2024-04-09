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
import { UserM } from 'src/domain/models/user.model';
import { IJwtPayload } from 'src/domain/adapters/jwt.interface';

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
  async revokeSessions(user: UserM) {
    await this.identityService.revokeAllSessions(user.id);
  }

  async enableTfa(user: UserM) {
    await this.identityService.enableTfa(user.id);
  }

  async disableTfa(user: UserM) {
    await this.identityService.disableTfa(user.id);
  }

  async getTfaQrCode(user: UserM) {
    return await this.identityService.getTfaQrCode(user.id);
  }

  async verifyTfaToken(user: IJwtPayload, token: string) {
    try {
      return await this.identityService.loginWithTfa(user.id, token);
    } catch (error) {
      this.exceptionService.badRequestException({
        codeError: ErrorCodeEnum.INVALID_TOKEN,
      });
    }
  }
}
