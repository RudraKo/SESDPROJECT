import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { getFeed } from "./feed.controller";

export const feedRoutes = Router();

feedRoutes.get("/", requireAuth, getFeed);
