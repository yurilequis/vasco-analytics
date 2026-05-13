/*
  Warnings:

  - A unique constraint covering the columns `[nomePopular,equipeId]` on the table `Jogador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Jogador_nomePopular_equipeId_key" ON "Jogador"("nomePopular", "equipeId");
