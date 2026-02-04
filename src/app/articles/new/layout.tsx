import { getServerSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function NewArticleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    return <>{children}</>;
}
