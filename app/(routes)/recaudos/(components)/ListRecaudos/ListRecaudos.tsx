import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

import { getRecaudosPorVendedor } from "@/lib/recaudos/getRecadosPorVendedor";
import { getAllRecaudos } from "@/lib/recaudos/getAllRecaudos";
import { GetCurrentUserId, getUser } from "@/lib/getUsuarios";

export async function ListRecaudos() {
  const userId = await GetCurrentUserId();
  const user = await getUser(userId);

  const getData = async (userType: string) => {
    if (userType === "admin") {
      return await getAllRecaudos();
    } else {
      return await getRecaudosPorVendedor();
    }
  };
  const data = await getData(user);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
