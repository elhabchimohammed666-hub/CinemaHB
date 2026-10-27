import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "streamvibe-api" });
});
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
