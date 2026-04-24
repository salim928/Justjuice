import { NextResponse } from "next/server";
import { checkPassword, startSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password =
    typeof (body as { password?: unknown })?.password === "string"
      ? (body as { password: string }).password
      : "";
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  await startSession();
  return NextResponse.json({ ok: true });
}
