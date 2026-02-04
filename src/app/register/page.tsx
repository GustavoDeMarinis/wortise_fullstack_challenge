"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
    registerSchema,
    type RegisterInput,
} from "@/server/schemas/auth.schema";

export default function RegisterPage() {
    const router = useRouter();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        const res = await fetch("/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.name,
            }),
        });

        if (!res.ok) {
            alert("Could not create account. Try a different email.");
            return;
        }

        alert("Account created successfully. You can now log in.");
        router.push("/login");
    };

    return (
        <main className="max-w-sm mx-auto mt-10">
            <h1 className="text-xl font-bold mb-4">Register</h1>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <input
                    {...form.register("name")}
                    placeholder="Name"
                    className="border p-2"
                />
                {form.formState.errors.name && (
                    <span className="text-sm text-red-600">
                        {form.formState.errors.name.message}
                    </span>
                )}

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
                        ? "Creating account..."
                        : "Register"}
                </button>
            </form>
        </main>
    );
}
