export class GeminiService {
  /**
   * @param {Object} params
   * @param {import("@google/genai").GoogleGenAI} params.client
   * @param {string} [params.defaultModel="gemini-2.5-flash"]
   * @param {Object} [params.logger=console]
   */
  constructor({ client, defaultModel = "gemini-2.5-flash", logger = console }) {
    this.client = client;
    this.defaultModel = defaultModel;
    this.logger = logger;
  }

  /**
   * Generates text content using the configured Gemini model.
   *
   * @param {string} prompt - Input text or instructions
   * @param {Object} [options={}]
   * @param {string} [options.model] - Model override
   * @param {number} [options.temperature]
   * @param {number} [options.maxOutputTokens]
   * @returns {Promise<string>} Generated text
   */
  async generateText(prompt, options = {}) {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string.");
    }

    const model = options.model || this.defaultModel;

    try {
      const response = await this.client.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: options.temperature,
          maxOutputTokens: options.maxOutputTokens,
        },
      });

      const text = response?.text;

      if (!text) {
        this.logger.warn(
          `Gemini returned an empty response for model: ${model}`,
        );
        throw new Error("Gemini returned an empty response.");
      }

      return text;
    } catch (err) {
      this.logger.error(`Gemini API call failed: ${err.message || err}`);
      throw err;
    }
  }

  /**
   * Generates a structured JSON response by applying JSON response schema constraints.
   *
   * @param {string} prompt
   * @param {Object} schema - JSON schema definition
   * @param {Object} [options={}]
   */
  async generateJson(prompt, schema, options = {}) {
    const model = options.model || this.defaultModel;

    try {
      const response = await this.client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: options.temperature ?? 0.1,
        },
      });

      return JSON.parse(response.text);
    } catch (err) {
      this.logger.error(`Gemini JSON generation failed: ${err.message || err}`);
      throw err;
    }
  }
}
