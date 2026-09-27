import { Notification } from "../models/Notification.model.js";
import { compileNotificationContent } from "../templates/templateRegistry.js";
import { socketService } from "./socket.service.js";
import ApiError from "../../../../packages/server-utils/src/api-error.js";

export const notificationService = {
  /**
   * Persists in-app alert and pushes to user's real-time socket room.
   */
  async processInAppNotification({
    userId,
    appId,
    templateKey,
    params,
    metadata,
  }) {
    const { title, message } = compileNotificationContent(templateKey, params);

    const notification = await Notification.create({
      userId,
      appId: appId || "umbra-vault",
      templateKey,
      title,
      message,
      metadata,
    });

    const unreadCount = await Notification.countDocuments({
      userId,
      appId: appId || "umbra-vault",
      isRead: false,
    });

    // Real-time events to power the UI bell icon
    socketService.emitToUser(userId, "notification:new", notification);
    socketService.emitToUser(userId, "notification:badge_update", {
      unreadCount,
    });

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
