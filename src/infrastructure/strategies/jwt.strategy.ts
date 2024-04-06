import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from 'src/domain/adapters/jwt.interface';
import { SessionRepository } from '../repositories/session.repository';
import { AuthUser } from '../decorators/auth.decorator';

export const JWT_STRATEGY_KEY = 'jwt-st';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_KEY) {
  constructor(private readonly sessionRepository: SessionRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'stalkme-jwt-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<AuthUser | null> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    try {
      const session = await this.sessionRepository.getOneByToken(token);
      if (session.userId !== payload.id) {
        return null;
      }

      return new AuthUser({
        token,
        user: session.user,
      });
    } catch (error) {
      return null;
    }
  }
}
