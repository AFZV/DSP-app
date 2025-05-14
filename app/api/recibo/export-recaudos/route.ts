import { NextResponse } from "next/server";
import { getRecaudosPorRango } from "@/lib/getRecaudosPorRango";
import { parseISO } from "date-fns";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const { from, to, nombreVendedor } = await req.json();
    const fromDate = parseISO(from);
    const toDate = parseISO(to);

    const datos = await getRecaudosPorRango(fromDate, toDate, nombreVendedor);
    console.log("esto lleag al api desde exportar:", datos);
    if (datos.length === 0) {
      const ws = XLSX.utils.aoa_to_sheet([["No hay datos en el rango"]]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, nombreVendedor);
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename=${nombreVendedor}.xlsx"`,
        },
      });
    }

    const exportData = datos.map((item) => ({
      ID: item.id,
      Fecha: new Date(item.creado).toLocaleDateString("es-CO"),
      Nombre: item.cliente.nombres,
      Apellido: item.cliente.apellidos,
      Valor: item.valor,
      Tipo: item.tipo,
      Concepto: item.concepto,
      Vendedor: item.vendedor.nombres,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreVendedor);

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${nombreVendedor}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Error al exportar:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
