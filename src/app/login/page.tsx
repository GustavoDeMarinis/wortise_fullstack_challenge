"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import {
    loginSchema,
    type LoginInput,
} from "@/server/schemas/auth.schema";

export default function LoginPage() {
    const router = useRouter();
    const login = trpc.auth.login.useMutation();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginInput) => {
        login.mutate(data, {
            onSuccess: () => {
                // feedback claro
                alert("Login successful. Welcome!");
                router.push("/");
            },
        });
    };

    return (
        <main className="max-w-sm mx-auto mt-10">
            <h1 className="text-xl font-bold mb-4">Login</h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <input
                    {...form.register("email")}
                    placeholder="Email"
                    className="border p-2"
                />
                {form.formState.errors.email && (
                    <span className="text-sm text-red-600">
                        {form.formState.errors.email.message}
                    </span>
                )}

                <input
                    {...form.register("password")}
                    type="password"
                    placeholder="Password"
                    className="border p-2"
                />
                {form.formState.errors.password && (
                    <span className="text-sm text-red-600">
                        {form.formState.errors.password.message}
                    </span>
                )}

                {login.isError && (
                    <p className="text-sm text-red-600">
                        Invalid email or password
                    </p>
                )}

                <button
                    type="submit"
                    disabled={login.isPending}
                    className="bg-black text-white p-2 disabled:opacity-50"
                >
                    {login.isPending ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
}
