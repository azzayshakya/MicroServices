import { ENV } from "./env.config.js";
import {
  connectDB,
  disconnectDB,
} from "../../../../packages/mongo-client/index.js";
import { logger } from "../utils/logger.js";

export async function initDB() {
  return connectDB(ENV.MONGO_URI, logger);
}

export { disconnectDB };
