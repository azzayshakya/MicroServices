import { MailError, MailValidationError } from "./errors.js";

export class Mailer {
  /**
   * @param {Object} params
   * @param {import('nodemailer').Transporter} params.transporter
   * @param {string} params.defaultFrom - Default 'From' header
   * @param {Object} [params.logger=console]
   */
  constructor({ transporter, defaultFrom, logger = console }) {
    this.transporter = transporter;
    this.defaultFrom = defaultFrom;
    this.logger = logger;
    this.isVerified = false;
  }

  /**
   * Explicitly verifies SMTP credentials and socket connectivity.
   */
  async verify() {
    try {
      await this.transporter.verify();
      this.isVerified = true;
      this.logger.info("Mail service connected and ready to send messages");
      return true;
    } catch (err) {
      this.isVerified = false;
      this.logger.error(
        `Mail service verification failed: ${err.message || err}`,
      );
      throw new MailError("Failed to verify SMTP connection", err);
    }
  }

  /**
   * Dispatches an email message with strict input validation.
   *
   * @param {Object} options
   * @param {string|string[]} options.to
   * @param {string} options.subject
   * @param {string} [options.text]
   * @param {string} [options.html]
   * @param {string} [options.from] - Optional override for sender
   * @param {Array<Object>} [options.attachments]
   */
  async sendMail({ to, subject, text, html, from, attachments = [] }) {
    if (!to) {
      throw new MailValidationError("Recipient address ('to') is required.");
    }
    if (!subject) {
      throw new MailValidationError("Email subject is required.");
    }
    if (!text && !html) {
      throw new MailValidationError(
        "Email body requires either 'text' or 'html' content.",
      );
    }

    const sender = from || this.defaultFrom;
    if (!sender) {
      throw new MailValidationError(
        "Sender address ('from') must be provided or configured as default.",
      );
    }

    try {
      const info = await this.transporter.sendMail({
        from: sender,
        to,
        subject,
        text,
        html,
        attachments,
      });

      this.logger.info(
        `Email successfully delivered to [${to}] | Subject: "${subject}" | ID: ${info.messageId}`,
      );

      return {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      };
    } catch (err) {
      this.logger.error(
        `Email delivery failed to [${to}]: ${err.message || err}`,
      );
      throw new MailError(`Failed to send email to ${to}`, err);
    }
  }

  /**
   * Gracefully drains the connection pool.
   */
  async close() {
    if (this.transporter && typeof this.transporter.close === "function") {
      this.transporter.close();
      this.logger.info("Mail transporter pool closed.");
    }
  }
}
