import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/errors";

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) {
    next(new AppError("Missing Authorization header", 401));
    return;
  }

  const [, token] = header.split(" ");
  if (!token) {
    next(new AppError("Invalid Authorization header", 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { id: string; email: string; username: string };
    req.user = { id: payload.id, email: payload.email, username: payload.username };
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401, error));
  }
};
