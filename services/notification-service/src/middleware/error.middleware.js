import { ApiResponse } from "@shared/server-utils";
import logger from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errors = err.errors || [];

  if (statusCode >= 500) {
    logger.error(`[Unhandled Error] ${message}`, {
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn(`[Operational Error] ${message}`, {
      statusCode,
      path: req.originalUrl,
    });
  }

  const responsePayload = ApiResponse.create(statusCode, null, message);
  if (errors.length > 0) {
    responsePayload.errors = errors;
  }

  res.status(statusCode).json(responsePayload);
}
