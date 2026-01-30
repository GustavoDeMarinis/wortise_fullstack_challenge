import { z } from "zod";

export const articleSchema = z.object({
  _id: z.string(),
  title: z.string().min(3).max(150),
  content: z.string().min(10),
  coverImageUrl: z.url(),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.date(),
});

export type Article = z.infer<typeof articleSchema>;

export const createArticleInput = z.object({
  title: z.string().min(3).max(150),
  content: z.string().min(10),
  coverImageUrl: z.url(),
});

export const updateArticleInput = createArticleInput.partial();