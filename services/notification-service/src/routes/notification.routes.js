import { Router } from "express";
import {
  triggerNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getAllNotificationsDebug,
  getQueueDebugDump,
  purgeRedisQueue,
} from "../controllers/notification.controller.js";
import { requireInternalKey } from "../middleware/auth.middleware.js";

const router = Router();

// Umbra Vault Core Dispatcher
router.post("/send", requireInternalKey, triggerNotification);

// UI Client Endpoints
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

// ── Debug & Queue Management Endpoints ───────────────────────────────
// View latest 20 items in MongoDB
router.get("/debug-all", getAllNotificationsDebug);

// Dump all waiting/active/delayed/failed Redis jobs directly to the terminal
router.get("/debug-queue", getQueueDebugDump);

// Wipe/flush all queue data from Redis
router.delete("/debug-queue-purge", purgeRedisQueue);

export default router;
