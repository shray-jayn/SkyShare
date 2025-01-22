import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import * as pug from 'pug';
import * as path from 'path';

@Injectable()
export class MailerService {
  private readonly mailerSend: MailerSend;

  constructor(private readonly configService: ConfigService) {
    this.mailerSend = new MailerSend({
      apiKey: this.configService.get<string>('MAILERSEND_API_KEY'),
    });
  }

  private renderTemplate(templateName: string, context: Record<string, any>): string {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.pug`);
    return pug.renderFile(templatePath, context);
  }

  async sendEmailWithTemplate(
    from: { email: string; name: string },
    to: { email: string; name: string }[],
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ): Promise<any> {
    const sentFrom = new Sender(from.email, from.name);
    const recipients = to.map((recipient) => new Recipient(recipient.email, recipient.name));

    // Render the email template
    const htmlContent = this.renderTemplate(templateName, context);

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(htmlContent);

    return this.mailerSend.email.send(emailParams);
  }
}
