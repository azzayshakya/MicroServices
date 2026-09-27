import { Router } from "express";
import {
  triggerNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getAllNotificationsDebug,
} from "../controllers/notification.controller.js";
import { requireInternalKey } from "../middleware/auth.middleware.js";

const router = Router();

// Endpoint invoked by Umar Vault backend
router.post("/send", requireInternalKey, triggerNotification);

// Endpoints consumed by client UI bell component
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.get("/debug-all", getAllNotificationsDebug);

export default router;
