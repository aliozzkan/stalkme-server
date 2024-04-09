import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {} from '../strategies/jwt.strategy';
import { JWT_TFA_STRATEGY_KEY } from '../strategies/jwt_tfa.strategy';

@Injectable()
export class JwtTFAGuard extends AuthGuard(JWT_TFA_STRATEGY_KEY) {}
