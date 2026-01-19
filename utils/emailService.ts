import nodemailer from "nodemailer";

// Send email with reset code
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST!,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.COMPANY_EMAIL_USER!,
    pass: process.env.COMPANY_EMAIL_PASS!,
  },
  tls: {
    // Align TLS server name with certificate to avoid hostname mismatch errors
    servername:
      process.env.EMAIL_SERVER_CERT_NAME || process.env.EMAIL_SERVER_HOST,
    rejectUnauthorized: false,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.SUPPORT_EMAIL,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

export async function sendVisitScheduledEmail(
  userEmail: string,
  userName: string,
  propertyTitle: string,
  visitDate: Date,
  visitTime?: string,
): Promise<boolean> {
  const formattedDate = visitDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = visitTime ? ` at ${visitTime}` : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1976d2; margin: 0;">Visit Scheduled Successfully!</h2>
      </div>
      
      <p>Hi ${userName},</p>
      
      <p>Your property visit has been scheduled. Here are the details:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Property:</strong> ${propertyTitle}</p>
        <p style="margin: 5px 0;"><strong>Visit Date:</strong> ${formattedDate}${formattedTime}</p>
        <p style="margin: 5px 0;"><strong>Visitors limit:</strong> Per admin configuration</p>
      </div>
      
      <p>Please make sure to arrive on time for your scheduled visit. If you need to reschedule or cancel, please let us know as soon as possible.</p>
      
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #2e7d32;"><strong>Note:</strong> You have 3 days after the visit date to complete your purchase or release the property.</p>
      </div>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br/>
      <strong>Ajibest Properties</strong></p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Visit Scheduled for ${propertyTitle}`,
    html,
  });
}

export async function sendAdminVisitNotificationEmail(
  adminEmail: string,
  userName: string,
  userEmail: string,
  propertyTitle: string,
  visitDate: Date,
  visitTime?: string,
): Promise<boolean> {
  const formattedDate = visitDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = visitTime ? ` at ${visitTime}` : "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1976d2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: white; margin: 0;">New Visit Scheduled - Admin Notification</h2>
      </div>
      
      <p>Hello Admin,</p>
      
      <p>A user has scheduled a property visit. Here are the details:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>User Name:</strong> ${userName}</p>
        <p style="margin: 5px 0;"><strong>User Email:</strong> ${userEmail}</p>
        <p style="margin: 5px 0;"><strong>Property:</strong> ${propertyTitle}</p>
        <p style="margin: 5px 0;"><strong>Visit Date:</strong> ${formattedDate}${formattedTime}</p>
      </div>
      
      <p>Please ensure the property is ready for viewing on the scheduled date.</p>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; color: #856404;"><strong>Action Required:</strong> Monitor the visit and follow up with the user after the scheduled date.</p>
      </div>
      
      <p>Best regards,<br/>
      <strong>Ajibest Properties System</strong></p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Property Visit Scheduled - ${propertyTitle}`,
    html,
  });
}
