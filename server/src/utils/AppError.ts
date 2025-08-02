export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 400, name: string = 'AppError') {
    super(message);

    this.statusCode = statusCode;
    this.name = name;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
