import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ventas = await db.pedido.groupBy({
      by: ["fecha"],
      _sum: {
        total: true,
      },
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

    return NextResponse.json(ventasPorMes);
  } catch (error) {
    console.error("Error al agrupar ventas:", error);
    return NextResponse.json(
      { error: "Error al obtener ventas por mes" },
      { status: 500 }
    );
  }
}
