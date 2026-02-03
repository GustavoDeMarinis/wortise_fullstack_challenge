import { router } from "./trpc";
import { articleRouter } from "./routers/articles";

export const appRouter = router({
  article: articleRouter,
});

export type AppRouter = typeof appRouter;
