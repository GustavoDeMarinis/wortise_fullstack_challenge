import { getDb } from "@/server/db";
import { Article } from "@/server/schemas/article.schema";
import { mapArticle } from "@/server/repositories/article.mapper";
import { WithId, Document } from "mongodb";

export async function searchArticles(q?: string): Promise<Article[]> {
    const db = await getDb();

    const trimmedQuery = q?.trim();

    const pipeline: Document[] = [
        {
            $match: {
                deletedAt: null,
            },
        },
    ];

    if (trimmedQuery && trimmedQuery.length > 0) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: trimmedQuery, $options: "i" } },
                    { content: { $regex: trimmedQuery, $options: "i" } },
                    { authorName: { $regex: trimmedQuery, $options: "i" } },
                ],
            },
        });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const docs = await db
        .collection("articles")
        .aggregate<WithId<Document>>(pipeline)
        .toArray();

    return docs.map(mapArticle);
}
