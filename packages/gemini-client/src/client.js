import { GoogleGenAI } from "@google/genai";

/**
 * Initializes the underlying GoogleGenAI SDK client.
 *
 * @param {Object} params
 * @param {string} params.apiKey - Google Gemini API Key
 * @param {Object} [params.logger=console]
 * @returns {GoogleGenAI}
 */
export function initGoogleGenAI({ apiKey, logger = console }) {
  if (!apiKey) {
    const errorMsg =
      "[@monorepo/gemini-client] GEMINI_API_KEY is required but was not provided.";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const ai = new GoogleGenAI({ apiKey });
  logger.info("Gemini AI client instance configured successfully");
  return ai;
}
