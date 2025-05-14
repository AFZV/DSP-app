"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormCreateClienteProps } from "./FormCreateCliente.type";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { getDepartamentos } from "@/lib/getDepartamentos";
import { getCiudades } from "@/lib/getCiudades";

const formSchema = z.object({
  nit: z.string().min(2).max(10),
  nombres: z.string().min(2).max(50),
  apellidos: z.string().min(2).max(50),
  razonSocial: z.string().max(50).optional(),
  direccion: z.string().min(10).max(50),
  telefono: z.string().min(1).max(10),
  email: z.string().email("Correo inválido").max(50).optional(),
  codigoDpto: z.string().min(1),
  codigoCiud: z.string().min(1),
  codigoVend: z.string().min(1),
});

interface Departamento {
  id: number;
  name: string;
}

interface Ciudad {
  id: number;
  name: string;
}

export function FormCreateCliente(props: FormCreateClienteProps) {
  const { userId } = useAuth();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  const { setOpenModalCreate } = props;
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      nit: "",
      nombres: "",
      apellidos: "",
      direccion: "",
      codigoCiud: "",
      email: "",
      razonSocial: "",
      telefono: "",
      codigoDpto: "",
      codigoVend: userId as string,
    },
  });

  const { isValid } = form.formState;

  // Fetch departamentos al montar el componente
  useEffect(() => {
    async function fetchDepartamentos() {
      const res = await getDepartamentos();
      const data = await res.json();
      setDepartamentos(data);
    }

    fetchDepartamentos();
  }, []);

  // Fetch ciudades cuando cambia el departamento
  useEffect(() => {
    const selectedDptoId = form.watch("codigoDpto");

    if (selectedDptoId) {
      const fetchCiudades = async () => {
        const data = await getCiudades(String(selectedDptoId));
        setCiudades(data);
      };
      fetchCiudades();
    } else {
      setCiudades([]); // Limpiar si no hay selección
    }
  }, [form.watch("codigoDpto")]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const departamentoNombre = departamentos.find(
        (d) => d.id.toString() === values.codigoDpto
      )?.name;

      const ciudadNombre = ciudades.find(
        (c) => c.id.toString() === values.codigoCiud
      )?.name;

      const payload = {
        ...values,
        codigoCiud: ciudadNombre,
        codigoDpto: departamentoNombre,
        codigoVend: values.codigoVend,
      };

      await axios.post("/api/cliente", payload);
      toast({ title: "Cliente Creado" });
      router.refresh();
      setOpenModalCreate(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast({
          title: "Ya existe un cliente con ese NIT",
          variant: "destructive",
        });
      } else {
        toast({ title: "Algo salió mal", variant: "destructive" });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="nombres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="razonSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Departamento */}
          <FormField
            control={form.control}
            name="codigoDpto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un Departamento</option>
                    {departamentos.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Ciudad */}
          <FormField
            control={form.control}
            name="codigoCiud"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={!form.watch("codigoDpto")}
                    className={`w-full border rounded-md p-2 outline-none focus:ring-2 ${
                      !form.watch("codigoDpto")
                        ? "bg-gray-100 cursor-not-allowed"
                        : "focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Selecciona una Ciudad</option>
                    {ciudades.map((ciu) => (
                      <option key={ciu.id} value={ciu.id}>
                        {ciu.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Celular</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigoVend"
            disabled
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Vendedor</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" disabled={!isValid}>
            Crear
          </Button>
        </div>
      </form>
    </Form>
  );
}
