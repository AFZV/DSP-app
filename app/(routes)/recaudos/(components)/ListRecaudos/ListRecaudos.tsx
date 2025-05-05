import React from "react";
import { Recibo, columns } from "./columns";
import { DataTable } from "./data-table";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

async function getData(): Promise<Recibo[]> {
  const { userId } = auth();

  if (!userId) return [];

  const recibos = await db.recibo.findMany({
    where: {
      codigoUsuario: userId,
    },
    select: {
      id: true,
      codigoCliente: true,
      codigoUsuario: true,
      valor: true,
      cliente: {
        select: {
          nombres: true,
          apellidos: true,
        },
      },
      vendedor: {
        select: {
          nombres: true,
          id: true,
        },
      },
    },
    orderBy: {
      creado: "desc",
    },
  });
  if (!recibos) return [];
  return recibos;
}

export async function ListRecaudos() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
