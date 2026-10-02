import { ENV } from "./env.config.js";
import { connectDB, disconnectDB } from "@shared/mongo-client";
import { logger } from "../utils/logger.js";

export async function initDB() {
  return connectDB(ENV.MONGO_URI, logger);
}

export { disconnectDB };
