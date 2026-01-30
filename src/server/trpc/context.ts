import { getDb } from "@/server/db";
import type { NextRequest } from "next/server";

export async function createContext(opts: { req: NextRequest }) {
  const db = await getDb();

  return {
    db,
    // user will be added here when BetterAuth is configured
    user: null as null | { id: string; email: string },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
