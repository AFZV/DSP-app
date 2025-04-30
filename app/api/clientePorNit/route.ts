import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nit = searchParams.get("nit");

  if (typeof nit === "string") {
    try {
      const cliente = await db.cliente.findUnique({
        where: {
          nit: nit,
        },
        select: {
          id: true,
        },
      });
      await db.$disconnect();
      return NextResponse.json(cliente?.id);
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      await db.$disconnect();
      return NextResponse.json(
        { error: "Error al buscar cliente" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Se requiere un valor de nit válido" },
      { status: 400 }
    );
  }
}
