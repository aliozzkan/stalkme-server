import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUseCases } from 'src/application/usecases/auth.usecases';
import { AuthLoginDTO } from 'src/domain/dtos/auth.dtos';
import {
  AuthUser,
  CurrentAuth,
} from 'src/infrastructure/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwtAuth.guard';
import { AuthLoginPresenter } from './auth.presenter';
import {
  AuthRegisterBodyDTO,
  AuthResetPasswordBodyDTO,
  AuthResetPasswordEmailBodyDTO,
  AuthTfaTokenDto,
} from './authController.dtos';
import { IJwtPayload } from 'src/domain/adapters/jwt.interface';
import { JwtTFAGuard } from 'src/infrastructure/guards/jwtTfa.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUsecases: AuthUseCases) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('register')
  async register(@Body() body: AuthRegisterBodyDTO) {
    await this.authUsecases.signUp(body);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('verify')
  async verify(@Body('token') token: string) {
    await this.authUsecases.confirmEmail(token);
    return;
  }

  @Post('login')
  async login(@Body() body: AuthLoginDTO, @Ip() ip: string) {
    console.log('IP', ip);

    const token = await this.authUsecases.signIn(body);
    return new AuthLoginPresenter(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async session(@CurrentAuth() auth: AuthUser) {
    return auth;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentAuth() auth: AuthUser) {
    await this.authUsecases.signOut(auth);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('forgot-password')
  async resetPassword(@Body() body: AuthResetPasswordEmailBodyDTO) {
    await this.authUsecases.resetPasswordEmail(body.email);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  async resetPasswordConfirm(@Body() body: AuthResetPasswordBodyDTO) {
    await this.authUsecases.resetPassword(body);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-sessions')
  async revokeSessions(@CurrentAuth() auth: AuthUser) {
    await this.authUsecases.revokeSessions(auth.user);
    return;
  }

  @Get('ip')
  async getIp(@Ip() ip: string) {
    return ip;
  }

  @UseGuards(JwtAuthGuard)
  @Post('tfa/enable')
  async enableTfa(@CurrentAuth() auth: AuthUser) {
    await this.authUsecases.enableTfa(auth.user);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('tfa/disable')
  async disableTfa(@CurrentAuth() auth: AuthUser) {
    await this.authUsecases.disableTfa(auth.user);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('tfa/qr-code')
  async getTfaQrCode(@CurrentAuth() auth: AuthUser) {
    return await this.authUsecases.getTfaQrCode(auth.user);
  }

  @UseGuards(JwtTFAGuard)
  @Post('tfa/verify')
  async verifyTfa(
    @CurrentAuth() auth: IJwtPayload,
    @Body() body: AuthTfaTokenDto,
  ) {
    return await this.authUsecases.verifyTfaToken(auth, body.token);
  }
}
