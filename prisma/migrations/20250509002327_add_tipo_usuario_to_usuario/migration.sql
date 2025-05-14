/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `concepto` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Recibo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoUsuario` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Producto_codigo_key";

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "codigoDpto" SET DATA TYPE TEXT,
ALTER COLUMN "codigoCiud" SET DATA TYPE TEXT,
ALTER COLUMN "codigoVend" SET DATA TYPE TEXT;

-- AlterTable
CREATE SEQUENCE producto_codigo_seq;
ALTER TABLE "Producto" ALTER COLUMN "codigo" SET DEFAULT nextval('producto_codigo_seq');
ALTER SEQUENCE producto_codigo_seq OWNED BY "Producto"."codigo";

-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "concepto" TEXT NOT NULL,
ADD COLUMN     "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tipo" TEXT NOT NULL,
ALTER COLUMN "codigoUsuario" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ADD COLUMN     "tipoUsuario" TEXT NOT NULL,
ALTER COLUMN "codigo" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "PedidoProducto" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PedidoProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "observaciones" TEXT,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "fechaEnvio" TIMESTAMP(3),
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PedidoProducto_pedidoId_idx" ON "PedidoProducto"("pedidoId");

-- CreateIndex
CREATE INDEX "PedidoProducto_productoId_idx" ON "PedidoProducto"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "PedidoProducto_pedidoId_productoId_key" ON "PedidoProducto"("pedidoId", "productoId");

-- CreateIndex
CREATE INDEX "Pedido_clienteId_idx" ON "Pedido"("clienteId");

-- CreateIndex
CREATE INDEX "Pedido_vendedorId_idx" ON "Pedido"("vendedorId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_key" ON "Usuario"("id");
