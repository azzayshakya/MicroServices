import Redis from "ioredis";
import { defaultRedisOptions } from "./config.js";

let clientInstance = null;

/**
 * Creates or returns the singleton Redis client.
 *
 * @param {Object} options
 * @param {string} options.url - Redis connection URL
 * @param {Object} [options.logger=console] - Shared logger instance
 * @param {Object} [options.overrides={}] - Optional ioredis overrides
 * @returns {Redis}
 */
export function createRedisClient({ url, logger = console, overrides = {} }) {
  if (clientInstance) {
    return clientInstance;
  }

  if (!url) {
    throw new Error("[@umbravault/redis] Connection URL must be provided.");
  }

  const options = {
    ...defaultRedisOptions,
    ...overrides,
  };

  clientInstance = new Redis(url, options);

  // Connection lifecycle monitoring
  clientInstance.on("connect", () => {
    logger.info("Redis socket connected successfully.");
  });

  clientInstance.on("ready", () => {
    logger.info("Redis client ready to accept commands.");
  });

  clientInstance.on("error", (err) => {
    logger.error(`Redis error: ${err?.message || err}`);
  });

  clientInstance.on("close", () => {
    logger.warn("Redis connection closed.");
  });

  return clientInstance;
}

/**
 * Cleanly closes the active Redis connection on server shutdown.
 *
 * @param {Object} [logger=console]
 */
export async function closeRedisClient(logger = console) {
  if (!clientInstance) return;

  try {
    await clientInstance.quit();
    logger.info("Redis connection terminated cleanly.");
  } catch (err) {
    logger.error(
      `Forced Redis disconnection due to error: ${err.message || err}`,
    );
    clientInstance.disconnect();
  } finally {
    clientInstance = null;
  }
}
