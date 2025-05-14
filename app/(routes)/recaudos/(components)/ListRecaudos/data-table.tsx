"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { GetCurrentUserId } from "@/lib/getUsuarios";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

//terminan los imports

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  //to do 1 traer el userId desde el back puesto que estamos en el front no usar auth()
  const [admin, setAdmin] = useState<boolean>(false);
  //to do 2 con el userId ver que usuario esta en sesion y de acuerdo a eso permitrile eliminar o no recibos

  const router = useRouter();

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
      const res = await axios.delete(`/api/recibo/${id}`);

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
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-center">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Atras
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Adelante
        </Button>
      </div>
    </div>
  );
}
