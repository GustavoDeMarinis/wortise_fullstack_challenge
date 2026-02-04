import { router } from "./trpc";
import { articleRouter } from "./routers/articles";
import { cmsRouter } from "./routers/cms";

export const appRouter = router({
  article: articleRouter,
  cms: cmsRouter,
});

export type AppRouter = typeof appRouter;
