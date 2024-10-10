import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "@src/adapters/middlewares/auth";
import AuthService from "@src/application/services/authService";

jest.mock("@src/application/services/authService");

describe("authMiddleware", () => {
  const mockNext = jest.fn();
  let mockRequest: Partial<Request> & { headers: Record<string, string> };
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should decode token and call next()", () => {
    const token = "valid.token";
    const decodedToken = { userId: "123", role: "admin" };

    (AuthService.decodeToken as jest.Mock).mockReturnValue(decodedToken);
    mockRequest.headers["x-access-token"] = token;

    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(AuthService.decodeToken).toHaveBeenCalledWith(token);
    expect(mockRequest.decoded).toEqual(decodedToken);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should respond with 401 if token is invalid", () => {
    const token = "invalid.token";

    (AuthService.decodeToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });
    mockRequest.headers["x-access-token"] = token;

    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(AuthService.decodeToken).toHaveBeenCalledWith(token);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith({
      code: 401,
      error: "Invalid token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should respond with 401 for unknown errors", () => {
    const token = "unknown.error.token";

    (AuthService.decodeToken as jest.Mock).mockImplementation(() => {
      throw { message: "Unknown error" };
    });
    mockRequest.headers["x-access-token"] = token;

    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(AuthService.decodeToken).toHaveBeenCalledWith(token);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith({
      code: 401,
      error: "Unknown auth error",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
