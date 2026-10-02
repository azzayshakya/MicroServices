import { Notification } from "../models/Notification.model.js";
import { compileNotificationContent } from "../templates/templateRegistry.js";
import { socketService } from "./socket.service.js";
import ApiError from "../../../../packages/server-utils/src/api-error.js";
import logger from "../utils/logger.js";

export const notificationService = {
  async processInAppNotification({
    userId,
    appId,
    templateKey,
    params,
    metadata,
  }) {
    // 1. Template Compilation (Throws error on missing fields before touching MongoDB)
    const { title, message } = compileNotificationContent(templateKey, params);

    logger.info(
      `[DB:SAVING] Writing notification to MongoDB for User: ${userId} | App: ${appId} | Template: ${templateKey}`,
      { title, message, metadata },
    );

    // 2. Persist to MongoDB
    const notification = await Notification.create({
      userId,
      appId: appId || "umbra-vault",
      templateKey,
      title,
      message,
      metadata,
    });

    logger.info(
      `[DB:SAVED] Stored document ID: ${notification._id} in MongoDB.`,
    );

    // 3. Count unread
    const unreadCount = await Notification.countDocuments({
      userId,
      appId: appId || "umbra-vault",
      isRead: false,
    });

    // 4. Push to Socket.IO
    socketService.emitToUser(userId, "notification:new", notification);
    socketService.emitToUser(userId, "notification:badge_update", {
      unreadCount,
    });

    logger.info(
      `[SOCKET:EMITTED] Real-time event dispatched to room: user:${userId}`,
    );

    return notification;
  },

  async getNotifications(userId, appId, { page = 1, limit = 10 }) {
    const filter = { userId, appId: appId || "umbra-vault" };
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  },

  async getUnreadCount(userId, appId) {
    const count = await Notification.countDocuments({
      userId,
      appId: appId || "umbra-vault",
      isRead: false,
    });
    return { unreadCount: count };
  },

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      throw ApiError.notFound("Notification not found or access denied");
    }

    const unreadCount = await Notification.countDocuments({
      userId,
      appId: notification.appId,
      isRead: false,
    });

    socketService.emitToUser(userId, "notification:badge_update", {
      unreadCount,
    });
    return notification;
  },

  async markAllAsRead(userId, appId = "umbra-vault") {
    await Notification.updateMany(
      { userId, appId, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    socketService.emitToUser(userId, "notification:badge_update", {
      unreadCount: 0,
    });
    return { success: true };
  },
};
