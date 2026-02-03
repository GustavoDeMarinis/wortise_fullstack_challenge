import { getServerSession } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function EditArticleLayout({
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
