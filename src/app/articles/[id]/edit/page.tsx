"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

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
          router.push(`/articles/${articleId}`);
        },
      }
    );
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
          router.push("/articles");
        },
      }
    );
  };

  // Loading
  if (articleQuery.isLoading) {
    return (
      <main className="max-w-2xl mx-auto p-4">
        <p className="text-gray-500">Loading article...</p>
      </main>
    );
  }

  // Error (not found or forbidden)
  if (articleQuery.isError || !articleQuery.data) {
    return (
      <main className="max-w-2xl mx-auto p-4">
        <p className="text-red-600">
          Article not found or you dont have permission to edit it.
        </p>
        <Link
          href="/articles"
          className="text-sm text-gray-500 underline mt-4 inline-block"
        >
          ← Back to articles
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/articles/${articleId}`}
        className="text-sm text-gray-500 hover:underline mb-4 inline-block"
      >
        ← Back to article
      </Link>

      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            {...form.register("title")}
            className="w-full rounded-md border p-2"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            {...form.register("content")}
            rows={8}
            className="w-full rounded-md border p-2"
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        {/* Errors */}
        {updateArticle.isError && (
          <p className="text-sm text-red-600">
            You are not allowed to update this article.
          </p>
        )}

        {deleteArticle.isError && (
          <p className="text-sm text-red-600">
            You are not allowed to delete this article.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={updateArticle.isPending}
            className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white
                       disabled:opacity-50"
          >
            {updateArticle.isPending ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteArticle.isPending}
            className="inline-flex items-center rounded-md border px-4 py-2 text-red-600
                       hover:bg-red-50 disabled:opacity-50"
          >
            {deleteArticle.isPending ? "Deleting..." : "Delete article"}
          </button>
        </div>
      </form>
    </main>
  );
}
