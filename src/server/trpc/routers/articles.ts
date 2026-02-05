import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

import {
  articleIdSchema,
  createArticleSchema,
  updateArticleSchema,
} from "@/server/schemas/article.schema";

import {
  createArticle,
  getArticleById,
  listArticles,
  updateArticle,
  softDeleteArticle,
  listArticlesPaginated,
} from "@/server/repositories/article.repository";
import { paginationSchema, searchQuerySchema } from "@/server/schemas";
import { searchArticles, searchArticlesPaginated } from "@/server/queries/article.search";
import z from "zod";

const create = protectedProcedure
  .input(createArticleSchema)
  .mutation(async ({ input, ctx }) => {
    return createArticle({
      ...input,
      authorId: ctx.user.id,
      authorName: ctx.user.name,
    });
  });

const getById = publicProcedure
  .input(articleIdSchema)
  .query(async ({ input }) => {
    const article = await getArticleById(input.id);

    if (!article) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    }

    return article;
  });

const list = publicProcedure.query(async () => {
  return listArticles();
});

const update = protectedProcedure
  .input(
    articleIdSchema.extend({
      title: updateArticleSchema.shape.title,
      content: updateArticleSchema.shape.content,
    })
  )
  .mutation(async ({ input, ctx }) => {
    const article = await getArticleById(input.id);

    if (!article) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    }

    if (article.authorId !== ctx.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not the author of this article",
      });
    }

    const updated = await updateArticle(input.id, {
      title: input.title,
      content: input.content,
    });

    if (!updated) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    }

    return updated;
  });


const remove = protectedProcedure
  .input(articleIdSchema)
  .mutation(async ({ input, ctx }) => {
    const article = await getArticleById(input.id);

    if (!article) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    }

    if (article.authorId !== ctx.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not the author of this article",
      });
    }

    const success = await softDeleteArticle(input.id);

    if (!success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Article not found",
      });
    }

    return { success: true };
  });

const search = publicProcedure
  .input(searchQuerySchema)
  .query(async ({ input }) => {
    return searchArticles(input.q);
  });

const listPaginated = publicProcedure
  .input(paginationSchema.optional())
  .query(({ input }) => {
    return listArticlesPaginated(input);
  });

const searchPaginated = publicProcedure
  .input(
    paginationSchema.extend({
      q: z.string().optional(),
    })
  )
  .query(({ input }) => {
    return searchArticlesPaginated(input.q, input);
  })

export const articleRouter = router({
  create,
  getById,
  list,
  update,
  delete: remove,
  search,
  listPaginated,
  searchPaginated,
});