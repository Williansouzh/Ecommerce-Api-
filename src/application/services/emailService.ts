import "reflect-metadata";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { injectable } from "tsyringe";

dotenv.config();
@injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: '"PetRescue" <no-reply@yourapp.com>',
      to,
      subject: "Welcome to Our Service!",
      text: `Hello ${name}, welcome to our service!`,
      html: `<b>Hello ${name}</b>, welcome to our service!`,
    });
    console.log("Message sent: %s", info.messageId);
  }
  public async sendTokenResetEmail(
    to: string,
    name: string,
    token: string
  ): Promise<void> {
    const info = await this.transporter.sendMail({
      from: '"PetRescue" <no-reply@yourapp.com>',
      to,
      subject: "Reset password!",
      text:
        `You are receiving this because you requested a password reset.\n\n` +
        `Click the following link or paste it into your browser to complete the process:\n\n` +
        `http://localhost:3000/password-reset/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html:
        `<p>Hello <b>${name}</b>,</p>` +
        `<p>You are receiving this because you requested a password reset.</p>` +
        `<p>Click the following link or paste it into your browser to complete the process:</p>` +
        `<a href="http://localhost:3000/reset/${token}">Reset Password</a>` +
        `<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
}
