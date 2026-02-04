"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";

import {
    createArticleSchema,
    type CreateArticleInput,
} from "@/server/schemas/article.schema";

export default function NewArticlePage() {
    const router = useRouter();
    const createArticle = trpc.article.create.useMutation();

    const form = useForm<CreateArticleInput>({
        resolver: zodResolver(createArticleSchema),
    });

    const onSubmit = (data: CreateArticleInput) => {
        createArticle.mutate(data, {
            onSuccess: (article) => {
                alert("Article created successfully");
                router.push(`/articles/${article.id}`);
            },
        });
    };

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                New Article
            </h1>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <div>
                    <input
                        {...form.register("title")}
                        placeholder="Title"
                        className="w-full border p-2"
                    />
                    {form.formState.errors.title && (
                        <p className="text-sm text-red-600">
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                <div>
                    <textarea
                        {...form.register("content")}
                        placeholder="Content"
                        rows={6}
                        className="w-full border p-2"
                    />
                    {form.formState.errors.content && (
                        <p className="text-sm text-red-600">
                            {form.formState.errors.content.message}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        {...form.register("coverImageUrl")}
                        placeholder="Cover image URL"
                        className="w-full border p-2"
                    />
                    {form.formState.errors.coverImageUrl && (
                        <p className="text-sm text-red-600">
                            {form.formState.errors.coverImageUrl.message}
                        </p>
                    )}
                </div>

                {createArticle.isError && (
                    <p className="text-sm text-red-600">
                        Failed to create article
                    </p>
                )}

                <button
                    type="submit"
                    disabled={createArticle.isPending}
                    className="bg-black text-white px-4 py-2 disabled:opacity-50"
                >
                    {createArticle.isPending
                        ? "Creating..."
                        : "Create Article"}
                </button>
            </form>
        </main>
    );
}
