import { auth } from "./auth";
import { headers } from "next/headers";

export async function getServerSession() {
  const reqHeaders = await headers();

  return auth.api.getSession({
    headers: reqHeaders,
  });
}
