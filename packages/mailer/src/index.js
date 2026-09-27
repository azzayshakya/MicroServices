import { createTransporter } from "./client.js";
import { Mailer } from "./service.js";

/**
 * Factory helper to construct and return a ready-to-use Mailer instance.
 */
export function createMailer({ smtp, from, logger = console, overrides = {} }) {
  const transporter = createTransporter({ smtp, overrides });
  return new Mailer({ transporter, defaultFrom: from, logger });
}

export { Mailer, createTransporter };
export { MailError, MailValidationError } from "./errors.js";
export { defaultTransportOptions } from "./config.js";
