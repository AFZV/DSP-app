import { db } from "@/lib/db";

export async function getVentasParaGraphics(
  userId: string,
  tipoUsuario: string
) {
  try {
    // Construir cláusula where solo si el usuario NO es admin
    const whereClause =
      tipoUsuario !== "admin" ? { vendedorId: userId } : undefined;

    const ventas = await db.pedido.groupBy({
      by: ["fecha"],
      _sum: {
        total: true,
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

    const ventasPorMes: { Mes: string; ventas: number }[] = Array.from(
      { length: 12 },
      (_, i) => ({ Mes: meses[i], ventas: 0 })
    );

    ventas.forEach((venta) => {
      const fecha = new Date(venta.fecha);
      const mesIndex = fecha.getMonth(); // 0-11
      ventasPorMes[mesIndex].ventas += Number(venta._sum.total || 0);
    });

    return ventasPorMes;
  } catch (error) {
    console.error("Error al agrupar ventas:", error);
    throw new Error("Error al obtener ventas por mes");
  }
}
