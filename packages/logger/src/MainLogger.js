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

winston.addColors(
  Object.fromEntries(
    Object.entries(LEVEL_STYLES).map(([level, style]) => [level, style.color]),
  ),
);

const MAX_LABEL_LENGTH = Math.max(
  ...Object.keys(LEVEL_STYLES).map((l) => l.length),
);

function stripAnsi(text = "") {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

function formatLevelBadge(level) {
  const plain = stripAnsi(level);
  const style = LEVEL_STYLES[plain] || { icon: "•" };
  const label = `${style.icon} ${plain.toUpperCase()}`.padEnd(
    MAX_LABEL_LENGTH + 2,
  );

  return level.replace(plain.toUpperCase(), label).replace(plain, label);
}

/**
 * Custom development log formatter:
 * Badges: [serviceName] and optional [project:projectName]
 */
function createDevFormat(defaultServiceName, defaultProjectName) {
  return combine(
    colorize({ all: false }),
    timestamp({ format: "HH:mm:ss.SSS" }),
    errors({ stack: true }),
    printf(
      ({
        level,
        message,
        timestamp: ts,
        stack,
        service,
        project,
        caller,
        ...meta
      }) => {
        const coloredBadge = formatLevelBadge(level);
        const time = `\x1b[90m${ts}\x1b[0m`;

        const activeService = service || defaultServiceName;
        const activeProject = project || caller || defaultProjectName;

        // Primary service tag
        const svcBadge = `\x1b[36m[${activeService}]\x1b[0m`;

        // Optional project tag (e.g., [client:umbra-vault])
        const projectBadge = activeProject
          ? ` \x1b[33m[client:${activeProject}]\x1b[0m`
          : "";

        // Filter Winston symbols out of extra metadata payload
        const userMeta = Object.fromEntries(
          Object.entries(meta).filter(([key]) => typeof key === "string"),
        );

        const hasExtraData = Object.keys(userMeta).length > 0;
        const extraPayload = hasExtraData
          ? `\n  ${JSON.stringify(userMeta, null, 2)}`
          : "";

        if (stack) {
          const divider = `\x1b[90m${"─".repeat(60)}\x1b[0m`;
          return `${time} ${coloredBadge} ${svcBadge}${projectBadge} ${message}\n${divider}\n${stack}\n${divider}`;
        }

        return `${time} ${coloredBadge} ${svcBadge}${projectBadge} ${message}${extraPayload}`;
      },
    ),
  );
}

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

/**
 * Creates a scoped logger instance.
 *
 * @param {Object|string} options - Configuration object or service name string.
 * @param {string} [options.serviceName="app"] - Name of the running microservice (e.g., 'notification-service').
 * @param {string} [options.projectName] - Optional project source (e.g., 'umbra-vault').
 * @param {string} [options.logLevel] - Winston log level override.
 * @returns {winston.Logger}
 */
export function createMainLogger(options = {}) {
  // Normalize string argument or options object
  const config =
    typeof options === "string" ? { serviceName: options } : options;
  const serviceName = config.serviceName || process.env.SERVICE_NAME || "app";
  const projectName = config.projectName || process.env.PROJECT_NAME || null;

  const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
  );
  const isProduction = process.env.NODE_ENV === "production";

  const defaultMeta = { service: serviceName };
  if (projectName) {
    defaultMeta.project = projectName;
  }

  const transports = [new winston.transports.Console()];

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
    level: config.logLevel || process.env.LOG_LEVEL || "http",
    defaultMeta,
    format: isProduction
      ? prodFormat
      : createDevFormat(serviceName, projectName),
    transports,
    exitOnError: false,
  });
}
