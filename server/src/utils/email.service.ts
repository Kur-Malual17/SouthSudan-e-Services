import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendApprovalEmail = async (application: any) => {
  try {
    const typeMap: any = {
      'passport-first': 'e-Passport (First-Time)',
      'passport-replacement': 'e-Passport (Replacement)',
      'nationalid-first': 'National ID (First-Time)',
      'nationalid-replacement': 'National ID (Replacement)'
    };
    
    const applicationType = typeMap[application.applicationType];
    const user = application.userId;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@immigration.gov.ss',
      to: user.email,
      subject: 'Application Approved - South Sudan Immigration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a5490; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #1a5490; color: white; text-decoration: none; border-radius: 5px; }
            .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #1a5490; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Approved</h1>
              <p>Republic of South Sudan - Immigration Services</p>
            </div>
            <div class="content">
              <p>Dear ${user.firstName} ${user.lastName},</p>
              
              <p>We are pleased to inform you that your application for <strong>${applicationType}</strong> has been approved.</p>
              
              <div class="info-box">
                <strong>Application Details:</strong><br>
                Confirmation Number: ${application.confirmationNumber}<br>
                Application Type: ${applicationType}<br>
                Approval Date: ${new Date(application.reviewedAt).toLocaleDateString()}
              </div>
              
              <h3>Next Steps:</h3>
              <ol>
                <li>Download and print the attached approved application form (PDF)</li>
                <li>Visit the Immigration Head Office in Juba</li>
                <li>Bring your original National ID and supporting documents</li>
                <li>Collect your ${applicationType.includes('Passport') ? 'passport' : 'National ID'}</li>
              </ol>
              
              <div class="info-box">
                <strong>Collection Information:</strong><br>
                Location: Immigration Head Office, Juba<br>
                Hours: Monday - Friday, 8:00 AM - 4:00 PM<br>
                Required: This approval form + Original National ID
              </div>
              
              <p>If you have any questions, please contact our support center.</p>
              
              <p>Thank you for using the South Sudan Immigration Online Portal.</p>
              
              <p>Best regards,<br>
              <strong>South Sudan Immigration Services</strong></p>
            </div>
            <div class="footer">
              <p>Contact: +211 XXX XXX XXX | Email: info@immigration.gov.ss</p>
              <p>&copy; ${new Date().getFullYear()} Republic of South Sudan - Directorate of Immigration</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `application-${application.confirmationNumber}.pdf`,
          path: path.join(process.cwd(), application.approvedPdfPath)
        }
      ]
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
