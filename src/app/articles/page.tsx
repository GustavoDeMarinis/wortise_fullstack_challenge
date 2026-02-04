import { api } from "@/server/trpc/server";
import Link from "next/link";

type Props = {
    searchParams: Promise<{
        q?: string;
    }>;
};

export default async function ArticlesPage({ searchParams }: Props) {
    const { q } = await searchParams;

    const articles = q
        ? await api.article.search({ q })
        : await api.article.list();

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Articles</h1>

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
                    {q ? "No articles found for your search." : "No articles yet."}
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
        </main>
    );
}
