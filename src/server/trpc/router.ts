import { router } from "./trpc";
// routers will be added here later
// import { articleRouter } from "./routers/article.router";

export const appRouter = router({
  // article: articleRouter,
});

export type AppRouter = typeof appRouter;
