import { getDb } from "@/server/db";
import { CMSAuthor } from "./cms.types";

export async function getCMSAuthorsWithArticleCounts(): Promise<CMSAuthor[]> {
    const db = await getDb();

    const results = await db
        .collection("user")
        .aggregate<CMSAuthor>([
            {
                $addFields: {
                    userId: { $toString: "$_id" },
                },
            },
            {
                $lookup: {
                    from: "articles",
                    let: { userId: "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$authorId", "$$userId"] },
                                        { $eq: ["$deletedAt", null] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "articles",
                },
            },
            {
                $addFields: {
                    articleCount: { $size: "$articles" },
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    name: 1,
                    email: 1,
                    articleCount: 1,
                },
            },
            {
                $sort: { articleCount: -1 },
            },
        ])
        .toArray();

    return results;
}
