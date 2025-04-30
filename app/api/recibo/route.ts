import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
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
      },
    });
    console.log("esto hay en data :", body);
    return NextResponse.json(recibo);
  } catch (error) {
    console.log("el error es ....:", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}
