import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { postRoutes } from "./modules/posts/post.routes";
import { feedRoutes } from "./modules/feed/feed.routes";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);
  app.use("/feed", feedRoutes);

  app.use(errorHandler);

  return app;
};
