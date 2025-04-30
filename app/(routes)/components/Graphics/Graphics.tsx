"use client";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";
import { dataGraphics } from "./Graphics.data";

export function Graphics() {
  const data = dataGraphics;
  // cuando vuelva aca es ideal hacerlo sobre los meses
  return (
    <div className="mt-5 ">
      <div className="flex gap-x-5 mb-5"></div>
      <div className="h-[350px] ">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={730}
            height={250}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1={0} x2={0} y2={1}>
                <stop offset="5%" stopColor="#887CFD" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#887CFD" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colorPv" x1={0} x2={0} y2={1}>
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="Mes" />
            <YAxis
              label={{
                value: "Ventas en Millones de pesos",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip />
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
