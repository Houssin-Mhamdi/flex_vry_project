// mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const smtpHost = config.get<string>('SMTP_HOST');
        const smtpPort = config.get<number>('SMTP_PORT');
        const smtpUser = config.get<string>('SMTP_USER');
        const smtpPass = config.get<string>('SMTP_PASS');
        const smtpSecure = config.get<boolean>('SMTP_SECURE', true);

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
          console.warn('⚠️ SMTP configuration is incomplete. Email functionality will be disabled.');
          console.warn(`SMTP_HOST: ${smtpHost ? '✓' : '✗'}`);
          console.warn(`SMTP_PORT: ${smtpPort ? '✓' : '✗'}`);
          console.warn(`SMTP_USER: ${smtpUser ? '✓' : '✗'}`);
          console.warn(`SMTP_PASS: ${smtpPass ? '✓' : '✗'}`);
          // Return a dummy transport that won't send emails
          return {
            transport: {
              jsonTransport: true, // Logs emails instead of sending
            },
            defaults: {
              from: '"Flex_vry Truck Reservation" <houssinmhamdi123@gmail.com>',
            },
          };
        }

        console.log('✅ SMTP configuration loaded successfully');
        console.log(`📧 SMTP Host: ${smtpHost}:${smtpPort}`);
        console.log(`👤 SMTP User: ${smtpUser}`);

        return {
          transport: {
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure, // true for 465, false for other ports
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          },
          defaults: {
            from: `"Flex_vry Truck Reservation" <${smtpUser}>`,
          },
        };
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}