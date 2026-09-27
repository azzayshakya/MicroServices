import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import logger from "@monorepo/logger";
import { redisConnection } from "../config/redis.config.js";
import { ENV } from "../config/env.config.js";

let io = null;

export function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const pubClient = redisConnection;
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    logger.debug(`Socket connected: ${socket.id}`);

    socket.on("join:user", (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        logger.debug(`Socket ${socket.id} joined room: user:${userId}`);
      }
    });

    socket.on("disconnect", () => {
      logger.debug(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}
