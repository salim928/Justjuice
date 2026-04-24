import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readCatalog, sanitizeProducts, writeCatalog } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const catalog = await readCatalog();
  return NextResponse.json(catalog, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const incoming = (body as { products?: unknown })?.products;
  try {
    const products = sanitizeProducts(incoming);
    const catalog = await writeCatalog(products);
    return NextResponse.json(catalog, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid products";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
