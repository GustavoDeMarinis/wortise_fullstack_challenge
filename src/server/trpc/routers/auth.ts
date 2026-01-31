import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { auth } from "@/server/auth/auth";

export const authRouter = router({
    getSession: publicProcedure.query(({ ctx }) => {
        return ctx.session;
    }),

    login: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(8),
            })
        )
        .mutation(async ({ input }) => {
            return auth.api.signInEmail({
                body: {
                    email: input.email,
                    password: input.password,
                },
            });
        }),

    logout: publicProcedure.mutation(async () => {
        return auth.api.signOut();
    }),
});
