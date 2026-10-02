import mongoose from "mongoose";

let cached = { conn: null, promise: null };
let listenersBound = false;

function bindConnectionEvents(logger) {
  if (listenersBound) return;

  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected"),
  );

  mongoose.connection.on("error", (err) =>
    logger.error(`MongoDB error: ${err.message}`),
  );

  listenersBound = true;
}

/**
 * Connect to MongoDB with connection caching.
 * @param {string} uri - MongoDB connection string.
 * @param {object} [logger=console] - Scoped logger instance (e.g., from @shared/logger).
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB(uri, logger = console) {
  if (!uri) {
    throw new Error("MONGO_URI is required to connect to MongoDB");
  }

  bindConnectionEvents(logger);

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((instance) => {
        logger.info("MongoDB connected successfully");
        return instance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    logger.error(`MongoDB connection failed: ${err.message}`);
    throw err;
  }

  return cached.conn;
}

export async function disconnectDB(logger = console) {
  if (!cached.conn) return;
  await mongoose.disconnect();
  cached = { conn: null, promise: null };
  listenersBound = false;
  logger.info("MongoDB disconnected gracefully");
}

export { mongoose };
export default connectDB;
