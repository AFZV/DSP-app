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
export function HeaderRecaudos() {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  return (
    <div className="flex justify-between items-center ">
      <h2>Lista de Cobros</h2>
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
  );
}
