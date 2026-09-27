// src/services/morningRoutine.service.js
import { Notification } from "../models/Notification.model.js";
import { addNotificationJob } from "../queues/notification.queue.js";
import logger from "@monorepo/logger";

// Concise coding quotes (< 12 words)
const MOTIVATIONAL_QUOTES = [
  "Make it work, make it right, make it fast.",
  "Simplicity is the prerequisite for reliability.",
  "First solve the problem, then write the code.",
  "Clean code always looks like it was written by someone who cares.",
  "One clean commit every day builds empires.",
  "A bug today is just a test case you haven't written yet.",
];

// Fixed calendar festivals format: MM-DD
const FESTIVALS = {
  "01-01": "New Year",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "10-24": "Diwali",
  "12-25": "Christmas",
};

export const morningRoutineService = {
  async executeMorningDispatch() {
    logger.info("Executing 6:00 AM Morning Dispatch...");

    // Get distinct user IDs that have used the app
    const activeUserIds = await Notification.distinct("userId", {
      appId: "umbra-vault",
    });

    if (!activeUserIds.length) {
      logger.info("No active users found to dispatch morning notifications.");
      return;
    }

    const now = new Date();
    const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });
    const monthDay = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const festivalToday = FESTIVALS[monthDay];

    // Pick 1 random quote for today's dev pulse
    const randomQuote =
      MOTIVATIONAL_QUOTES[
        Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
      ];

    for (const userId of activeUserIds) {
      // 1. Festival Check vs Standard Greeting
      if (festivalToday) {
        await addNotificationJob({
          userId,
          appId: "umbra-vault",
          templateKey: "FESTIVAL_WISHES",
          params: { name: "there", festivalName: festivalToday },
          metadata: { category: "holiday", date: monthDay },
        });
      } else {
        await addNotificationJob({
          userId,
          appId: "umbra-vault",
          templateKey: "DAILY_GREETING",
          params: { name: "there", day: dayOfWeek },
          metadata: { category: "daily_greeting" },
        });
      }

      // 2. Dev Motivation Pulse
      await addNotificationJob({
        userId,
        appId: "umbra-vault",
        templateKey: "DEV_MOTIVATION",
        params: { quote: randomQuote },
        metadata: { category: "dev_pulse" },
      });
    }

    logger.info(`Morning dispatch finished for ${activeUserIds.length} users.`);
  },
};
