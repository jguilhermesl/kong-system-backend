import { env } from '@/env';
import nodemailer from 'nodemailer';

interface ISendEmailProps {
  message: string,
  destination: string,
  subject: string
}

export async function sendEmail({ message, destination, subject }: ISendEmailProps): Promise<any> {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: true,
    auth: {
      user: env.EMAIL_USER as string,
      pass: env.EMAIL_PASSWORD as string
    }
  });

  const mailOptions = {
    from: env.EMAIL_USER,
    to: destination,
    subject,
    html: message
  };

  return transporter.sendMail(mailOptions);
}