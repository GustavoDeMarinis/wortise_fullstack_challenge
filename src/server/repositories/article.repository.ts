import { ObjectId } from "mongodb";
import { getDb } from "../db";

import {
  CreateArticleInput,
  UpdateArticleInput,
  Article,
} from "@/server/schemas/article.schema";
import { mapArticle } from "./article.mapper";

const COLLECTION = "articles";

export async function createArticle(
  input: CreateArticleInput & {
    authorId: string;
    authorName: string;
  }
): Promise<Article> {
  const db = await getDb();
  const now = new Date();

  const result = await db.collection(COLLECTION).insertOne({
    ...input,
    authorId: input.authorId,
    authorName: input.authorName,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  });

  const doc = await db
    .collection(COLLECTION)
    .findOne({ _id: result.insertedId });

  if (!doc) {
    throw new Error("Failed to create article");
  }

  return mapArticle(doc);
}

export async function getArticleById(
  id: string
): Promise<Article | null> {
  const db = await getDb();

  const doc = await db.collection(COLLECTION).findOne({
    _id: new ObjectId(id),
    deletedAt: null,
  });

  return doc ? mapArticle(doc) : null;
}

export async function listArticles(): Promise<Article[]> {
  const db = await getDb();

  const docs = await db
    .collection(COLLECTION)
    .find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(mapArticle);
}

export async function updateArticle(
  id: string,
  input: UpdateArticleInput
): Promise<Article | null> {
  const db = await getDb();

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    {
      _id: new ObjectId(id),
      deletedAt: null,
    },
    {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  return result ? mapArticle(result) : null;
}


export async function softDeleteArticle(
  id: string
): Promise<boolean> {
  const db = await getDb();

  const result = await db.collection(COLLECTION).updateOne(
    {
      _id: new ObjectId(id),
      deletedAt: null,
    },
    {
      $set: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount === 1;
}
