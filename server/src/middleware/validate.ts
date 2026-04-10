import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/errors";

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction): void => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    next(new AppError("Validation failed", 422, result.error.flatten()));
    return;
  }

  next();
};
