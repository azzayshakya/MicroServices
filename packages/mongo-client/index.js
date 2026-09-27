import mongoose from "mongoose";

let cached = { conn: null, promise: null };

/**
 * connectDB(uri, logger) -> mongoose connection
 * Caches the connection across reloads.
 */
export async function connectDB(uri, logger = console) {
  if (!uri) {
    throw new Error("MONGO_URI is required to connect to MongoDB");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((instance) => {
        logger.info("MongoDB connected");
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

  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected"),
  );
  mongoose.connection.on("error", (err) =>
    logger.error(`MongoDB error: ${err.message}`),
  );

  return cached.conn;
}

export async function disconnectDB() {
  if (!cached.conn) return;
  await mongoose.disconnect();
  cached = { conn: null, promise: null };
}

export { mongoose };
export default connectDB;
