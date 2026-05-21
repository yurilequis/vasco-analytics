/*
  Warnings:

  - A unique constraint covering the columns `[nome,temporada]` on the table `Competicao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[equipeCasaId,equipeVisitanteId,dataHora]` on the table `Partida` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Competicao_nome_temporada_key" ON "Competicao"("nome", "temporada");

-- CreateIndex
CREATE UNIQUE INDEX "Partida_equipeCasaId_equipeVisitanteId_dataHora_key" ON "Partida"("equipeCasaId", "equipeVisitanteId", "dataHora");
