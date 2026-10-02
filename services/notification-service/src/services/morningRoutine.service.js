import { Notification } from "../models/Notification.model.js";
import { addNotificationJob } from "../queues/notification.queue.js";
import { getIndianCalendarEvent } from "../constants/indianCalendar.js";
import logger from "../utils/logger.js";

const MOTIVATIONAL_QUOTES = [
  "Make it work, make it right, make it fast.",
  "Simplicity is the prerequisite for reliability.",
  "First solve the problem, then write the code.",
  "Clean code always looks like it was written by someone who cares.",
  "One clean commit every day builds empires.",
  "A bug today is just a test case you haven't written yet.",
  "Consistency beats intensity in engineering.",
  "Refactor early, test continuously, ship confidently.",
];

export const morningRoutineService = {
  async executeMorningDispatch() {
    logger.info(
      "========== [6:00 AM IST MORNING ROUTINE TRIGGERED] ==========",
    );

    // 1. Fetch all distinct active users across both project spellings
    const activeUserIds = await Notification.distinct("userId", {
      appId: { $in: ["umbra-vault", "umar-vault"] },
    });

    // Explicitly print the user IDs so you can verify in terminal logs
    logger.info(`[USERS_FOUND] Total active users: ${activeUserIds.length}`);
    logger.info(`[USER_IDS_LIST]: ${JSON.stringify(activeUserIds)}`);

    if (!activeUserIds.length) {
      logger.warn("No active users found to dispatch morning notifications.");
      return;
    }

    // 2. Compute date details using Indian Standard Time
    const event = getIndianCalendarEvent(new Date());
    logger.info(
      `[CALENDAR_STATUS] Date (IST): ${event.monthDay} | Day: ${event.dayOfWeek} | Festival: ${event.festival || "None"} | New Month: ${event.isFirstDayOfMonth ? event.monthName : "No"}`,
    );

    // Pick 1 random quote
    const randomQuote =
      MOTIVATIONAL_QUOTES[
        Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
      ];

    for (const userId of activeUserIds) {
      // Priority 1: Indian Festival / Jayanti
      if (event.festival) {
        await addNotificationJob({
          userId,
          appId: "umbra-vault",
          templateKey: "FESTIVAL_WISHES",
          params: { name: "there", festivalName: event.festival },
          metadata: { category: "holiday", date: event.monthDay },
        });
      }
      // Priority 2: 1st Day of a New Month
      else if (event.isFirstDayOfMonth) {
        await addNotificationJob({
          userId,
          appId: "umbra-vault",
          templateKey: "NEW_MONTH_WISHES",
          params: { name: "there", monthName: event.monthName },
          metadata: { category: "new_month", month: event.monthName },
        });
      }
      // Priority 3: Standard Daily Greeting
      else {
        await addNotificationJob({
          userId,
          appId: "umbra-vault",
          templateKey: "DAILY_GREETING",
          params: { name: "there", day: event.dayOfWeek },
          metadata: { category: "daily_greeting" },
        });
      }

      // Priority 4: Short Dev Motivation Pulse (< 12 words)
      await addNotificationJob({
        userId,
        appId: "umbra-vault",
        templateKey: "DEV_MOTIVATION",
        params: { quote: randomQuote },
        metadata: { category: "dev_pulse" },
      });
    }

    logger.info(
      `[MORNING_ROUTINE_COMPLETED] Dispatched for ${activeUserIds.length} users.`,
    );
  },
};
