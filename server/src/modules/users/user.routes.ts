import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { followSchema, profileSchema } from "./user.schemas";
import { followUser, getProfile, unfollowUser } from "./user.controller";

export const userRoutes = Router();

userRoutes.get("/:id", validate(profileSchema), getProfile);
userRoutes.post("/:id/follow", requireAuth, validate(followSchema), followUser);
userRoutes.delete("/:id/follow", requireAuth, validate(followSchema), unfollowUser);
