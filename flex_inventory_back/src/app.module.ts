// mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const smtpHost = config.get('SMTP_HOST') || 'smtp.gmail.com';
        const smtpPort = Number(config.get('SMTP_PORT')) || 587;
        const smtpUser = config.get('SMTP_USER');
        const smtpPass = config.get('SMTP_PASS');

        // Validate required environment variables
        if (!smtpUser || !smtpPass) {
          throw new Error(
            'SMTP_USER and SMTP_PASS environment variables are required',
          );
        }

        return {
          transport: {
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            // Additional options for better reliability
            tls: {
              rejectUnauthorized: false, // For development, set to true in production
            },
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000, // 10 seconds
            socketTimeout: 10000, // 10 seconds
          },
          defaults: {
            from: `"Flex_vry Truck Reservation" <${smtpUser}>`,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
