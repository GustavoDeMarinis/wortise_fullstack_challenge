"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/utils/trpc";
import {
    updateArticleSchema,
    type UpdateArticleInput,
} from "@/server/schemas/article.schema";

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const articleId = params.id;

    const articleQuery = trpc.article.getById.useQuery(
        { id: articleId },
        { retry: false }
    );

    const updateArticle = trpc.article.update.useMutation();
    const deleteArticle = trpc.article.delete.useMutation();

    const form = useForm<UpdateArticleInput>({
        resolver: zodResolver(updateArticleSchema),
    });

    useEffect(() => {
        if (articleQuery.data) {
            form.reset({
                title: articleQuery.data.title,
                content: articleQuery.data.content,
            });
        }
    }, [articleQuery.data, form]);

    const onSubmit = (data: UpdateArticleInput) => {
        updateArticle.mutate(
            { id: articleId, ...data },
            {
                onSuccess: () => {
                    alert("Article updated successfully");
                    router.push(`/articles/${articleId}`);
                },
            }
        );
    };

    const onDelete = () => {
        if (confirm("Are you sure you want to delete this article?")) {
            deleteArticle.mutate(
                { id: articleId },
                {
                    onSuccess: () => {
                        alert("Article deleted successfully");
                        router.push("/articles");
                    },
                }
            );
        }
    };
    const handleDelete = () => {
        const confirmed = confirm(
            "Are you sure you want to delete this article? This action cannot be undone."
        );

        if (!confirmed) return;

        deleteArticle.mutate(
            { id: articleId },
            {
                onSuccess: () => {
                    alert("Article deleted successfully");
                    router.push("/articles");
                },
            }
        );
    };

    if (articleQuery.isLoading) {
        return <p className="p-4">Loading...</p>;
    }

    if (articleQuery.isError) {
        return (
            <p className="p-4 text-red-600">
                Article not found or you don't have access
            </p>
        );
    }

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Article</h1>

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
                        rows={6}
                        placeholder="Content"
                        className="w-full border p-2"
                    />
                    {form.formState.errors.content && (
                        <p className="text-sm text-red-600">
                            {form.formState.errors.content.message}
                        </p>
                    )}
                </div>

                {updateArticle.isError && (
                    <p className="text-sm text-red-600">
                        You are not allowed to edit this article
                    </p>
                )}
                {deleteArticle.isError && (
                    <p className="text-sm text-red-600">
                        You are not allowed to delete this article
                    </p>
                )}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={updateArticle.isPending}
                        className="bg-black text-white px-4 py-2 disabled:opacity-50"
                    >
                        {updateArticle.isPending ? "Saving..." : "Save changes"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteArticle.isPending}
                        className="bg-red-600 text-white px-4 py-2 disabled:opacity-50"
                    >
                        {deleteArticle.isPending ? "Deleting..." : "Delete article"}
                    </button>
                </div>

            </form>
        </main>
    );
}
