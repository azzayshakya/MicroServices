export const defaultKafkaOptions = {
  connectionTimeout: 10000,
  requestTimeout: 30000,
  retry: {
    initialRetryTime: 300,
    retries: 2,
  },
};
