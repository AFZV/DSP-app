"use client";
import { CardProduct } from "@/components/CardProduct";
import { ProductProps } from "@/components/CardProduct/CardProduct.type";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Carrito } from "../Carrito";
import { formatValue } from "@/utils/FormartValue";

export function ListProducts({ productos }: { productos: ProductProps[] }) {
  const [carrito, setCarrito] = useState<
    (ProductProps & { cantidad: number })[]
  >([]);
  const router = useRouter();
  const [observacion, setObservacion] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [nit, setNit] = useState<string>("");
  const [cliente, setCliente] = useState<string>("");
  const [clienteEncontrado, setClienteEncontrado] = useState<boolean>(false);

  const handleEliminar = (index: number) => {
    setCarrito((prevCarrito) => prevCarrito.filter((_, i) => i !== index));
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  console.log("esto hay en carrito:", carrito);

  const onClickSearch = async () => {
    try {
      const response = await fetch(`/api/clientePorNit?nit=${nit}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error al buscar cliente:",
          errorData.error || "Error desconocido"
        );
        setCliente("");
        setClienteEncontrado(false);
        return;
      }
      const data = await response.json();
      setCliente(data);
      setClienteEncontrado(true);
      console.log("id que llega del cliente:", data);
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      setCliente("");
      setClienteEncontrado(false);
    }
  };

  const handleFinalizarPedido = async () => {
    if (cliente) {
      try {
        const response = await fetch("/api/pedido", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carrito,
            observacion,
            clienteId: cliente,
          }),
        });

        const data = await response.json();
        console.log("esto va en data a pedidos:", data);
        if (data.success) {
          console.log("Pedido guardado:", data.pedido);
          router.push(`/`);
          router.refresh();
        } else {
          console.error("Error en el servidor:", data.error);
        }
      } catch (error) {
        console.error("Error al enviar pedido:", error);
      }
    }
  };

  const handleAgregarAlCarrito = (
    nuevoProducto: ProductProps & { cantidad: number }
  ) => {
    setCarrito((prev) => {
      const index = prev.findIndex(
        (item) => item.nombre === nuevoProducto.nombre
      );
      if (index !== -1) {
        const actualizado = prev.map((item, i) =>
          i === index
            ? { ...item, cantidad: item.cantidad + nuevoProducto.cantidad }
            : item
        );
        setIsOpenModal(true);
        return actualizado;
      }
      setIsOpenModal(true);
      return [...prev, nuevoProducto];
    });
  };

  return (
    <div
      className="grid md:grid-cols-2
     xl:grid-cols-3 gap-12
      place-items-center mt-2 
       "
    >
      {productos.map((producto) => (
        <CardProduct
          onAgregar={handleAgregarAlCarrito}
          producto={producto}
          key={producto.imagenUrl}
        />
      ))}

      {isOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-l">
            <div className="  my-4">
              <label className="block mb-1">CLIENTE:</label>
              <div className="grid grid-cols-2">
                <input
                  placeholder="Nit del cliente"
                  type="text"
                  min={5}
                  max={11}
                  className="border border-gray-300 p-2 w-full rounded"
                  onChange={(e) => {
                    setNit(e.target.value);
                  }}
                />

                {clienteEncontrado && (
                  <div className="flex flex-col justify-between p-3 text-l">
                    <input
                      type="text"
                      disabled
                      value="Cliente encontrado"
                      className="font-bold"
                    />
                    <input type="text" value={cliente} disabled />
                  </div>
                )}
                {!clienteEncontrado && (
                  <button type="button" onClick={onClickSearch}>
                    <Search strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
            <Carrito
              carrito={carrito}
              cantidad={cantidad}
              subtotal={0}
              total={total}
              handleEliminar={handleEliminar}
            />
            {/**
            <div className="my-4">
              <label className="block mb-1">OBSERVACION:</label>
              <input
                type="text"
                min={1}
                className="border border-gray-300 p-2 w-full rounded"
                onChange={(e) => {
                  setObservacion(e.target.value);
                }}
              />
            </div> */}
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setIsOpenModal(false)}
                className="bg-sky-700"
              >
                Seguir en pedido
              </Button>
              <Button onClick={handleFinalizarPedido} className="bg-green-700">
                Finalizar Pedido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
