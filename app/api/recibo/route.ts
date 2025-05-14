import { db } from "@/lib/db";
import { GetCurrentUserId } from "@/lib/getUsuarios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userId = await GetCurrentUserId();

    const body = await req.json();

    if (!userId) {
      return new NextResponse("No Autorizado", { status: 401 });
    }
    console.log("esto hay en data :", body);
    const recibo = await db.recibo.create({
      data: {
        codigoCliente: body.codigoCliente,
        codigoUsuario: body.codigoUsuario,
        valor: body.valor,
        tipo: body.tipo,
        concepto: body.concepto,
      },
    });
    return NextResponse.json(recibo);
  } catch (error) {
    return new NextResponse("Error Interno", { status: 500 });
  }
}
