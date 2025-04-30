import { HeaderRecaudos } from "./components/HeaderRecaudos";
import { ListRecaudos } from "./components/ListRecaudos";
import { auth } from "@clerk/nextjs";
import { getUsuarios } from "@/lib/getUsuarios";
import NoDisponible from "@/components/NoDisponible/NoDisponible";

export default async function RecaudosPage() {
  const usuarios = await getUsuarios();
  const { userId } = auth();

  if (!userId) {
    return <NoDisponible />;
  }
  const isValid = !!usuarios.find((usuario) => usuario.codigo === userId);
  console.log("este es el usuario actaul:", userId);

  return (
    <>
      {isValid ? (
        <div>
          <HeaderRecaudos />
          <ListRecaudos />
        </div>
      ) : (
        <NoDisponible />
      )}
    </>
  );
}
