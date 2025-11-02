import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

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
          throw new Error('SMTP configuration is incomplete');
        }

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
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}