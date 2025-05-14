import { HeaderCatalog } from "./(components)/HeaderCatalog";
import { db } from "@/lib/db";
import { GetCurrentUserId, getUser } from "@/lib/getUsuarios";
import { getAllProducts } from "@/lib/productos/getAll";
import { CatalogClientWrapper } from "./(components)/CatalogClientWrapper";

export default async function CatalogPage() {
  const userId = await GetCurrentUserId();

  if (!userId) return <div>No autorizado</div>;

  const products = await getAllProducts();

  const userExist = await db.usuario.findUnique({
    where: { codigo: userId },
    select: { codigo: true, nombres: true, apellidos: true },
  });

  if (!userExist) return <div>Usuario no encontrado</div>;

  const userType = await getUser(userId);

  return (
    <div>
      {userType === "admin" && <HeaderCatalog />}
      <div className="text-sm text-muted-foreground mb-2">
        Bienvenido, {userExist.nombres} {userExist.apellidos}
      </div>

      <CatalogClientWrapper productos={products} />
    </div>
  );
}
