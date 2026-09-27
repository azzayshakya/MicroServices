import nodemailer from "nodemailer";
import { defaultTransportOptions } from "./config.js";
import { MailError } from "./errors.js";

/**
 * Creates a configured Nodemailer transporter.
 *
 * @param {Object} params
 * @param {Object} params.smtp - Credentials and host settings
 * @param {string} params.smtp.host
 * @param {number} [params.smtp.port=465]
 * @param {boolean} [params.smtp.secure=true]
 * @param {Object} params.smtp.auth - { user, pass }
 * @param {Object} [params.overrides={}] - Optional transport overrides
 * @returns {nodemailer.Transporter}
 */
export function createTransporter({ smtp, overrides = {} }) {
  if (!smtp?.host || !smtp?.auth?.user || !smtp?.auth?.pass) {
    throw new MailError(
      "Missing required SMTP configuration: host, auth.user, and auth.pass must be provided.",
    );
  }

  const transportConfig = {
    ...defaultTransportOptions,
    host: smtp.host,
    port: Number(smtp.port) || (smtp.secure ? 465 : 587),
    secure: smtp.secure ?? true,
    auth: {
      user: smtp.auth.user,
      pass: smtp.auth.pass,
    },
    ...overrides,
  };

  return nodemailer.createTransport(transportConfig);
}
