///
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormCrearRecibo } from "../formCrearRecaudo";
import { FileSpreadsheet } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DatePickerWithRange } from "../FormExportRecaudos";
export function HeaderRecaudos() {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalExport, setOpenModalExport] = useState<boolean>(false);
  return (
    <div className="flex justify-between items-center ">
      <h2>Lista de Cobros</h2>
      <TooltipProvider>
        <div>
          <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
            <DialogTrigger asChild>
              <Button>Crear Recibo</Button>
            </DialogTrigger>
            <DialogContent className="sm: max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Crear Recibo</DialogTitle>
                <DialogDescription>Crear Recibo de Caja</DialogDescription>
              </DialogHeader>

              <FormCrearRecibo setOpenModalCreate={setOpenModalCreate} />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Dialog open={openModalExport} onOpenChange={setOpenModalExport}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button>
                    <FileSpreadsheet />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar</p>
              </TooltipContent>
            </Tooltip>

            <DialogContent className="sm: max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Exportar</DialogTitle>
                <DialogDescription>Exportar</DialogDescription>
              </DialogHeader>

              <DatePickerWithRange onClose={() => setOpenModalExport(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </TooltipProvider>
    </div>
  );
}
