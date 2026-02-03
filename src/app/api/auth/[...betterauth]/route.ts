import { auth } from "@/server/auth/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
    console.log("[AUTH HANDLER] GET", request.url);
    return auth.handler(request);
}

export async function POST(request: Request) {
    console.log("[AUTH HANDLER] POST", request.url);
    return auth.handler(request);
}
