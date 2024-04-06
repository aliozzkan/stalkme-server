import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface ISendMailParams {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'toni.steuber@ethereal.email',
      pass: '8sbNt1KZ4s9hNCz4Jq',
    },
  });

  async sendMail(params: ISendMailParams) {
    const info = await this.transporter.sendMail({
      from: '"STALKME 👻" <stalkme@ethereal.email>', // sender address
      to: `${params.to}`, // list of receivers
      subject: params.subject, // Subject line
      text: 'Hello world?', // plain text body
      html: params.html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
