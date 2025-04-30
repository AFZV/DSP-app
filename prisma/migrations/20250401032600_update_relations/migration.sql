/*
  Warnings:

  - Added the required column `imagenUrl` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "imagenUrl" TEXT NOT NULL;
