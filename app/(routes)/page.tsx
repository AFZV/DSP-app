import { CardSummary } from "./components/CardSummary";
import { DollarSign, UserRound, BookCheck } from "lucide-react";
import { SalesDistribution } from "./components/SalesDistribution";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import NoDisponible from "@/components/NoDisponible/NoDisponible";
import { getUsuarios } from "@/lib/getUsuarios";
import { getRecibos } from "@/lib/getRecibos";
import { getPedidos } from "@/lib/getPedidos";

export default async function Home() {
  const usuarios = await getUsuarios();

  const { userId } = auth();
  if (!userId) {
    return <NoDisponible />;
  }

  const userResponse = await db.usuario.findUnique({
    where: {
      codigo: userId,
    },
    select: {
      tipoUsuario: true,
    },
  });
  const user = userResponse?.tipoUsuario;

  const totalClientes = async (id: string): Promise<number> => {
    if (user === "admin") {
      return await db.cliente.count({});
    }
    return await db.cliente.count({
      where: {
        codigoVend: id,
      },
    });
  };

  const total = await getRecibos(userId, user as string);
  const totalPedidos = await getPedidos(userId, user as string);
  const sumClientes = await totalClientes(userId);
  const isValid = !!usuarios.find((usuario) => usuario.codigo === userId);

  return (
    <>
      {isValid ? (
        <div>
          <h2>DashBoard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-x-20">
            <CardSummary
              icon={UserRound}
              total={String(sumClientes)}
              title="Total Clientes"
            />
            <CardSummary
              icon={DollarSign}
              total={String(total)}
              title="Total Cobros hoy"
            />
            <CardSummary
              icon={BookCheck}
              total={String(totalPedidos)}
              title="Ventas Hoy"
            />
          </div>
          <div className="grid grid-cols-1 md: gap-x-10 mt-12">
            <SalesDistribution />
          </div>
        </div>
      ) : (
        <NoDisponible />
      )}
    </>
  );
}
