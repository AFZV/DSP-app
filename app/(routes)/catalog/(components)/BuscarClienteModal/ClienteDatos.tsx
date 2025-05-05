import { Search } from "lucide-react";
import React from "react";

export interface ClientePedido {
  id: string;
  nit: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
  direccion: string;
}

interface ClienteDatosProps {
  clienteEncontrado: boolean;
  cliente: ClientePedido;
  setClienteEncontrado: (value: boolean) => void;
  setCliente: (value: ClientePedido) => void;
  nit?: string;
  setNit?: (value: string) => void;
}

export function ClienteDatos({
  clienteEncontrado,
  cliente,
  setClienteEncontrado,
  setCliente,
  nit,
  setNit,
}: ClienteDatosProps) {
  const onClickSearch = async () => {
    if (nit && setNit) {
      try {
        const response = await fetch(`/api/clientePorNit?nit=${nit}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Error al buscar cliente:",
            errorData.error || "Error desconocido"
          );
          setCliente({ ...cliente });
          setClienteEncontrado(false);
          return;
        }
        const data = await response.json();
        console.log("esto llega en data al seleciconar cliente:", data);
        setCliente({ ...data, ciudad: data.codigoCiud });
        setClienteEncontrado(true);
      } catch (error) {
        setCliente({ ...cliente });
        setClienteEncontrado(false);
      }
    } else {
      console.warn("Por favor, ingresa un NIT para buscar.");
    }
  };

  console.log("esto hay en ciudad :", cliente.ciudad);

  return (
    <div className="my-4">
      {clienteEncontrado ? (
        <div className="flex flex-col justify-between p-3 text-l">
          <label className="block mb-1 font-bold">Cliente Encontrado:</label>
          <label>Nit:</label>
          <input
            type="text"
            value={cliente.nit}
            disabled
            className="border border-gray-300 p-2 w-full rounded mb-1"
          />
          <label>Nombre:</label>
          <input
            type="text"
            value={`${cliente.nombres} ${cliente.apellidos}`}
            disabled
            className="border border-gray-300 p-2 w-full rounded mb-1"
          />
          <label>Teléfono:</label>
          <input
            type="text"
            value={cliente.telefono}
            disabled
            className="border border-gray-300 p-2 w-full rounded mb-1"
          />
          <label>Ciudad:</label>
          <input
            type="text"
            value={cliente.ciudad}
            disabled
            className="border border-gray-300 p-2 w-full rounded mb-1"
          />
          <label>Dirección:</label>
          <input
            type="text"
            value={cliente.direccion}
            disabled
            className="border border-gray-300 p-2 w-full rounded mb-1"
          />
        </div>
      ) : (
        <div>
          <label className="block mb-1">Buscar Cliente:</label>
          <div className="flex items-center space-x-2">
            <input
              placeholder="Nit del cliente"
              type="text"
              min={5}
              max={11}
              className="border border-gray-300 p-2 w-full rounded"
              value={nit}
              onChange={(e) => {
                if (setNit) {
                  setNit(e.target.value);
                }
              }}
            />
            <button type="button" onClick={onClickSearch}>
              <Search strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
