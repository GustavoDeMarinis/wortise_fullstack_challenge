import { getServerSession } from "@/server/auth/session";
import { api } from "@/server/trpc/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const authors = await api.cms.getAuthorsWithArticleCounts();

  let session = null;

  try {
    session = await getServerSession();
  } catch {
    session = null;
  }

  async function logout() {
    "use server";

    const cookieStore = await cookies();

    cookieStore.delete("better-auth.session_token");

    redirect("/login");
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">CMS Authors</h1>

        <div className="flex items-center gap-3">
          {!session?.user ? (
            <>
              <Link
                href="/login"
                className="rounded-md border px-4 py-2 text-sm font-medium
                           hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium
                           hover:bg-gray-800 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border px-4 py-2 text-sm font-medium
                           hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </form>
          )}

          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2
                       text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            View Articles →
          </Link>
        </div>
      </header>

      {/* Content */}
      {authors.length === 0 ? (
        <div className="border rounded-lg p-6 text-center text-gray-500">
          No authors found
        </div>
      ) : (
        <ul className="space-y-4">
          {authors.map((author) => (
            <li
              key={author.userId}
              className="flex items-center justify-between rounded-lg border p-4
                         hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="font-semibold text-lg">{author.name}</p>
                <p className="text-sm text-gray-600">{author.email}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Articles</p>
                <p className="text-lg font-semibold">
                  {author.articleCount}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
