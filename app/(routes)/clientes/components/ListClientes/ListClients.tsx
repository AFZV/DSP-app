import { Cliente, columns } from "./columns";
import { DataTable } from "./data-table";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function getData(): Promise<Cliente[]> {
  const { userId } = auth();

  if (!userId) return [];

  const clientes = await db.cliente.findMany({
    where: {
      codigoVend: userId,
    },
    select: {
      nit: true,
      nombres: true,
      apellidos: true,
      telefono: true,
      codigoCiud: true,
      email: true,
    },
    orderBy: {
      nombres: "asc",
    },
  });

  return clientes;
}

export default async function ListClientsPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
