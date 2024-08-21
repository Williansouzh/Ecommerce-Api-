export interface EmailServiceInterface {
  sendWelcomeEmail(to: string, name: string): Promise<void>;
  sendTokenResetEmail(to: string, name: string, token: string): Promise<void>;
}
