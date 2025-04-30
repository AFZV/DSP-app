import { db } from "./db";

import { NextResponse } from "next/server";

export async function getUsuarios() {
  const usuarios = await db.usuario.findMany({
    select: {
      codigo: true,
    },
  });

  return usuarios;
}

export async function getUsuarioPorNit(nit: string) {
  const usuario = await db.usuario.findMany({
    where: {
      codigo: nit,
    },
    select: {
      codigo: true,
    },
  });

  return usuario;
}

export async function getUser(userId: string): Promise<string> {
  const user = await db.usuario.findUnique({
    where: {
      codigo: userId,
    },
    select: {
      tipoUsuario: true,
    },
  });
  if (!user) {
    return new NextResponse("no hay usuario").json();
  }
  return user?.tipoUsuario;
}
