import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/domain/adapters/jwt.interface';

export const JWT_TFA_STRATEGY_KEY = 'jwt-tfa-st';

@Injectable()
export class JwtTfaStrategy extends PassportStrategy(
  Strategy,
  JWT_TFA_STRATEGY_KEY,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'stalkme-jwt-tfa-secret',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: IJwtPayload,
  ): Promise<IJwtPayload | null> {
    return payload;
  }
}
