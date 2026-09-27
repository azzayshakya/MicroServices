import winston from "winston";
import path from "node:path";
import process from "node:process";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const LEVEL_STYLES = {
  error: { icon: "✖", color: "red" },
  warn: { icon: "⚠", color: "yellow" },
  info: { icon: "ℹ", color: "cyan" },
  http: { icon: "→", color: "magenta" },
  verbose: { icon: "…", color: "blue" },
  debug: { icon: "🐛", color: "gray" },
  silly: { icon: "✧", color: "gray" },
};

// Register custom level colors
winston.addColors(
  Object.fromEntries(
    Object.entries(LEVEL_STYLES).map(([level, style]) => [level, style.color]),
  ),
);

const MAX_LABEL_LENGTH = Math.max(
  ...Object.keys(LEVEL_STYLES).map((l) => l.length),
);

/**
 * Strips ANSI color escape sequences from a string.
 */
function stripAnsi(text = "") {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

/**
 * Formats level badges like '✖ ERROR  ' with consistent alignment.
 */
function formatLevelBadge(level) {
  const plain = stripAnsi(level);
  const style = LEVEL_STYLES[plain] || { icon: "•" };
  const label = `${style.icon} ${plain.toUpperCase()}`.padEnd(
    MAX_LABEL_LENGTH + 2,
  );

  return level.replace(plain.toUpperCase(), label).replace(plain, label);
}

/**
 * Custom development log formatter with icons, service prefix, and clean formatting.
 */
function createDevFormat(serviceName) {
  return combine(
    colorize({ all: false }),
    timestamp({ format: "HH:mm:ss.SSS" }),
    errors({ stack: true }),
    printf(({ level, message, timestamp: ts, stack, service, ...meta }) => {
      const coloredBadge = formatLevelBadge(level);
      const time = `\x1b[90m${ts}\x1b[0m`;
      const svc = `\x1b[36m[${service || serviceName}]\x1b[0m`;

      // Filter out internal Winston symbols so only explicit user meta is serialized
      const userMeta = Object.fromEntries(
        Object.entries(meta).filter(([key]) => typeof key === "string"),
      );

      const hasExtraData = Object.keys(userMeta).length > 0;
      const extraPayload = hasExtraData
        ? `\n  ${JSON.stringify(userMeta, null, 2)}`
        : "";

      if (stack) {
        const divider = `\x1b[90m${"─".repeat(60)}\x1b[0m`;
        return `${time} ${coloredBadge} ${svc} ${message}\n${divider}\n${stack}\n${divider}`;
      }

      return `${time} ${coloredBadge} ${svc} ${message}${extraPayload}`;
    }),
  );
}

/**
 * Standard structured JSON logging for cloud/production environments.
 */
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

/**
 * Factory to create service-scoped logger instances.
 *
 * @param {string} [serviceName="app"] - Identifier shown in log tags
 * @returns {winston.Logger}
 */
export function createLogger(serviceName = "app") {
  const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
  );
  const isProduction = process.env.NODE_ENV === "production";

  const transports = [new winston.transports.Console()];

  // Persist files only in local/server environments, not in serverless runtimes
  if (!isServerless && !isProduction) {
    const logsDir = path.resolve(process.cwd(), "logs");

    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, "error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join(logsDir, "combined.log"),
      }),
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || "http",
    defaultMeta: { service: serviceName },
    format: isProduction ? prodFormat : createDevFormat(serviceName),
    transports,
    exitOnError: false,
  });
}

// Pre-configured default logger instance
export const logger = createLogger(process.env.SERVICE_NAME || "app");

// Export default as the logger instance itself
export default logger;
