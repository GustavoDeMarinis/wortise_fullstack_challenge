import { api } from "@/server/trpc/server";
import Link from "next/link";

export default async function Home() {
  const authors = await api.cms.getAuthorsWithArticleCounts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">CMS Authors</h1>

        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium
                     hover:bg-gray-100 transition-colors"
        >
          View Articles →
        </Link>
      </header>

      {/* Content */}
      {authors.length === 0 ? (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          No authors found
        </div>
      ) : (
        <ul className="space-y-4">
          {authors.map((author) => (
            <li
              key={author.userId}
              className="flex items-center justify-between rounded-lg border p-4
                         hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="font-semibold text-lg">{author.name}</p>
                <p className="text-sm text-gray-600">{author.email}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Articles</p>
                <p className="text-lg font-semibold">
                  {author.articleCount}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
