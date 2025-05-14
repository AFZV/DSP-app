import { db } from "@/lib/db";
import { GetCurrentUserId, getUser } from "@/lib/getUsuarios";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("No Autorizado", { status: 401 });
    }
    console.log("esto hay en data :", body);
    const recibo = await db.recibo.update({
      where: {
        id: id,
      },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const userId = await GetCurrentUserId();
    const user = await getUser(userId);

    if (!userId) {
      return new NextResponse("No Autorizado", { status: 401 });
    }
    if (user !== "admin") {
      return new NextResponse("Acceso denegado: solo admin", { status: 403 });
    }
    const recibo = await db.recibo.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(recibo);
  } catch (error) {
    console.error("Error al eliminar el recibo:", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}
