import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductProps } from "@/components/CardProduct/CardProduct.type";
import { Button } from "@/components/ui/button";

import { TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Carrito({
  carrito,
  subtotal,
  cantidad,
  total,
  handleEliminar,
}: {
  carrito: ProductProps[];
  subtotal: number;
  cantidad: number;
  total: number;
  handleEliminar: (index: number) => void; //esto para eloiminar el producto de acuero al indice
}) {
  return (
    <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
      <Table>
        <TableCaption>
          Productos en Carrito
          <p>jksdbjsdjdbs</p>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Item</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carrito.map((producto, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{producto.cantidad}</TableCell>
              <TableCell className="text-right">${producto.precio}</TableCell>
              <TableCell className="text-right">
                ${producto.precio * cantidad}
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => handleEliminar(index)}
                      >
                        <TrashIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eliminar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">
              Total:
            </TableCell>
            <TableCell className="text-right font-bold">${total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
