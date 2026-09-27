import { createRedisClient, closeRedisClient } from "@monorepo/redis-client";
import logger from "@monorepo/logger";
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
