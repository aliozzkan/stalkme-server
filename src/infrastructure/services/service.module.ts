import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { MailService } from './mail/mail.service';
import { TfaService } from './tfa/tfa.service';

@Module({
  imports: [],
  providers: [MailService, BcryptService, TfaService],
  exports: [MailService, BcryptService, TfaService],
})
export class ServiceModule {}
