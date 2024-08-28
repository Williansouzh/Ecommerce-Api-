export class CreateUserDTO {
  name: string;
  email: string;
  password: string;
  resetPasswordExpires?: string | undefined;
  resetPasswordToken?: string;
  constructor(
    name: string,
    email: string,
    password: string,
    resetPasswordToken: string | undefined,
    resetPasswordExpires: string
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = resetPasswordExpires;
  }
}
export class LoginUserDTO {
  email: string;
  password: string;
  token?: string;
  constructor(email: string, password: string, token: string) {
    this.email = email;
    this.password = password;
    this.token = token;
  }
}
export class UpdateUserDTO {
  name?: string;
  email?: string;
}
