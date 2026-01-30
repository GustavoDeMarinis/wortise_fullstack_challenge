import { getDb } from "@/server/db";
import { getServerSession } from "@/server/auth/session";

export async function createContext() {
  const db = await getDb();
  const session = await getServerSession();

  return {
    db,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
