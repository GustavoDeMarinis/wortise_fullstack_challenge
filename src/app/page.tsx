import { api } from "@/server/trpc/server";

export default async function Home() {
  const authors = await api.cms.getAuthorsWithArticleCounts();

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CMS Authors</h1>

      {authors.length === 0 ? (
        <p className="text-gray-500">No authors found</p>
      ) : (
        <ul className="space-y-3">
          {authors.map((author) => (
            <li
              key={author.userId}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{author.name}</p>
                <p className="text-sm text-gray-600">{author.email}</p>
              </div>

              <span className="text-sm font-medium">
                {author.articleCount}{" "}
                {author.articleCount === 1 ? "article" : "articles"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
