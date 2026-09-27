import { Kafka } from "kafkajs";
import fs from "node:fs";
import { defaultKafkaOptions } from "./config.js";

/**
 * Loads the CA certificate from path or raw string.
 */
function resolveCaCert({ caCertPath, caCertContent }) {
  if (caCertContent) {
    return caCertContent.trim();
  }
  if (caCertPath && fs.existsSync(caCertPath)) {
    return fs.readFileSync(caCertPath, "utf-8");
  }
  return null;
}

/**
 * Creates an authenticated Kafka client configured for Aiven/SASL SCRAM-SHA-256 or Plain.
 *
 * @param {Object} params
 * @param {string} params.clientId
 * @param {string[]} params.brokers - List of broker host:port strings
 * @param {string} [params.username]
 * @param {string} [params.password]
 * @param {string} [params.caCertPath] - Path to downloaded ca.pem
 * @param {string} [params.caCertContent] - Raw PEM string
 * @param {Object} [params.logger=console]
 */
export function createKafkaInstance({
  clientId,
  brokers,
  username,
  password,
  caCertPath,
  caCertContent,
  logger = console,
}) {
  if (!brokers || brokers.length === 0) {
    throw new Error(
      "[@monorepo/kafka-client] 'brokers' array must not be empty.",
    );
  }

  const sslConfig = {};
  const ca = resolveCaCert({ caCertPath, caCertContent });

  if (ca) {
    sslConfig.ca = [ca];
    sslConfig.rejectUnauthorized = true;
  } else {
    // If running over TLS without custom CA (or standard trusted root CA)
    sslConfig.rejectUnauthorized = true;
  }

  const saslConfig =
    username && password
      ? {
          mechanism: "scram-sha-256", // Default for Aiven; fallback to 'plain' if needed
          username,
          password,
        }
      : null;

  return new Kafka({
    clientId: clientId || "monorepo-service",
    brokers,
    ssl: sslConfig,
    ...(saslConfig ? { sasl: saslConfig } : {}),
    ...defaultKafkaOptions,
  });
}
