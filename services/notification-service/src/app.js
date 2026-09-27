import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { ENV } from "./config/env.config.js";
import ApiError from "../../../packages/server-utils/src/api-error.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3005",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://umbravault.vercel.app",
  ...(ENV.CLIENT_URL ? [ENV.CLIENT_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get(["/health", "/api/v1/health"], (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "notification-service",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

app.use("/api/v1", routes);

// 404 Catch-all handler
app.use((req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
