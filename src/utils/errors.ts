import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    public name: string = "AppError"
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST, "ValidationError");
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND, "NotFoundError");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, "DatabaseError");
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
