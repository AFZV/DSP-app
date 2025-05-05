"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatValue } from "@/utils/FormartValue";
export type Recibo = {
  id: string;
  codigoCliente: string;
  codigoUsuario: string;
  valor: number;
  vendedor: {
    nombres: string;
  };
  cliente?: {
    nombres: string;
    apellidos: string;
  } | null;
  accion: string;
};

export const columns: ColumnDef<Recibo>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "codigoCliente",
    header: "Código Cliente",
  },
  {
    accessorKey: "cliente.nombres", // Accede a cliente.nombres
    header: "Cliente",
    cell: ({ row }) => {
      const cliente = row.original.cliente;
      return cliente
        ? `${cliente.nombres ?? ""} ${cliente.apellidos ?? ""}`.trim() || "—"
        : "—"; // Si no hay cliente, muestra "—"
    },
  },
  {
    accessorKey: "valor.valor",
    header: "Valor",
    cell: ({ row }) => {
      const valor = row.original.valor;
      return formatValue(valor);
    },
  },
  {
    accessorKey: "vendedor.nombres",
    header: "Vendedor",
    cell: ({ row }) => row.original.vendedor?.nombres ?? "—", // Si no hay vendedor, muestra "—"
  },
  {
    accessorKey: "accion",
    header: "Editar/Eliminar",
  },
];
