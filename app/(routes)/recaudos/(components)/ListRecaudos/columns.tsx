"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatValue } from "@/utils/FormartValue";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
export type Recibo = {
  id: string;
  codigoCliente: string;
  codigoUsuario: string;
  valor: number;
  tipo: string;
  concepto: string;
  vendedor: {
    nombres: string;
  };
  cliente?: {
    nombres: string;
    apellidos: string;
  } | null;
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
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.original?.tipo;
      return tipo || "—";
    },
  },
  {
    accessorKey: "concepto",
    header: "Concepto",
    cell: ({ row }) => {
      const concepto = row.original?.concepto;
      return concepto || "—";
    },
  },
  {
    accessorKey: "vendedor.nombres",
    header: "Vendedor",
    cell: ({ row }) => row.original.vendedor?.nombres ?? "—", // Si no hay vendedor, muestra "—"
  },
  {
    id: "actions", // Un identificador único para la columna de acciones
    header: () => <div className="text-center">Editar/Eliminar</div>,
    cell: ({ row }) => {
      // Este código de la celda se renderizará en la columna correcta
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [admin, setAdmin] = useState<boolean>(false);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const getDataDb = async (): Promise<void> => {
          const response = await fetch("/api/usuario/rol");
          const { userId, tipoUsuario } = await response.json();
          console.log("Usuario autenticado:", userId, tipoUsuario);

          if (tipoUsuario === "admin") {
            setAdmin(true);
          } else {
            setAdmin(false);
          }
        };

        getDataDb();
      }, []);

      const handleEliminar = async (id: string) => {
        try {
          await axios.delete(`/api/recibo/${id}`);
          toast({
            title: "Recibo Eliminado",
          });
          router.push("/recaudos");
          router.refresh();
        } catch (error) {
          console.error("Error en onSubmit:", error);
          toast({
            title: "algo salio mal",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="flex justify-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-sky-500"
                  onClick={() => {
                    router.push(`/recaudos/${row.getValue("id")}`);
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {admin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleEliminar(row.getValue("id"));
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
];
