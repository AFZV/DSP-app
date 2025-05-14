import { GetCurrentUserId, getUser } from "@/lib/getUsuarios";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const userId = await GetCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: "No hay usuario" }, { status: 400 });
  }

  const user = await getUser(userId);
  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ userId, tipoUsuario: user });
}
