export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly resource: string;
  public readonly type: string;

  constructor(
    message: string,
    statusCode: number,
    type: string,
    resource: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.resource = resource;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, resource: string = "Bad Request") {
    super(message, 400, "Bad Request", resource);
  }
}

export class DuplicateEmailError extends ApiError {
  constructor(email: string) {
    const message = `Email '${email}' email already exists in the database.`;
    super(message, 400, "Bad Request", "Duplicated email");
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, resource: string = "Not Found") {
    super(message, 404, "Not Found", resource);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, resource: string = "Unauthorized") {
    super(message, 401, "Unauthorized", resource);
  }
}
