import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    imageUrl: z.string().url(),
    caption: z.string().max(500).optional()
  })
});

export const postIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const commentSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    content: z.string().min(1).max(300)
  })
});
