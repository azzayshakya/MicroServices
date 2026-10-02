import { createMainLogger } from "@shared/logger";

export const notification_service_logger = createMainLogger({
  serviceName: "notification-service",
  logLevel: process.env.LOG_LEVEL || "http",
});

export const logger = notification_service_logger;
export default notification_service_logger;
