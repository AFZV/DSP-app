"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";
import { formatValue } from "@/utils/FormartValue";

type recaudosPorMes = { Mes: string; ventas: number };

export function GraphicsRecaudos({ data }: { data: recaudosPorMes[] }) {
  return (
    <div className="mt-5 ">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 70, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1={0} x2={0} y2={1}>
                <stop offset="5%" stopColor="#887CFD" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#887CFD" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="Mes" />
            <YAxis tickFormatter={(value) => formatValue(value)} />
            <Tooltip formatter={(value: number) => formatValue(value)} />
            <Area
              type="monotone"
              dataKey="ventas"
              stroke="#887CFD"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
