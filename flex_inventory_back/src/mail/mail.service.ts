// mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateReservationDto } from '../reservation/dto/create-reservation.dto';
import { ReservationStatus } from 'src/reservation/entities/reservation.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendDriverConfirmation(
    driverEmail: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: driverEmail,
      subject: 'Reservation Confirmed - Welcome!',
      html: this.getDriverTemplate(firstName, lastName),
    });
  }

  async sendAdminNotification(
    adminEmail: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: adminEmail,
      subject: 'New Driver Registration - Action Required',
      html: this.getAdminTemplate(firstName, lastName),
    });
  }

  private getDriverTemplate(firstName: string, lastName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background: #fff; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Reservation Confirmed!</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName} ${lastName},</h2>
            <p>Your reservation has been successfully received and confirmed!</p>
            
            <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>📋 What's Next?</h3>
                <p><strong>Please take a coffee and wait in your truck.</strong></p>
                <p>Our team member will come to you when your paperwork is finished and ready for processing.</p>
            </div>
            
            <p>Thank you for your patience and cooperation!</p>
        </div>
        <div class="footer">
            <p>Flex_vry Truck Reservation System</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private getAdminTemplate(firstName: string, lastName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #fff3cd; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background: #fff; }
        .alert { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚛 New Driver Registration</h1>
        </div>
        <div class="content">
            <div class="alert">
                <h3>Action Required</h3>
                <p>You have a new driver registration that requires your attention.</p>
            </div>
            
            <h2>Driver Information:</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>First Name:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${firstName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Last Name:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lastName}</td>
                </tr>
            </table>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.DASHBOARD_URL}" class="button">Check Dashboard</a>
            </div>
            
            <p><strong>Please check the dashboard</strong> to review the complete driver details and process the registration.</p>
        </div>
        <div class="footer">
            <p>Truck Reservation System - Admin Notification</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  async sendStatusUpdate(
    driverEmail: string,
    firstName: string,
    lastName: string,
    status: ReservationStatus,
  ): Promise<void> {
    let subject: string;
    let html: string;

    switch (status) {
      case ReservationStatus.COLLECT:
        subject = 'Your Documents Are Ready for Collection';
        html = this.getCollectTemplate(firstName, lastName);
        break;
      case ReservationStatus.ISSUE:
        subject = 'Action Required: Issue with Your Reservation';
        html = this.getIssueTemplate(firstName, lastName);
        break;
      default:
        return; // Don't send email for other statuses
    }

    await this.mailerService.sendMail({
      to: driverEmail,
      subject,
      html,
    });
  }

  private getCollectTemplate(firstName: string, lastName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4edda; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background: #fff; }
        .instruction { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Documents Ready for Collection</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName} ${lastName},</h2>
            <p>Thank you for your waiting! Your documents are now ready and processed.</p>
            
            <div class="instruction">
                <h3>📋 Next Steps:</h3>
                <p><strong>Please go to the office to collect your documents and paperwork.</strong></p>
                <p>Our office staff will assist you with the final steps and provide you with all the necessary materials.</p>
            </div>
            
            <p>We appreciate your business and look forward to serving you!</p>
        </div>
        <div class="footer">
            <p>Flex_vry Truck Reservation System</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private getIssueTemplate(firstName: string, lastName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8d7da; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background: #fff; }
        .alert { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Action Required: Issue with Your Reservation</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName} ${lastName},</h2>
            
            <div class="alert">
                <h3>Important Notice</h3>
                <p>The information you provided appears to be missing or incorrect.</p>
            </div>
            
            <h3>What you need to do:</h3>
            <p><strong>Please contact your boss or supervisor immediately</strong> to review and send us the correct information.</p>
            
            <p>Once we receive the correct information, we'll be able to process your reservation and get you back on track.</p>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>Flex_vry Truck Reservation System</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}
