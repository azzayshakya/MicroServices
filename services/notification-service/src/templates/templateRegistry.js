// src/templates/templateRegistry.js
import ApiError from "../../../../packages/server-utils/src/api-error.js";
import { renderTemplate } from "./templateEngine.js";

export const TEMPLATE_REGISTRY = {
  // Existing Security & Auth Templates
  ACCOUNT_CREATED: {
    title: "Account Created Successfully",
    messageTemplate:
      "Welcome {{name}}! Your Umar Vault account was created on {{date}}.",
    requiredFields: ["name", "date"],
  },
  DEVICE_LOGIN: {
    title: "New Device Login",
    messageTemplate:
      "New login detected from device {{deviceId}} on {{dateTime}}.",
    requiredFields: ["deviceId", "dateTime"],
  },
  PASSWORD_UPDATED: {
    title: "Security Alert: Password Changed",
    messageTemplate:
      "Your password was updated on {{date}} from {{device}} (IP: {{ip}}).",
    requiredFields: ["date", "device", "ip"],
  },

  // 6:00 AM Cron Templates
  DAILY_GREETING: {
    title: "Good Morning, {{name}}!",
    messageTemplate:
      "Happy {{day}}! Wishing you a productive day in your vault.",
    requiredFields: ["name", "day"],
  },
  FESTIVAL_WISHES: {
    title: "Happy {{festivalName}}!",
    messageTemplate:
      "Dear {{name}}, Umar Vault wishes you and your family a joyful {{festivalName}}!",
    requiredFields: ["name", "festivalName"],
  },
  DEV_MOTIVATION: {
    title: "Daily Dev Pulse",
    messageTemplate: "{{quote}}",
    requiredFields: ["quote"],
  },
};

export function compileNotificationContent(templateKey, params = {}) {
  const templateDef = TEMPLATE_REGISTRY[templateKey];

  if (!templateDef) {
    throw ApiError.badRequest(
      `Invalid or unregistered templateKey: "${templateKey}". Notification dropped.`,
    );
  }

  const title = renderTemplate(
    templateDef.title,
    params,
    templateDef.requiredFields.filter((f) =>
      templateDef.title.includes(`{{${f}}}`),
    ),
  );

  const message = renderTemplate(
    templateDef.messageTemplate,
    params,
    templateDef.requiredFields,
  );

  return { title, message };
}
