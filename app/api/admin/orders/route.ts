import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json(
    { orders },
    { headers: { "Cache-Control": "no-store" } }
  );
}
