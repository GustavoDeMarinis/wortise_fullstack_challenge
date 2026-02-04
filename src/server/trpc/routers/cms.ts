import { router, publicProcedure } from "../trpc";
import { getCMSAuthorsWithArticleCounts } from "@/server/queries/cms.queries";

export const cmsRouter = router({
    getAuthorsWithArticleCounts: publicProcedure.query(async () => {
        return getCMSAuthorsWithArticleCounts();
    }),
});
