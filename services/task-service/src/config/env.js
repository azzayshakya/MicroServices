import "dotenv/config";
import path from "node:path";
import process from "node:process";

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5001,
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",

  // Kafka
  KAFKA_ENABLED: process.env.KAFKA_ENABLED === "true",
  KAFKA_BROKERS: (
    process.env.KAFKA_BROKERS ||
    process.env.KAFKA_BROKER ||
    ""
  ).split(","),
  KAFKA_USERNAME: process.env.KAFKA_USERNAME,
  KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
  KAFKA_CA_CERT_PATH: process.env.KAFKA_CA_CERT_PATH
    ? path.resolve(process.cwd(), process.env.KAFKA_CA_CERT_PATH)
    : null,

  // Mail
  MAIL_ENABLED: process.env.MAIL_ENABLED === "true",
  MAIL: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.MAIL_FROM || "no-reply@umbravault.com",
  },

  GEMINI_ENABLED: process.env.GEMINI_ENABLED === "true",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY?.trim(),
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};

export default env;
