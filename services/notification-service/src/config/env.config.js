import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 5002,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || "fallback_secret_key",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL,
};