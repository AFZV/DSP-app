// /app/api/recibo/reciboPorId/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const recibo = await db.recibo.findUnique({
      where: { id },
      select: {
        codigoCliente: true,
        codigoUsuario: true,
        valor: true,
        cliente: {
          select: {
            nombres: true,
            apellidos: true,
            telefono: true,
            codigoCiud: true,
          },
        },
      },
    });

    if (!recibo) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(recibo);
  } catch (error) {
    console.error("Error fetching recibo:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
