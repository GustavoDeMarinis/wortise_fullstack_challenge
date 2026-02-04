import { api } from "@/server/trpc/server";
import Link from "next/link";

export default async function ArticlesPage() {
    const articles = await api.article.list();

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Articles</h1>

            {articles.length === 0 && (
                <p className="text-gray-500">No articles yet</p>
            )}

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
