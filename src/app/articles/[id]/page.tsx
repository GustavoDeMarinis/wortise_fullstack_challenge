import { api } from "@/server/trpc/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/server/auth/session";
import type { Article } from "@/server/schemas/article.schema";
import { revalidatePath } from "next/cache";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

  let article: Article;

  try {
    article = await api.article.getById({ id });
  } catch {
    notFound();
  }

  const session = await getServerSession();

  const canEdit =
    session !== null && article.authorId === session.user.id;

  async function deleteArticle() {
    "use server";
    await api.article.delete({ id: article.id });

    revalidatePath(`/articles/${article.id}`);
    revalidatePath("/articles");

    redirect("/articles");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/articles"
        className="text-sm text-gray-500 hover:underline mb-4 inline-block"
      >
        ← Back to articles
      </Link>

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {article.title}
        </h1>

        <p className="text-sm text-gray-600">
          by {article.authorName} ·{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>
      </header>

      <img
        src={article.coverImageUrl}
        alt=""
        className="w-full rounded-lg mb-6"
      />

      <article className="whitespace-pre-line leading-relaxed mb-8">
        {article.content}
      </article>

      {canEdit && (
        <div className="flex gap-3">
          <Link
            href={`/articles/${article.id}/edit`}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm
                       hover:bg-gray-100 transition-colors"
          >
            Edit
          </Link>

          <form action={deleteArticle}>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm
                         text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
