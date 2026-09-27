export class MailError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = "MailError";
    if (cause) this.cause = cause;
  }
}

export class MailValidationError extends MailError {
  constructor(message) {
    super(message);
    this.name = "MailValidationError";
  }
}
