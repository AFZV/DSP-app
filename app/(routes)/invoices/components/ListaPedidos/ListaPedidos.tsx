import React from "react";
import { columns, Pedido } from "./columns";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { DataTable } from "./data-table";

async function getData(): Promise<Pedido[]> {
  const { userId } = auth();

  if (!userId) return [];

  const pedidos = await db.pedido.findMany({
    where: {
      vendedorId: userId,
    },
    select: {
      id: true,
      clienteId: true,
      vendedorId: true,
      total: true,
      cliente: {
        select: {
          nit: true,
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
  });

  return pedidos;
}

export async function ListaPedidos() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
