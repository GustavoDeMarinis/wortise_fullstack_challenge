import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { auth } from "@/server/auth/auth";
import { registerSchema } from "@/server/schemas/auth.schema";

export const authRouter = router({
    getSession: publicProcedure.query(({ ctx }) => {
        return ctx.session;
    }),
    register: publicProcedure
        .input(registerSchema)
        .mutation(async ({ input }) => {
            const headers = new Headers();

            await auth.api.signUpEmail({
                body: {
                    email: input.email,
                    password: input.password,
                    name: input.name,
                },
                headers,
            });

            return { success: true };
        }),
    login: publicProcedure
        .input(
            z.object({
                email: z.email(),
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
