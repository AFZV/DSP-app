import { CustomIcon } from "@/components/CustomIcon";
import { BarChart } from "lucide-react";
import { GraphicsVentas } from "../Graphics";
import { GetCurrentUserId, getUser } from "@/lib/getUsuarios";
import { getRecaudosParaGraphics } from "@/lib/recaudos/getRecaudosParaGraphics";
import { getVentasParaGraphics } from "@/lib/ventas/getVentasParaGraphics";
import { GraphicsRecaudos } from "../GraphicsRecaudos";

export async function SalesDistribution() {
  const userId = await GetCurrentUserId();
  const user = await getUser(userId);

  const dataVentas = await getVentasParaGraphics(userId, user);
  const dataRecaudos = await getRecaudosParaGraphics(userId, user);
  return (
    <div className="shadow-sm bg-background rounded-lg p-5">
      <div className="flex gap-x-2 items-center">
        <CustomIcon icon={BarChart} />
        <p className="text-xl">Distribución de Ventas</p>
      </div>
      <GraphicsVentas data={dataVentas} />
      <div className="flex gap-x-2 items-center pt-3">
        <CustomIcon icon={BarChart} />
        <p className="text-xl">Distribución de Cobros</p>
      </div>
      <GraphicsRecaudos data={dataRecaudos} />
    </div>
  );
}
