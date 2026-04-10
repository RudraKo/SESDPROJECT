import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err instanceof AppError ? err.statusCode : 500;
  const payload = {
    message: err.message || "Internal server error",
    details: err instanceof AppError ? err.details : undefined
  };

  res.status(status).json(payload);
};
