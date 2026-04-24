import { NextResponse } from "next/server";
import {
  InsufficientStockError,
  createOrder,
  sanitizeIncomingOrder,
} from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const payload = sanitizeIncomingOrder(body);
    const order = await createOrder(payload);
    return NextResponse.json(
      { id: order.id, createdAt: order.createdAt },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return NextResponse.json(
        {
          error: "Some items are out of stock.",
          shortages: err.shortages,
        },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }
    const message = err instanceof Error ? err.message : "Invalid order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
