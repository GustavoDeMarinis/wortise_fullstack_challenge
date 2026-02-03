import { api } from "@/server/trpc/server";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: Props) {
    const { id } = await params;

    const article = await api.article.getById({ id });

    if (!article) {
        notFound();
    }

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">
                {article.title}
            </h1>

            <p className="text-sm text-gray-600 mb-4">
                by {article.authorName} ·{" "}
                {new Date(article.createdAt).toLocaleDateString()}
            </p>

            <img
                src={article.coverImageUrl}
                alt=""
                className="mb-4 rounded"
            />

            <p className="whitespace-pre-line">
                {article.content}
            </p>
        </main>
    );
}
