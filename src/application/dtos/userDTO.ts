export class CreateUserDTO {
  name: string;
  email: string;
  password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
export class LoginUserDTO {
  email: string;
  password: string;
  token: string;
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
