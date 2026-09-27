const { Router } = require("express");
const { ApiResponse } = require("@monorepo/api-response");
const { mongoose } = require("@monorepo/mongo-client");

function healthRouter(redisClient) {
  const router = Router();

  router.get("/health", async (req, res) => {
    const mongoState = mongoose.connection.readyState; // 1 = connected
    let redisState = "unknown";

    try {
      redisState = (await redisClient.ping()) === "PONG" ? "connected" : "unreachable";
    } catch {
      redisState = "unreachable";
    }

    res.json(
      ApiResponse(200, {
        mongo: mongoState === 1 ? "connected" : "disconnected",
        redis: redisState,
      }),
    );
  });

  return router;
}

module.exports = healthRouter;
