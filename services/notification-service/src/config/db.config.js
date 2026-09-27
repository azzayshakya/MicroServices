// ^ Adjust path to wherever your shared db package lives in packages/ (or use @monorepo/database if registered)
import logger from "@monorepo/logger";
import { ENV } from "./env.config.js";
import {
  connectDB,
  disconnectDB,
} from "../../../../packages/mongo-client/index.js";

export async function initDB() {
  return connectDB(ENV.MONGO_URI, logger);
}

export { disconnectDB };
