import { Recibo } from "@/app/(routes)/recaudos/(components)/ListRecaudos/columns";
import { db } from "../db";
import { GetCurrentUserId } from "../getUsuarios";

export async function getAllRecaudos(): Promise<Recibo[]> {
  const userId = await GetCurrentUserId();

  if (!userId) return [];

  const recibos = await db.recibo.findMany({
    select: {
      id: true,
      codigoCliente: true,
      codigoUsuario: true,
      valor: true,
      tipo: true,
      concepto: true,
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
