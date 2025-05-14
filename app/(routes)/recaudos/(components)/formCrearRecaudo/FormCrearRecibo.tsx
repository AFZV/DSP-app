///
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

const formSchema = z.object({
  codigoCliente: z.string().min(5).max(11),
  codigoUsuario: z.string().max(50),
  valor: z.number().min(1),
  customer: z.string().min(2).max(50),
  ciudad: z.string(),
  telefono: z.string(),
  tipo: z.string(),
  concepto: z.string(),
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormCrearReciboProps } from "./FormCrearRecibo.types";
import { useState } from "react";
import { Search } from "lucide-react";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  nit: string;
  nombres: string;
  apellidos: string;
  razonSocial: string;
  telefono: string;
  codigoCiud: string;
  codigoVend: string;
}
export function FormCrearRecibo(props: FormCrearReciboProps) {
  const { setOpenModalCreate } = props;
  const [cliente, setCliente] = useState<Cliente[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const onClickSearch = async () => {
    try {
      const nit = form.getValues("codigoCliente");
      if (!nit) return;

      const response = await axios.get(`/api/usuario?nit=${nit}`);
      console.log("response:", response);
      if (response.data === null) {
        toast({
          variant: "destructive",
          title: `el cliente con el nit: ${nit}, no existe`,
          duration: 2000,
        });
        return;
      }
      toast({
        variant: "default",
        title: `cliente encontrado nit:${nit}`,
        duration: 2000,
      });
      const data = response.data;

      form.setValue(
        "customer",
        data?.nombres + data?.apellidos || data?.razonSocial
      );
      form.setValue("ciudad", data?.codigoCiud || "");
      form.setValue("telefono", data?.telefono || "");
      form.setValue("codigoUsuario", data?.codigoVend || "");

      setCliente([data]); // si necesitas guardarlo en un estado
    } catch (error) {
      console.error("Error buscando cliente:", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoCliente: "",
      valor: 1,
      tipo: "",
      concepto: "",
    },
  });
  const { isValid } = form.formState;

  // 2. Define a submit handler.

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post("/api/recibo", {
        codigoCliente: values.codigoCliente,
        codigoUsuario: cliente[0]?.codigoVend,
        valor: values.valor,
        tipo: values.tipo,
        concepto: values.concepto,
      });

      toast({
        title: "Recibo Creado",
      });

      router.refresh();
      setOpenModalCreate(false);
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-3 ">
            <div className="col-span-1 flex justify-between gap-x-2">
              <FormField
                control={form.control}
                name="codigoCliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nit</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nit"
                        type="text"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onClickSearch();
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Digita el nit del cliente</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="button">
                <Search strokeWidth={3} onClick={onClickSearch} />
              </button>
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="customer"
                disabled
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input type="text" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="ciudad"
              disabled //
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input type="text" disabled {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              disabled //
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Telefono" {...field} />
                  </FormControl>
                  <FormDescription>
                    Telefono al que le llegara su recibo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigoUsuario"
              disabled //
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor</FormLabel>
                  <FormControl>
                    <Input type="text" disabled {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccione Una opcion</option>
                        <option value="efectivo">EFECTIVO</option>
                        <option value="consignacion">CONSIGNACION</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="valor" //
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cobrado</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      type="number"
                      placeholder="Digite un valor sin puntos ni comas"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="concepto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concepto o descripcion</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={!isValid} type="submit">
            Crear
          </Button>
        </form>
      </Form>
    </div>
  );
}
