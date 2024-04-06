import { ISendMailParams } from 'src/infrastructure/services/mail/mail.service';

export class SendMailEvent implements ISendMailParams {
  to: string;
  subject: string;
  html: string;

  constructor(params: ISendMailParams) {
    this.to = params.to;
    this.subject = params.subject;
    this.html = params.html;
  }
}
