import { TRPCError } from "@trpc/server";
import { middleware, publicProcedure } from "./trpc";

export const protectedProcedure = publicProcedure.use(
  middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        user: ctx.user,
      },
    });
  })
);
