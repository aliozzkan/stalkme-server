import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { toDataURL } from 'qrcode';

import { AuthRegisterDTO } from 'src/domain/dtos/auth.dtos';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { MailService } from 'src/infrastructure/services/mail/mail.service';
import {
  AUTH_RESET_PASS_EMAIL,
  AUTH_VERIFY_EMAIL,
  AuthResetEmailEvent,
  AuthVerifyEmailEvent,
} from '../listeners/auth/auth.events';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';
import { Equal, IsNull, Not } from 'typeorm';
import { SessionRepository } from 'src/infrastructure/repositories/session.repository';
import { TfaService } from 'src/infrastructure/services/tfa/tfa.service';
import { UserM } from 'src/domain/models/user.model';

@Injectable()
export class IdendityService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly cacheService: CacheService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtTokenService,
    private readonly sessionRepository: SessionRepository,
    private readonly tfaService: TfaService,
  ) {}
  async userRegister(variables: AuthRegisterDTO) {
    return await this.userRepository.create(variables);
  }
  async sendConfirmEmail(userId: number) {
    const user = await this.userRepository.getOneById(userId);
    this.eventEmitter.emit(
      AUTH_VERIFY_EMAIL,
      new AuthVerifyEmailEvent({
        email: user.email,
      }),
    );
    return user;
  }
  async verifyUser(encodedToken: string) {
    const decodedToken = decodeURIComponent(encodedToken);
    const email = await this.cacheService.get(
      'USER:VERIFY_TOKEN:' + decodedToken,
    );
    if (!email) {
      throw new Error('Invalid token');
    }

    const user = await this.userRepository.getOne({ email });
    await this.cacheService.del('USER:VERIFY_TOKEN:' + decodedToken);
    if (user.verifiedAt) {
      throw new Error('User already verified');
    }
    await this.userRepository.updateOne(
      { id: user.id },
      { verifiedAt: new Date() },
    );
  }
  async login(variables: { username: string; password: string }) {
    const user = await this.userRepository.getOne({
      username: variables.username,
      verifiedAt: Not(IsNull()),
    });
    if (!user) {
      throw new Error('User not found');
    }
    const isValid = await this.bcryptService.compare(
      variables.password,
      user.password,
    );
    if (!isValid) {
      throw new Error('Invalid password');
    }

    if (user.tfa && user.tfa.enabled) {
      return this.jwtService.createTfaToken({
        id: user.id,
        username: user.username,
      });
    }

    return this.createSession(user);
  }

  private async createSession(user: UserM) {
    const token = this.jwtService.createToken({
      id: user.id,
      username: user.username,
    });

    await this.sessionRepository.create({
      token,
      userId: user.id,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return token;
  }

  async revokeSession(token: string) {
    await this.sessionRepository.revoke(token);
  }

  async logout(token: string) {
    await this.sessionRepository.delete(token);
  }
  async sendResetPasswordMail(email: string) {
    const user = await this.userRepository.getOne({ email: Equal(email) });
    this.eventEmitter.emit(
      AUTH_RESET_PASS_EMAIL,
      new AuthResetEmailEvent({
        email: user.email,
      }),
    );
  }
  async resetPassword(token: string, password: string) {
    const decodedToken = decodeURIComponent(token);
    const email = await this.cacheService.get(
      'USER:RESET_PASS_TOKEN:' + decodedToken,
    );
    if (!email) {
      throw new Error('Invalid token');
    }
    const user = await this.userRepository.getOne({ email: Equal(email) });
    await this.cacheService.del('USER:RESET_PASS_TOKEN:' + decodedToken);
    await this.userRepository.updateOne(
      { id: Equal(user.id) },
      { password: await this.bcryptService.hash(password) },
    );
  }

  async revokeAllSessions(userId: number) {
    await this.sessionRepository.deleteAllByUserId(userId);
  }

  async enableTfa(userId: number) {
    const user = await this.userRepository.getOneById(userId, {
      withRelations: true,
    });
    if (user.tfa) {
      if (user.tfa.enabled) {
        throw new Error('TFA already enabled');
      }
      await this.userRepository.updateTfaByUserId(userId, { enabled: true });
      return;
    }
    const tfaResult = await this.tfaService.generateToken(user.email);
    await this.userRepository.createTfa(userId, {
      secret: tfaResult.secret,
      otpAuthUri: tfaResult.otpAuthUri,
    });
    return;
  }

  async disableTfa(userId: number) {
    await this.userRepository.updateTfaByUserId(userId, { enabled: false });
  }

  async getTfaQrCode(userId: number) {
    const user = await this.userRepository.getOneById(userId, {
      withRelations: true,
    });
    if (!user.tfa) {
      throw new Error('TFA not enabled');
    }
    return toDataURL(user.tfa.otpAuthUri);
  }

  async loginWithTfa(userId: number, token: string) {
    const user = await this.userRepository.getOneById(userId, {
      withRelations: true,
    });
    if (!user.tfa || !user.tfa.enabled) {
      throw new Error('TFA not enabled');
    }
    const isValid = await this.tfaService.verifyToken({
      secret: user.tfa.secret,
      token,
    });

    if (!isValid) {
      throw new Error('Invalid token');
    }

    return this.createSession(user);
  }
}
