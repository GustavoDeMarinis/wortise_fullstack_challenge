import { api } from "@/server/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await searchParams;

  const rawPage = Number(params.page);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const q = params.q;

  const result = q
    ? await api.article.searchPaginated({ q, page })
    : await api.article.listPaginated({ page });

  if (page > result.totalPages && result.totalPages > 0) {
    redirect(
      `/articles?${q ? `q=${encodeURIComponent(q)}&` : ""}page=${result.totalPages}`
    );
  }

  const articles = result.items;

  return (
    <main className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-sm px-3 py-1 border rounded text-white hover:bg-gray-800 transition-colors"
        >
          ← Back to CMS
        </Link>
        <span>Articles</span>

        <Link
          href="/articles/new"
          className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
        >
          + New Article
        </Link>
      </h1>

      {/* Search */}
      <form method="GET" className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search articles..."
          className="w-full border p-2"
        />
      </form>

      {/* Empty state */}
      {articles.length === 0 && (
        <p className="text-gray-500">
          {q ? (
            "No articles found for your search."
          ) : (
            <>
              No articles yet.{" "}
              <Link href="/articles/new" className="underline">
                Create the first one
              </Link>
            </>
          )}
        </p>
      )}

      {/* Results */}
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="border p-4 rounded">
            <h2 className="font-semibold text-lg">
              <Link href={`/articles/${article.id}`}>
                {article.title}
              </Link>
            </h2>

            <p className="text-sm text-gray-600">
              by {article.authorName}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>

      {/* Pagination info */}
      {result.totalPages > 1 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Page {result.page} of {result.totalPages} · {result.total} articles
        </p>
      )}

      {/* Pagination controls */}
      <nav className="flex justify-between mt-6">
        {result.page > 1 ? (
          <Link
            href={{
              pathname: "/articles",
              query: { q, page: result.page - 1 },
            }}
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}

        {result.page < result.totalPages && (
          <Link
            href={{
              pathname: "/articles",
              query: { q, page: result.page + 1 },
            }}
          >
            Next →
          </Link>
        )}
      </nav>
    </main>
  );
}
