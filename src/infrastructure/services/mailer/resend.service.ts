import { Resend } from 'resend';
import type { Attachments, MailMessageService, MessageMail, MessageMailResponse } from './nodemailer.repository.ts';
import { env } from '@/infrastructure/config/env.ts';
import { BadRequestError } from '@/infrastructure/config/errors.ts';

export class ResendService implements MailMessageService {
  private resend: Resend;

  constructor() {
    const apiKey = env.RESEND_API_KEY;

    if (!apiKey) {
      throw new BadRequestError('RESEND_API_KEY environment variable is required');
    }

    this.resend = new Resend(apiKey);
  }

  async send(message: MessageMail): Promise<MessageMailResponse | void> {
    try {
      const emailData: any = {
        from: message.from,
        to: message.to,
        subject: message.subject,
        html: message.body,
      };

      if (message.attachments && message.attachments.length > 0) {
        emailData.attachments = message.attachments.map((attachment: Attachments) => ({
          filename: attachment.filename,
          content: attachment.content || attachment.path,
        }));
      }

      const response = await this.resend.emails.send(emailData);

      if (response.error) {
        throw new BadRequestError(`Failed to send email: ${response.error.message}`);
      }

      return {
        id: response.data?.id || '',
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to send email via Resend');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Resend doesn't have a direct verify method, so we'll just check if API key is set
      return !!env.RESEND_API_KEY;
    } catch (error) {
      return false;
    }
  }
}
