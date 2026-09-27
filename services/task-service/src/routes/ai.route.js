const { Router } = require("express");
const { ApiResponse, ApiError } = require("@monorepo/api-response");

function aiRouter(geminiClient) {
  const router = Router();

  router.post("/ai/generate", async (req, res, next) => {
    try {
      const { prompt } = req.body;
      if (!prompt) throw ApiError.badRequest("prompt is required");

      const text = await geminiClient.generateText(prompt);
      res.json(ApiResponse(200, { text }));
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = aiRouter;
