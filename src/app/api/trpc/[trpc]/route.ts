import { appRouter } from "@/server/trpc/router";
import { createContext } from "@/server/trpc/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req: req as any }),
  });

export { handler as GET, handler as POST };
