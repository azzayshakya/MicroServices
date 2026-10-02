import { createRedisClient, closeRedisClient } from "@shared/redis-client";
import logger from "../utils/logger.js";
import { ENV } from "./env.config.js";

export const redisConnection = createRedisClient({
  url: ENV.REDIS_URL,
  logger,
  overrides: {
    maxRetriesPerRequest: null,
    lazyConnect: false,
  },
});

export { closeRedisClient };
