import { HeaderCatalog } from "./components/HeaderCatalog";
import { Separator } from "@/components/ui/separator";
import { ListProducts } from "./components/ListProducts";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function CatalogPage() {
  const { userId } = auth();

  if (!userId) {
    return <div>No autorizado</div>; // También puedes hacer redirect aquí si prefieres
  }
  const products = await db.producto.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses[0].emailAddress;

  const usuarioEmail = await db.usuario.findFirst({
    where: { correo: email },
    select: {
      codigo: true,
      nombres: true,
      apellidos: true,
      tipoUsuario: true,
    },
  });

  if (!usuarioEmail) {
    return <div>Usuario no encontrado</div>;
  }

  const tipoUsuario = usuarioEmail.tipoUsuario;

  return (
    <div>
      {tipoUsuario === "admin" && (
        <div className="mb-2">
          <HeaderCatalog />
          <div className="text-sm text-muted-foreground">
            Bienvenido, {usuarioEmail.nombres} {usuarioEmail.apellidos}
          </div>
        </div>
      )}
      <Button>FILTRAR</Button>
      <Separator />

      <ListProducts productos={products} />
    </div>
  );
}
