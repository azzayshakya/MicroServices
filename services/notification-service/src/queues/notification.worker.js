import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.config.js";
import {
  NOTIFICATION_QUEUE_NAME,
  MORNING_CRON_JOB_NAME,
} from "./notification.queue.js";
import { notificationService } from "../services/notification.service.js";
import { morningRoutineService } from "../services/morningRoutine.service.js";
import logger from "../utils/logger.js";

// Set to 'false' in .env or switch manually to keep failed jobs in Redis for inspection
const AUTO_PURGE_FAILED_JOBS = process.env.PURGE_FAILED_JOBS !== "false";

/**
 * Removes rejected or failed jobs from Redis immediately
 */
async function purgeFailedJobFromRedis(job, reason) {
  if (!job) return;
  try {
    await job.remove();
    logger.warn(
      `[REDIS:PURGE] Job ID ${job.id} removed from Redis queue. Reason: ${reason} | App: ${job.data?.appId || "N/A"} | Template: ${job.data?.templateKey || "N/A"} | User: ${job.data?.userId || "N/A"}`,
    );
  } catch (err) {
    logger.error(
      `[REDIS:PURGE_FAILED] Could not purge job ${job.id}: ${err.message}`,
    );
  }
}

export function initNotificationWorker() {
  const worker = new Worker(
    NOTIFICATION_QUEUE_NAME,
    async (job) => {
      logger.info(
        `[WORKER:START] Processing job ${job.id} [${job.name}] | App: ${job.data?.appId || "N/A"} | Template: ${job.data?.templateKey || "N/A"}`,
      );

      // 1. Morning Routine Cron Handler
      if (job.name === MORNING_CRON_JOB_NAME) {
        await morningRoutineService.executeMorningDispatch();
        return;
      }

      // 2. Standard In-App Notification Processing
      const { userId, appId, templateKey, params, metadata } = job.data;

      await notificationService.processInAppNotification({
        userId,
        appId,
        templateKey,
        params,
        metadata,
      });
    },
    { connection: redisConnection },
  );

  worker.on("completed", async (job) => {
    logger.info(
      `[WORKER:SUCCESS] Job ${job.id} [${job.name}] finished. MongoDB synced & Socket emitted. User: ${job.data?.userId || "N/A"}`,
    );
    // Extra safety: ensure completed job key is removed from Redis
    try {
      await job.remove();
    } catch (_) {}
  });

  worker.on("failed", async (job, err) => {
    const errorDetails = {
      jobId: job?.id,
      jobName: job?.name,
      appId: job?.data?.appId || "unknown",
      templateKey: job?.data?.templateKey || "unknown",
      userId: job?.data?.userId || "unknown",
      failureReason: err.message,
      attemptsMade: job?.attemptsMade,
    };

    logger.error(
      `[WORKER:REJECTED] Notification was not processed and dropped! App: ${errorDetails.appId} | Template: ${errorDetails.templateKey} | User: ${errorDetails.userId} | Reason: ${errorDetails.failureReason}`,
      errorDetails,
    );

    // If enabled, purge the rejected job so it never lingers in Redis
    if (AUTO_PURGE_FAILED_JOBS && job) {
      await purgeFailedJobFromRedis(job, err.message);
    }
  });

  return worker;
}
