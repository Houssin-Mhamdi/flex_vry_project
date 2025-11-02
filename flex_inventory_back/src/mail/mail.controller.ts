// mail/mail.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async testEmail(
    @Query('to') to?: string,
  ) {
    const testEmail = to || 'houssinoss010203@gmail.com';
    
    console.log(`🧪 Testing email sending to: ${testEmail}`);
    
    try {
      // Test the sendEmailsAsync method
      this.mailService.sendEmailsAsync(
        testEmail,
        'Test',
        'User',
        'houssinmhamdi123@gmail.com',
        99999,
      );

      return {
        success: true,
        message: `Email sending initiated to ${testEmail}`,
        note: 'Check server logs for email status',
      };
    } catch (error) {
      console.error('❌ Test email failed:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('test-direct')
  async testDirectEmail(@Query('to') to?: string) {
    const testEmail = to || 'houssinoss010203@gmail.com';
    
    console.log(`🧪 Testing DIRECT email sending to: ${testEmail}`);
    
    try {
      await this.mailService.sendTestEmail(testEmail);
      
      return {
        success: true,
        message: `Email sent successfully to ${testEmail}`,
      };
    } catch (error) {
      console.error('❌ Direct test email failed:', error.message);
      return {
        success: false,
        error: error.message,
        details: error.stack,
      };
    }
  }

  @Get('config')
  testConfig() {
    return {
      smtp_host: process.env.SMTP_HOST || 'NOT SET',
      smtp_port: process.env.SMTP_PORT || 'NOT SET',
      smtp_user: process.env.SMTP_USER || 'NOT SET',
      smtp_pass: process.env.SMTP_PASS ? '***SET***' : 'NOT SET',
      smtp_secure: process.env.SMTP_SECURE || 'NOT SET',
    };
  }
}
