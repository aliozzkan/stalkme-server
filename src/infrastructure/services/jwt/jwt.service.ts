import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/domain/adapters/jwt.interface';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async checkToken(token: string): Promise<any> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
  }

  createToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: 'stalkme-jwt-secret',
      expiresIn: '24h',
    });
  }

  async decodeToken(token: string): Promise<IJwtPayload> {
    const decoded = (await this.jwtService.decode(token)) as IJwtPayload;
    return decoded;
  }
}
