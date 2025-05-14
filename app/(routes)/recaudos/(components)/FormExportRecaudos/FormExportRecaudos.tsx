"use client";

import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DatePickerWithRange({
  onSelect,
  onClose,
}: {
  onSelect?: (range: DateRange | undefined) => void;
  onClose?: () => void;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const [nombreVendedor, setNombreVendedor] = useState<string>("");

  console.log("esto hay en codigo ususario", nombreVendedor);

  function handleSelect(range: DateRange | undefined) {
    setDate(range);
    if (range?.from && range?.to) {
      onSelect?.(range);
    }
  }
  async function exportarFechas(date: DateRange) {
    if (!date?.from || !date?.to) return;

    const res = await fetch("/api/recibo/export-recaudos", {
      method: "POST",
      body: JSON.stringify({
        from: date.from.toISOString(),
        to: date.to.toISOString(),
        nombreVendedor: nombreVendedor,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recaudos.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="grid gap-4">
      <div className="text-sm text-muted-foreground">
        Rango seleccionado:{" "}
        {date?.from && date?.to
          ? `${format(date.from, "LLL dd, y")} - ${format(
              date.to,
              "LLL dd, y"
            )}`
          : "Ninguno"}
      </div>
      <Calendar
        mode="range"
        selected={date}
        onSelect={handleSelect}
        numberOfMonths={2}
        defaultMonth={new Date()}
      />
      <select
        value={nombreVendedor}
        name="vendedor"
        id="vendedor"
        onChange={(e) => {
          const target = e.target as HTMLSelectElement;
          setNombreVendedor(target.value);
        }}
      >
        <option value="">Selecciona un vendedor</option>
        <option value="alexis">ALEXIS ZULUAGA</option>
        <option value="gloria">GLORIA HOYOS</option>
        <option value="felipe">FELIPE NOREÑA</option>
        <option value="milton">MILTON ROSERO</option>
        <option value="alexander">ALEXANDER FERNANDEZ</option>
        <option value="alexis">ALEXIS NOREÑA</option>
        <option value="jonathan">JONATAN GIL</option>
        <option value="sin-comision">SIN COMISION</option>
      </select>
      <Button
        onClick={() => {
          exportarFechas(date as DateRange);
          onClose?.();
        }}
      >
        Exportar
      </Button>
    </div>
  );
}
