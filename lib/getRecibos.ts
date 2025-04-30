import { formatValue } from "@/utils/FormartValue";
import { db } from "./db";
import { inicioDia, finDia } from "@/utils/fechas";

export async function getRecibos(IdUsuario: string, tipoUsuario: string) {
  if (tipoUsuario === "admin") {
    const totalRecibos = await db.recibo.aggregate({
      where: {
        creado: {
          gte: inicioDia,
          lte: finDia,
        },
      },
      _sum: {
        valor: true,
      },
    });
    const total = formatValue(totalRecibos._sum.valor as number);
    return total;
  } else {
    const totalRecibos = await db.recibo.aggregate({
      where: {
        codigoUsuario: IdUsuario,
        creado: {
          gte: inicioDia,
          lte: finDia,
        },
      },
      _sum: {
        valor: true,
      },
    });
    const total = formatValue(totalRecibos._sum.valor as number);

    console.log("entro al else:", total);
    return total;
  }
}
