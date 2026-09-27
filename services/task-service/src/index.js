import express from "express";
import process from "node:process";
import createLogger from "@monorepo/logger";
import { createRedisClient, closeRedisClient } from "@monorepo/redis-client";
import { createMailer } from "@monorepo/mailer";
import { createKafkaClient } from "@monorepo/kafka-client";
import { createGeminiClient } from "@monorepo/gemini-client";

import env from "./config/env.js";
import ApiError from "../../../packages/server-utils/src/api-error.js";
import ApiResponse from "../../../packages/server-utils/src/api-response.js";

const SERVICE_NAME = "task-service";
const logger = createLogger(SERVICE_NAME);

async function start() {
  // --- 1. Redis ---
  let redisClient = null;
  try {
    redisClient = createRedisClient({ url: env.REDIS_URL, logger });
    if (redisClient.status === "wait") await redisClient.connect();
    await redisClient.ping();
    logger.info("Redis ready");
  } catch (err) {
    logger.error(`Redis connection failed: ${err.message || err}`);
    process.exit(1);
  }

  // --- 2. Kafka Producer ---
  let kafkaProducer = null;
  if (env.KAFKA_ENABLED) {
    try {
      const kafka = createKafkaClient(
        {
          clientId: SERVICE_NAME,
          brokers: env.KAFKA_BROKERS,
          username: env.KAFKA_USERNAME,
          password: env.KAFKA_PASSWORD,
          caCertPath: env.KAFKA_CA_CERT_PATH,
        },
        logger,
      );

      kafkaProducer = kafka.createProducer();
      await kafkaProducer.connect();
    } catch (err) {
      logger.warn(
        `Kafka failed to connect, continuing without it: ${err.message}`,
      );
      kafkaProducer = null;
    }
  } else {
    logger.info("Kafka disabled (set KAFKA_ENABLED=true to enable)");
  }

  // --- 3. Mailer ---
  let mailer = null;
  if (env.MAIL_ENABLED) {
    try {
      mailer = createMailer({
        smtp: env.MAIL.smtp,
        from: env.MAIL.from,
        logger,
      });
      await mailer.verify();
    } catch (err) {
      logger.warn(`Mailer failed: ${err.message}`);
      mailer = null;
    }
  } else {
    logger.info("Mailer disabled (set MAIL_ENABLED=true to enable)");
  }

  // --- 4. Gemini AI Client ---
  let geminiClient = null;
  if (env.GEMINI_ENABLED && env.GEMINI_API_KEY) {
    try {
      geminiClient = createGeminiClient({
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL,
        logger,
      });
      logger.info(`Gemini AI service ready with model: ${env.GEMINI_MODEL}`);
    } catch (err) {
      logger.warn(`Gemini client failed to initialize: ${err.message}`);
      geminiClient = null;
    }
  } else {
    logger.info("Gemini disabled (set GEMINI_ENABLED=true to enable)");
  }

  // --- 5. Express Server & Routes ---
  const app = express();
  app.use(express.json());

  app.locals.redis = redisClient;
  if (kafkaProducer) app.locals.kafkaProducer = kafkaProducer;
  if (mailer) app.locals.mailer = mailer;
  if (geminiClient) app.locals.gemini = geminiClient;

  // Unified Health Check
  app.get("/health", async (req, res) => {
    res.status(200).json(
      ApiResponse.ok({
        service: SERVICE_NAME,
        redis: "healthy",
        kafka: kafkaProducer?.isConnected ? "connected" : "disabled/offline",
        mailer: mailer?.isVerified ? "ready" : "disabled/offline",
        gemini: geminiClient ? "ready" : "disabled/offline",
        timestamp: new Date().toISOString(),
      }),
    );
  });

  // Kafka Event Publishing Route
  app.post("/api/events/publish", async (req, res, next) => {
    if (!kafkaProducer) {
      return next(ApiError.internal("Kafka producer is offline or disabled"));
    }

    try {
      const {
        topic = "task-events",
        eventName = "TASK_CREATED",
        data = {},
      } = req.body;

      await kafkaProducer.sendEvent({
        topic,
        key: data.id || Date.now().toString(),
        value: {
          event: eventName,
          payload: data,
          timestamp: new Date().toISOString(),
        },
      });

      res.status(200).json(ApiResponse.ok(null, `Event published to ${topic}`));
    } catch (err) {
      next(err);
    }
  });

  // Gemini AI Text Generation Route
  app.post("/api/ai/generate", async (req, res, next) => {
    if (!geminiClient) {
      return next(
        ApiError.internal("Gemini AI service is offline or disabled"),
      );
    }

    try {
      const { prompt, model } = req.body;

      if (!prompt || typeof prompt !== "string") {
        throw ApiError.badRequest("Prompt is required and must be a string");
      }

      const generatedText = await geminiClient.generateText(prompt, { model });

      res
        .status(200)
        .json(
          ApiResponse.ok(
            { text: generatedText },
            "Text generated successfully",
          ),
        );
    } catch (err) {
      next(err.isOperational ? err : ApiError.internal(err.message));
    }
  });

  // Central Error Handler
  app.use((err, req, res, next) => {
    const isOperational = Boolean(err.isOperational);
    const statusCode = isOperational ? err.statusCode : 500;
    const message = isOperational ? err.message : "Internal server error";

    if (!isOperational) {
      logger.error(err.stack || err.message);
    }

    res.status(statusCode).json({
      statusCode,
      success: false,
      message,
      errors: err.errors || [],
    });
  });

  const server = app.listen(env.PORT, () => {
    logger.info(`${SERVICE_NAME} listening on port ${env.PORT}`);
  });

  // Graceful termination handling
  const handleShutdown = async (signal) => {
    logger.info(`${signal} received: closing connections...`);
    server.close(async () => {
      if (kafkaProducer) await kafkaProducer.disconnect();
      if (mailer) await mailer.close();
      if (redisClient) await closeRedisClient(logger);
      logger.info("Shutdown complete.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
}

start();
