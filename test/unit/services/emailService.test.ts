import nodemailer from "nodemailer";
import { EmailService } from "@src/application/services/emailService";

jest.mock("nodemailer");
const mockSendMail = jest.fn();
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: mockSendMail,
});

describe("EmailService", () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send welcome email", async () => {
    mockSendMail.mockResolvedValue({ messageId: "12345" });

    await emailService.sendWelcomeEmail("test@example.com", "John Doe");

    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"PetRescue" <no-reply@yourapp.com>',
      to: "test@example.com",
      subject: "Welcome to Our Service!",
      text: "Hello John Doe, welcome to our service!",
      html: "<b>Hello John Doe</b>, welcome to our service!",
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it("should send token reset email", async () => {
    mockSendMail.mockResolvedValue({ messageId: "67890" });

    await emailService.sendTokenResetEmail(
      "test@example.com",
      "Jane Doe",
      "token123"
    );

    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"PetRescue" <no-reply@yourapp.com>',
      to: "test@example.com",
      subject: "Reset password!",
      text:
        "You are receiving this because you requested a password reset.\n\n" +
        "Click the following link or paste it into your browser to complete the process:\n\n" +
        "http://localhost:3000/password-reset/token123\n\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      html: '<p>Hello <b>Jane Doe</b>,</p><p>You are receiving this because you requested a password reset.</p><p>Click the following link or paste it into your browser to complete the process:</p><a href="http://localhost:3000/reset/token123">Reset Password</a><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>',
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if sendMail fails", async () => {
    const errorMessage = "Failed to send email";
    mockSendMail.mockRejectedValue(new Error(errorMessage));

    await expect(
      emailService.sendWelcomeEmail("test@example.com", "John Doe")
    ).rejects.toThrow(`Failed to send email`);

    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });
});
