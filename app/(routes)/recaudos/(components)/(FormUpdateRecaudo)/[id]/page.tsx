"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  codigoCliente: z.string().min(5).max(11),
  codigoUsuario: z.string().max(50),
  valor: z.number().min(1),
  customer: z.string().min(2).max(50),
  ciudad: z.string(),
  telefono: z.string(),
});

interface Cliente {
  nombres: string;
  apellidos: string;
  telefono: string;
  codigoCiud: string;
}
interface Recibo {
  codigoCliente: string;
  codigoUsuario: string;
  valor: number;
  cliente: Cliente;
}

export default function FormUpdateRecaudo() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id && typeof id === "string") {
      getRecibo();
    }
  }, [id]);

  const [recibo, setRecibo] = useState<Recibo | null>(null);

  const [clienteActual, setClienteActual] = useState<Cliente | null>(null);
  const [clienteNuevo, setClientNuevo] = useState<Cliente | null>(null);
  async function getRecibo(): Promise<void> {
    if (!id || typeof id !== "string") {
      console.error("No hay Id ");
    }
    const response = await axios.get(`/api/recibo/reciboPorId/${id}`);
    const reciboEdit = await response.data;
    try {
      if (reciboEdit) setClienteActual(reciboEdit?.cliente);
      setRecibo(reciboEdit);
    } catch (error) {
      throw error;
    }
    if (reciboEdit) {
      setClienteActual(reciboEdit.cliente);
      setRecibo(reciboEdit);

      form.reset({
        codigoCliente: reciboEdit.codigoCliente,
        valor: reciboEdit.valor,
        customer: `${reciboEdit.cliente.nombres} ${reciboEdit.cliente.apellidos}`,
        ciudad: reciboEdit.cliente.codigoCiud,
        telefono: reciboEdit.cliente.telefono,
        codigoUsuario: reciboEdit.codigoUsuario,
      });
    }
  }

  const onClickSearch = async () => {
    try {
      const nit = form.getValues("codigoCliente");
      if (!nit) return;

      const response = await axios.get(`/api/usuario?nit=${nit}`);
      const data = await response.data;

      // Asignar a los campos del formulario
      form.setValue(
        "customer",
        data?.nombres + data?.apellidos || data?.razonSocial
      );
      form.setValue("ciudad", data?.codigoCiud || "");
      form.setValue("telefono", data?.telefono || "");
      form.setValue("codigoUsuario", data?.codigoVend || "");

      setClientNuevo({
        telefono: data.telefono,
        codigoCiud: data.codigoCiud,
        apellidos: data.apellidos,
        nombres: data.nombres,
      }); // si necesitas guardarlo en un estado
    } catch (error) {
      console.error("Error buscando cliente:", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoCliente: recibo?.codigoCliente ?? "",
      valor: recibo?.valor ?? 0,
      customer: recibo?.cliente
        ? `${recibo.cliente.nombres} ${recibo.cliente.apellidos}`
        : "",
      ciudad: clienteActual?.codigoCiud ?? "",
      telefono: clienteActual?.telefono ?? "",
      codigoUsuario: recibo?.codigoUsuario ?? "",
    },
  });
  const { isValid } = form.formState;

  // 2. Define a submit handler.

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.put(`/api/recibo/${id}`, {
        codigoCliente: values.codigoCliente,
        codigoUsuario: values.codigoUsuario,
        valor: values.valor,
      });

      toast({
        title: "Recibo Actualizado",
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

  if (!id) return;
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
                      <Input placeholder="nit" type="text" {...field} />
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
            <FormField
              control={form.control}
              name="valor"
              //
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
          </div>
          <Button disabled={!isValid} type="submit">
            Actualizar
          </Button>
        </form>
      </Form>
    </div>
  );
}
