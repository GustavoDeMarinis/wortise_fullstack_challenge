import { auth } from "./auth";
import { headers } from "next/headers";

export async function getServerSession() {
  const h = await headers();

  const reqHeaders = new Headers();
  h.forEach((value, key) => {
    reqHeaders.append(key, value);
  });

  return auth.api.getSession({
    headers: reqHeaders,
  });
}