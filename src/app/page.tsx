import { getServerSession } from "@/server/auth/session";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  );
}