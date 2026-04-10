export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const assert = (condition: boolean, message: string, statusCode = 400): void => {
  if (!condition) {
    throw new AppError(message, statusCode);
  }
};
