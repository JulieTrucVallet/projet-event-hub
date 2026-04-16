import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
//import swaggerOptions from "../docs/swagger.config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { jsonApiResponseMiddleware } from "./middlewares/json-api-response.middleware";
import { v1Router } from "./routes/v1/index";

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

//const swaggerSpec = swaggerJSDoc(swaggerOptions);
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(8001, () => {
  console.log("✅ Server is running on port 8001");
});