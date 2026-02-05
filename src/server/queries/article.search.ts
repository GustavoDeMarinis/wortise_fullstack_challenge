import { getDb } from "@/server/db";
import { Article } from "@/server/schemas/article.schema";
import { mapArticle } from "@/server/repositories/article.mapper";
import { WithId, Document, Filter } from "mongodb";
import { PaginatedResult } from "./pagination.types";
import { normalizePagination } from "./pagination.utils";

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




export async function searchArticlesPaginated(
  q?: string,
  params?: { page?: number; pageSize?: number }
): Promise<PaginatedResult<Article>> {
  const db = await getDb();
  const { page, pageSize, skip, limit } = normalizePagination(params);

  const trimmedQuery = q?.trim();

  const match: Filter<Document> = { deletedAt: null };

  if (trimmedQuery) {
    match.$or = [
      { title: { $regex: trimmedQuery, $options: "i" } },
      { content: { $regex: trimmedQuery, $options: "i" } },
      { authorName: { $regex: trimmedQuery, $options: "i" } },
    ];
  }

  const [docs, total] = await Promise.all([
    db
      .collection("articles")
      .aggregate<WithId<Document>>([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray(),

    db.collection("articles").countDocuments(match),
  ]);

  return {
    items: docs.map(mapArticle),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
