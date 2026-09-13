import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function config() {
  const origin = (process.env.API_ORIGIN || "").replace(/\/$/, "");
  const key = process.env.ADMIN_API_KEY || "";
  if (!origin || !key) throw new Error("Admin API is not configured");
  return { origin, key };
}

async function proxy(method: "GET" | "PUT", request?: Request) {
  try {
    const { origin, key } = config();
    const body = method === "PUT" && request ? await request.text() : undefined;
    const response = await fetch(`${origin}/api/admin/site`, {
      method,
      headers: {
        "x-nebu-admin-key": key,
        ...(body ? { "content-type": "application/json" } : {}),
      },
      body,
      cache: "no-store",
    });
    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json" },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Proxy failure" }, { status: 500 });
  }
}

export async function GET() { return proxy("GET"); }
export async function PUT(request: Request) { return proxy("PUT", request); }
