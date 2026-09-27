import { addNotificationJob } from "../queues/notification.queue.js";
import { notificationService } from "../services/notification.service.js";
import { TEMPLATE_REGISTRY } from "../templates/templateRegistry.js";
import ApiError from "../../../../packages/server-utils/src/api-error.js";
import ApiResponse from "../../../../packages/server-utils/src/api-response.js";
import { Notification } from "../models/Notification.model.js";

export const triggerNotification = async (req, res, next) => {
  try {
    const {
      userId,
      appId = "umbra-vault",
      templateKey,
      params = {},
      metadata = {},
    } = req.body;

    if (!userId || !templateKey) {
      throw ApiError.badRequest(
        "Fields 'userId' and 'templateKey' are required.",
      );
    }

    if (!TEMPLATE_REGISTRY[templateKey]) {
      throw ApiError.badRequest(
        `Unknown templateKey: '${templateKey}'. Registered types: ${Object.keys(TEMPLATE_REGISTRY).join(", ")}`,
      );
    }

    await addNotificationJob({ userId, appId, templateKey, params, metadata });

    return res
      .status(202)
      .json(
        ApiResponse.created(
          null,
          "Notification accepted for background dispatch",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const { userId, appId = "umbra-vault", page = 1, limit = 10 } = req.query;

    if (!userId) {
      throw ApiError.badRequest("Query parameter 'userId' is required.");
    }

    const result = await notificationService.getNotifications(userId, appId, {
      page,
      limit,
    });

    return res
      .status(200)
      .json(ApiResponse.ok(result, "Notifications fetched successfully"));
  } catch (error) {
    next(error);
  }
};
export const getAllNotificationsDebug = async (req, res, next) => {
  try {
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json(
      ApiResponse.ok(
        {
          totalInDb: notifications.length,
          notifications,
        },
        "All notifications directly from MongoDB",
      ),
    );
  } catch (error) {
    next(error);
  }
};
export const getUnreadCount = async (req, res, next) => {
  try {
    const { userId, appId = "umbra-vault" } = req.query;

    if (!userId) {
      throw ApiError.badRequest("Query parameter 'userId' is required.");
    }

    const result = await notificationService.getUnreadCount(userId, appId);

    return res
      .status(200)
      .json(ApiResponse.ok(result, "Unread count fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw ApiError.badRequest("Body property 'userId' is required.");
    }

    const result = await notificationService.markAsRead(id, userId);

    return res
      .status(200)
      .json(ApiResponse.ok(result, "Notification marked as read"));
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const { userId, appId = "umbra-vault" } = req.body;

    if (!userId) {
      throw ApiError.badRequest("Body property 'userId' is required.");
    }

    const result = await notificationService.markAllAsRead(userId, appId);

    return res
      .status(200)
      .json(ApiResponse.ok(result, "All notifications marked as read"));
  } catch (error) {
    next(error);
  }
};
