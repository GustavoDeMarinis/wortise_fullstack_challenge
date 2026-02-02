import { WithId, Document } from "mongodb";
import { Article } from "@/server/schemas/article.schema";

export function mapArticle(doc: WithId<Document>): Article {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    coverImageUrl: doc.coverImageUrl,

    authorId: doc.authorId,
    authorName: doc.authorName,

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    deletedAt: doc.deletedAt ?? null,
  };
}
