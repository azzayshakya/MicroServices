import ApiError from "../../../../packages/server-utils/src/api-error.js";

/**
 * Interpolates variables within {{variable}} syntax.
 * Rejects if a required variable is missing.
 */
export function renderTemplate(templateStr, params = {}, requiredParams = []) {
  const missing = requiredParams.filter(
    (param) => params[param] === undefined || params[param] === null,
  );

  if (missing.length > 0) {
    throw ApiError.badRequest(
      `Missing required template parameters: ${missing.join(", ")}`,
    );
  }

  return templateStr.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : "";
  });
}
