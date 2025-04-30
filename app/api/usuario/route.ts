import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No Autorizado", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const nit = searchParams.get("nit");

    if (!nit) {
      return new NextResponse("Falta parámetro 'nit'", { status: 400 });
    }

    const cliente = await db.cliente.findFirst({
      where: {
        nit,
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.log("el error es ....:", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}
