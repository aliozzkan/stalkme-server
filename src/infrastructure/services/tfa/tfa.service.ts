import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';

const SERVICE_NAME = 'STALKME TFA';

@Injectable()
export class TfaService {
  async generateToken(email: string) {
    const secret = authenticator.generateSecret();
    const otpAuthUri = await authenticator.keyuri(email, SERVICE_NAME, secret);
    return { secret, otpAuthUri };
  }

  async verifyToken(variables: { secret: string; token: string }) {
    return authenticator.verify(variables);
  }
}
