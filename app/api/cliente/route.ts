import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("No Autorizado", { status: 401 });
    }
    console.log("esto hay en data :", data);
    const cliente = await db.cliente.create({
      data: {
        ...data,
      },
    });
    console.log("esto hay en data :", data);
    return NextResponse.json(cliente);
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new NextResponse("Ya existe un cliente con ese NIT", {
        status: 409, // 409 Conflict
      });
    }
    console.log("el error es ....:", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}
