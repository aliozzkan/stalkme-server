import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { MailService } from './mail/mail.service';

@Module({
  imports: [],
  providers: [MailService, BcryptService],
  exports: [MailService, BcryptService],
})
export class ServiceModule {}
