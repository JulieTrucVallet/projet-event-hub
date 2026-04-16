import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { jsonApiResponseMiddleware } from "./middlewares/json-api-response.middleware";
import { v1Router } from "./routes/v1/index";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    })
  );

  app.use(jsonApiResponseMiddleware);
  app.use("/api/v1", v1Router);
  app.use(errorHandler);

  return app;
}