import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createPostSchema, postIdSchema, commentSchema } from "./post.schemas";
import { addComment, createPost, likePost, listComments, unlikePost } from "./post.controller";

export const postRoutes = Router();

postRoutes.post("/", requireAuth, validate(createPostSchema), createPost);
postRoutes.post("/:id/like", requireAuth, validate(postIdSchema), likePost);
postRoutes.delete("/:id/like", requireAuth, validate(postIdSchema), unlikePost);
postRoutes.post("/:id/comments", requireAuth, validate(commentSchema), addComment);
postRoutes.get("/:id/comments", validate(postIdSchema), listComments);
