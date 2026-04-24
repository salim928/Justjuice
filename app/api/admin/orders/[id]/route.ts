import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteOrder, updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const status = (body as { status?: unknown })?.status as OrderStatus;
  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }
  try {
    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { order: updated },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const removed = await deleteOrder(id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
