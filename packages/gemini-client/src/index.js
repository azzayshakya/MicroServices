import { initGoogleGenAI } from "./client.js";
import { GeminiService } from "./service.js";

/**
 * Factory to construct and return a ready-to-use Gemini AI service.
 *
 * @param {Object} params
 * @param {string} params.apiKey
 * @param {string} [params.model]
 * @param {Object} [params.logger=console]
 * @returns {GeminiService}
 */
export function createGeminiClient({ apiKey, model, logger = console }) {
  const client = initGoogleGenAI({ apiKey, logger });
  return new GeminiService({
    client,
    defaultModel: model,
    logger,
  });
}

export { GeminiService, initGoogleGenAI };
