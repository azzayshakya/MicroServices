/**
 * Static engine defaults for pooled SMTP connections.
 */
export const defaultTransportOptions = {
  pool: true,
  maxConnections: 3, // Gmail limits concurrent pooled connections
  maxMessages: 100, // Max messages per socket before cycling
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
};
