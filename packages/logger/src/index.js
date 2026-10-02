import winston from "winston";
import { createMainLogger } from "./MainLogger.js";

export { createMainLogger, createMainLogger as createLogger };

export { winston };

export const defaultLogger = createMainLogger();
export default createMainLogger;
