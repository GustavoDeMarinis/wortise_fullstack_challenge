"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import {
    registerSchema,
    type RegisterInput,
} from "@/server/schemas/auth.schema";

export default function RegisterPage() {
    const router = useRouter();
    const registerUser = trpc.auth.register.useMutation();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterInput) => {
        registerUser.mutate(data, {
            onSuccess: () => {
                // feedback claro
                alert("Account created successfully. You can now log in.");
                router.push("/login");
            },
        });
    };
    return (
        <main className="max-w-sm mx-auto mt-10">
            <h1 className="text-xl font-bold mb-4">Register</h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
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

                {registerUser.isError && (
                    <p className="text-sm text-red-600">
                        Could not create account. Try a different email.
                    </p>

                )}

                <button
                    type="submit"
                    disabled={registerUser.isPending}
                    className="bg-black text-white p-2 disabled:opacity-50"
                >
                    {registerUser.isPending ? "Creating account..." : "Register"}
                </button>
            </form>
        </main>
    );
}
