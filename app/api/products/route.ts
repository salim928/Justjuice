import { NextResponse } from "next/server";
import { readCatalog } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await readCatalog();
  return NextResponse.json(catalog, {
    headers: { "Cache-Control": "no-store" },
  });
}
