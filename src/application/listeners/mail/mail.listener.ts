import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SendMailEvent } from './mail.events';
import { MailService } from 'src/infrastructure/services/mail/mail.service';

@Injectable()
export class MailListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('mail.send')
  async handleMailUserConfirm(event: SendMailEvent) {
    console.log('Mail user confirm');
    await this.mailService.sendMail(event);
  }
}
