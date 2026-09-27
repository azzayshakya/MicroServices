/**
 * Static ioredis configuration options.
 * No environment variables or credentials belong here.
 */
export const defaultRedisOptions = {
  // Backoff strategy: up to 10 attempts, 1s delay
  retryStrategy: (times) => {
    if (times > 10) {
      return null; // Stop retrying; fires an 'error' event
    }
    return 1000;
  },

  // Fail an individual command after 3 retries
  maxRetriesPerRequest: 3,

  // Maximum time to establish socket connection
  connectTimeout: 10000,

  // Verify server is ready to accept commands before resolving
  enableReadyCheck: true,

  // Buffer commands in memory during temporary disconnects
  enableOfflineQueue: true,

  // Do not connect during instantiation; wait for explicit .connect()
  lazyConnect: true,
};
