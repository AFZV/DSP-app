import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  return NextResponse.json({ userId });
}
