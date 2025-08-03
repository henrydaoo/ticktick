import nodemailer from 'nodemailer';
import { getEnv } from './get-env';

const transporter = nodemailer.createTransport({
  host: getEnv('EMAIL_HOST'),
  port: parseInt(getEnv('EMAIL_PORT', '587')),
  secure: getEnv('EMAIL_SECURE', 'false') === 'true',
  auth: {
    user: getEnv('EMAIL_USER'),
    pass: getEnv('EMAIL_PASS'),
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"TickTick App" <${getEnv('EMAIL_FROM')}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const getEmailVerificationTemplate = (verificationUrl: string, userName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f9fafb; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #4f46e5; 
          color: white; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TickTick - Email Verification</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>Thank you for signing up with TickTick. To complete your registration, please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create an account with TickTick, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 TickTick App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getPasswordResetTemplate = (resetUrl: string, userName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset</title>
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f9fafb; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #dc2626; 
          color: white; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TickTick - Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>We received a request to reset your password for your TickTick account.</p>
          <div class="warning">
            <strong>⚠️ Important:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </div>
          <p>To reset your password, click the button below:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
          <p>This reset link will expire in 1 hour for security reasons.</p>
        </div>
        <div class="footer">
          <p>© 2025 TickTick App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
