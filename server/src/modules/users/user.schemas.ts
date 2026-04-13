import { z } from "zod";

export const followSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const profileSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
