export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;

    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
