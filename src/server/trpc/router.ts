import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { articleRouter } from "./routers/articles";

export const appRouter = router({
  auth: authRouter,
  article: articleRouter,
});

export type AppRouter = typeof appRouter;
