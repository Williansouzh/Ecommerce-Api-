import "../../utils/module.alias";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "@src/utils/api-errors";

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const errorType = error.type || "Unknown Error";
  const errorResource = error.resource || "Unknown Resource";

  return res.status(statusCode).json({
    errorType,
    errors: [
      {
        resource: errorResource,
        message,
      },
    ],
  });
};
