import { api } from "@/server/trpc/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/server/auth/session";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

  const [article, session] = await Promise.all([
    api.article.getById({ id }),
    getServerSession(),
  ]);

  if (!article) {
    notFound();
  }

  const canEdit =
    session && article.authorId === session.user.id;

  async function deleteArticle() {
    "use server";
    await api.article.delete({ id: article.id });
    redirect("/articles");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/articles"
        className="text-sm text-gray-500 hover:underline mb-4 inline-block"
      >
        ← Back to articles
      </Link>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {article.title}
        </h1>

        <p className="text-sm text-gray-600">
          by {article.authorName} ·{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>
      </header>

      {/* Cover */}
      <img
        src={article.coverImageUrl}
        alt=""
        className="w-full rounded-lg mb-6"
      />

      {/* Content */}
      <article className="whitespace-pre-line leading-relaxed mb-8">
        {article.content}
      </article>

      {/* Actions (author only) */}
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
