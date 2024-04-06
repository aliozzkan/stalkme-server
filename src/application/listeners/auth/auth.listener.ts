import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { MailService } from 'src/infrastructure/services/mail/mail.service';
import {
  AUTH_RESET_PASS_EMAIL,
  AUTH_VERIFY_EMAIL,
  AuthResetEmailEvent,
  AuthVerifyEmailEvent,
} from './auth.events';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';

@Injectable()
export class AuthListeners {
  constructor(
    private readonly mailService: MailService,
    private readonly cacheService: CacheService,
    private readonly bcryptService: BcryptService,
  ) {}

  @OnEvent(AUTH_VERIFY_EMAIL)
  async handleVerifyEmail(event: AuthVerifyEmailEvent) {
    const token = await this.bcryptService.hash(event.email);
    const encodedToken = encodeURIComponent(token);
    await this.cacheService.set(
      'USER:VERIFY_TOKEN:' + token,
      event.email,
      60 * 60 * 24,
    );
    await this.mailService.sendMail({
      to: event.email,
      html: `<h1>Confirm your email</h1><p>Click <a href="http://localhost:3000/confirm-email/${encodedToken}">here</a> to confirm your email</p>`,
      subject: 'Confirm your email',
    });
  }

  @OnEvent(AUTH_RESET_PASS_EMAIL)
  async handleResetEmail(event: AuthResetEmailEvent) {
    const token = await this.bcryptService.hash(event.email);
    const encodedToken = encodeURIComponent(token);
    console.log(event.email, encodedToken);
    await this.cacheService.set(
      'USER:RESET_PASS_TOKEN:' + token,
      event.email,
      60 * 10,
    );
    await this.mailService.sendMail({
      to: event.email,
      html: `<h1>Reset your password</h1><p>Click <a href="http://localhost:3000/reset-password/${encodedToken}">here</a> to reset your password</p>`,
      subject: 'Reset your password',
    });
  }
}
