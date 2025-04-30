import { CustomIcon } from "@/components/CustomIcon";
import { BarChart } from "lucide-react";
import { Graphics } from "../Graphics";

export function SalesDistribution() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5">
      <div className="flex gap-x-2 items-center">
        <CustomIcon icon={BarChart} />
        <p className="text-xl">Distribución de ventas</p>
      </div>
      <Graphics />
    </div>
  );
}
