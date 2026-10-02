import { ApiError } from "@shared/server-utils";
import { ENV } from "../config/env.config.js";

export function requireInternalKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== ENV.INTERNAL_API_KEY) {
    return next(ApiError.unauthorized("Forbidden: Invalid internal API key"));
  }

  next();
}
