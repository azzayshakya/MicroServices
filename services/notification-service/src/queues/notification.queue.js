import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config.js";
import logger from "@monorepo/logger";

export const NOTIFICATION_QUEUE_NAME = "notifications-dispatch";
export const MORNING_CRON_JOB_NAME = "morning-dispatch-cron";

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 500,
    removeOnFail: 1000,
  },
});

export async function addNotificationJob(payload) {
  const job = await notificationQueue.add("send-notification", payload);
  logger.info(
    `Job ${job.id} enqueued for user ${payload.userId} [${payload.templateKey}]`,
  );
  return job;
}

/**
 * Registers the daily 6:00 AM repeatable cron task in BullMQ.
 * Uses a fixed jobId to guarantee idempotency across microservice restarts.
 */
export async function initScheduledCronJobs() {
  try {
    await notificationQueue.add(
      MORNING_CRON_JOB_NAME,
      { type: "MORNING_ROUTINE" },
      {
        repeat: {
          pattern: "0 6 * * *", // 6:00 AM every day
        },
        jobId: "daily-6am-morning-routine",
      },
    );
    logger.info("BullMQ 6:00 AM morning routine cron scheduled successfully.");
  } catch (error) {
    logger.error(`Failed to register 6:00 AM cron job: ${error.message}`);
  }
}
