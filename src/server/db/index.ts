import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

let db: Db | null = null;

export async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}
