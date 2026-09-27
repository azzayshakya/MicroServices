import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.config.js";
import {
  NOTIFICATION_QUEUE_NAME,
  MORNING_CRON_JOB_NAME,
} from "./notification.queue.js";
import { notificationService } from "../services/notification.service.js";
import { morningRoutineService } from "../services/morningRoutine.service.js";
import logger from "@monorepo/logger";

export function initNotificationWorker() {
  const worker = new Worker(
    NOTIFICATION_QUEUE_NAME,
    async (job) => {
      logger.info(`Processing job ${job.id} [${job.name}]`);

      // 1. Handle scheduled 6:00 AM morning routine cron
      if (job.name === MORNING_CRON_JOB_NAME) {
        await morningRoutineService.executeMorningDispatch();
        return;
      }

      // 2. Handle standard event-driven notification dispatch
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

  worker.on("completed", (job) => {
    logger.info(
      `Notification job ${job.id} [${job.name}] completed successfully`,
    );
  });

  worker.on("failed", (job, err) => {
    logger.error(
      `Notification job ${job?.id} [${job?.name}] failed: ${err.message}`,
      {
        attemptsMade: job?.attemptsMade,
        stack: err.stack,
      },
    );
  });

  return worker;
}
