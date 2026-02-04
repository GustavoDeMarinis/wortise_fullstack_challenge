"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
    loginSchema,
    type LoginInput,
} from "@/server/schemas/auth.schema";

export default function LoginPage() {
    const router = useRouter();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        const res = await fetch("/api/auth/sign-in/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        });

        if (!res.ok) {
            alert("Invalid email or password");
            return;
        }

        alert("Login successful. Welcome!");
        router.push("/");
    };

    return (
        <main className="max-w-sm mx-auto mt-10">
            <h1 className="text-xl font-bold mb-4">Login</h1>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
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

                <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="bg-black text-white p-2 disabled:opacity-50"
                >
                    {form.formState.isSubmitting
                        ? "Logging in..."
                        : "Login"}
                </button>
            </form>
        </main>
    );
}
