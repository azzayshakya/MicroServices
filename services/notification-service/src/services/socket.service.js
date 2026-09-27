import { getIO } from "../sockets/socket.js";
import logger from "@monorepo/logger";

export const socketService = {
  emitToUser(userId, event, payload) {
    const io = getIO();
    if (!io) {
      logger.warn("Socket.io instance requested before initialization");
      return;
    }
    io.to(`user:${userId}`).emit(event, payload);
  },
};
