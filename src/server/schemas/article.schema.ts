import { z } from "zod";

export const articleSchema = z.object({
  id: z.string(),

  title: z.string().min(3).max(150),
  content: z.string().min(10),
  coverImageUrl: z.url(),

  authorId: z.string(),
  authorName: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const articleIdSchema = z.object({
  id: z.string().min(1),
});

export const createArticleSchema = z.object({
  title: z.string().min(3).max(150),
  content: z.string().min(10),
  coverImageUrl: z.url(),
});

export const updateArticleSchema = createArticleSchema.partial();

export type Article = z.infer<typeof articleSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleIdInput = z.infer<typeof articleIdSchema>;
