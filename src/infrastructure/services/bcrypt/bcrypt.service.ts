import { Injectable, Scope } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable({ durable: false, scope: Scope.REQUEST })
export class BcryptService {
  private rounds: number = 10;

  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, 10);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
