import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    appId: {
      type: String,
      required: true,
      default: "umbra-vault",
      index: true,
    },
    templateKey: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ userId: 1, appId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, appId: 1, isRead: 1 });

// Auto-delete notifications older than 90 days to prevent uncontrolled database growth
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

export const Notification = mongoose.model("Notification", notificationSchema);
