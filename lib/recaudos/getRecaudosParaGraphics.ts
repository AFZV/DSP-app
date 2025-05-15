import { db } from "@/lib/db";

export async function getRecaudosParaGraphics(
  userId: string,
  tipoUsuario: string
) {
  try {
    // Construir cláusula where solo si el usuario NO es admin
    const whereClause =
      tipoUsuario !== "admin" ? { codigoUsuario: userId } : undefined;

    const recaudos = await db.recibo.groupBy({
      by: ["creado"],
      _sum: {
        valor: true,
      },
      where: whereClause,
    });

    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const ventasPorMes: { Mes: string; cobros: number }[] = Array.from(
      { length: 12 },
      (_, i) => ({ Mes: meses[i], cobros: 0 })
    );

    recaudos.forEach((recaudo) => {
      const fecha = new Date(recaudo.creado);
      const mesIndex = fecha.getMonth(); // 0-11
      ventasPorMes[mesIndex].cobros += Number(recaudo._sum?.valor || 0);
    });

    return ventasPorMes;
  } catch (error) {
    console.error("Error al agrupar Recaudos:", error);
    throw new Error("Error al obtener Recaudos por mes");
  }
}
