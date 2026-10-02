import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config.js";
import logger from "../utils/logger.js";

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
    // Keep Redis clean: immediately delete completed & failed entries
    removeOnComplete: true,
    removeOnFail: true,
  },
});

/**
 * Enqueues a notification and logs every detail of the incoming payload.
 */
export async function addNotificationJob(payload) {
  const job = await notificationQueue.add("send-notification", payload);

  logger.info(
    `[QUEUE:ENQUEUED] Job ID: ${job.id} | User: ${payload.userId} | App: ${payload.appId} | Template: ${payload.templateKey}`,
    {
      jobId: job.id,
      userId: payload.userId,
      appId: payload.appId,
      templateKey: payload.templateKey,
      params: payload.params,
      metadata: payload.metadata,
      enqueuedAt: new Date().toISOString(),
    },
  );

  return job;
}

/**
 * DEBUG UTILITY: Call this anytime in code to dump all stored queue jobs to the terminal.
 * Usage: await debugPrintAllJobsInQueue();
 */
export async function debugPrintAllJobsInQueue() {
  try {
    const [waiting, active, delayed, failed] = await Promise.all([
      notificationQueue.getJobs(["waiting"]),
      notificationQueue.getJobs(["active"]),
      notificationQueue.getJobs(["delayed"]),
      notificationQueue.getJobs(["failed"]),
    ]);

    const formatJob = (j) => ({
      id: j.id,
      name: j.name,
      appId: j.data?.appId,
      userId: j.data?.userId,
      templateKey: j.data?.templateKey,
      params: j.data?.params,
      attemptsMade: j.attemptsMade,
    });

    logger.info("========== [DEBUG: REDIS QUEUE DUMP START] ==========");
    logger.info(`WAITING (${waiting.length}):`, waiting.map(formatJob));
    logger.info(`ACTIVE (${active.length}):`, active.map(formatJob));
    logger.info(`DELAYED (${delayed.length}):`, delayed.map(formatJob));
    logger.info(`FAILED (${failed.length}):`, failed.map(formatJob));
    logger.info("========== [DEBUG: REDIS QUEUE DUMP END] ==========");

    return {
      waiting: waiting.length,
      active: active.length,
      delayed: delayed.length,
      failed: failed.length,
      jobs: { waiting, active, delayed, failed },
    };
  } catch (error) {
    logger.error(`[DEBUG: QUEUE DUMP ERROR] ${error.message}`);
    throw error;
  }
}

/**
 * PURGE UTILITY: Clears all jobs and keys associated with this queue from Redis.
 * Usage: await clearAllQueueData();
 */
export async function clearAllQueueData() {
  try {
    logger.warn(
      `[QUEUE:PURGE] Flushing all jobs from queue '${NOTIFICATION_QUEUE_NAME}'...`,
    );
    await notificationQueue.obliterate({ force: true });
    logger.info(
      `[QUEUE:PURGED] Queue '${NOTIFICATION_QUEUE_NAME}' is now completely empty.`,
    );
    return { success: true, message: "Queue obliterated successfully" };
  } catch (error) {
    logger.error(`[QUEUE:PURGE_ERROR] Could not clear queue: ${error.message}`);
    throw error;
  }
}

/**
 * 6:00 AM IST Cron Dispatcher.
 * Uses 'Asia/Kolkata' timezone so it fires at 6:00 AM Indian Standard Time.
 */
export async function initScheduledCronJobs() {
  try {
    await notificationQueue.add(
      MORNING_CRON_JOB_NAME,
      { type: "MORNING_ROUTINE" },
      {
        repeat: {
          pattern: "0 6 * * *", // 6:00 AM every day
          tz: "Asia/Kolkata", // Timezone explicitly locked to India (IST)
        },
        jobId: "daily-6am-ist-morning-routine",
      },
    );
    logger.info("BullMQ 6:00 AM IST Indian routine scheduled successfully.");
  } catch (error) {
    logger.error(`Failed to register 6:00 AM cron job: ${error.message}`);
  }
}
