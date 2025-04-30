///
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
const formSchema = z.object({
  nombre: z.string().min(2).max(50),
  precio: z.coerce.number().min(1),
  categoria: z.string().min(2).max(50),
  imagenUrl: z.string().url(),
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
import { FormCreateProductProps } from "./FormCreateProduct.types";
import { useState } from "react";
import { UploadButton } from "@/utils/UploadThing";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function FormCreateProduct(props: FormCreateProductProps) {
  const { setOpenModalCreate } = props;
  const router = useRouter();
  const { toast } = useToast();
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      precio: 0,
      categoria: "",
    },
  });
  const { isValid } = form.formState;

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/producto", values);
      toast({
        title: "Producto Creado",
      });
      router.refresh();
      setOpenModalCreate(false); //kk
    } catch (error) {
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
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precio" //
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Precio De Venta"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Precio Unitario o docena</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoria" //
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="hogar">HOGAR</option>
                      <option value="papeleria">PAPELERIA</option>
                      <option value="ferreteria">FERRETERIA</option>
                      <option value="cacharro">CACHARRO</option>
                      <option value="otros">Otros</option>
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="imagenUrl" //
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                      {photoUploaded ? (
                        <p className=" text-sm">Imagen Cargada</p>
                      ) : (
                        <UploadButton
                          className="bg-slate-600/20
                  text-slate-800
                   rounded-lg outline-dotted outline-3"
                          {...field}
                          endpoint="productImage"
                          onClientUploadComplete={(res) => {
                            if (res && res.length > 0) {
                              form.setValue("imagenUrl", res[0].ufsUrl);
                              setPhotoUploaded(true);
                              toast({
                                title: "Foto Cargada",
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              title: "Error Cargando Foto",
                              content: String(error),
                            });
                          }}
                        />
                      )}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit">Crear</Button>
        </form>
      </Form>
    </div>
  );
}
