-- AlterTable
ALTER TABLE "EstatisticaEquipe" ADD COLUMN     "chutesFora" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "chutesNaTrave" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defesasGoleiro" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "formacao" TEXT,
ADD COLUMN     "grandesChances" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xG" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Jogador" ADD COLUMN     "clubeEmprestimo" TEXT,
ADD COLUMN     "tipoContrato" TEXT NOT NULL DEFAULT 'DEFINITIVO';

-- CreateTable
CREATE TABLE "ClassificacaoEquipe" (
    "id" SERIAL NOT NULL,
    "competicaoId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "posicao" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL,
    "jogos" INTEGER NOT NULL,
    "vitorias" INTEGER NOT NULL,
    "empates" INTEGER NOT NULL,
    "derrotas" INTEGER NOT NULL,
    "golsPro" INTEGER NOT NULL,
    "golsContra" INTEGER NOT NULL,
    "saldoGols" INTEGER NOT NULL,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassificacaoEquipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassificacaoEquipe_competicaoId_equipeId_key" ON "ClassificacaoEquipe"("competicaoId", "equipeId");

-- AddForeignKey
ALTER TABLE "ClassificacaoEquipe" ADD CONSTRAINT "ClassificacaoEquipe_competicaoId_fkey" FOREIGN KEY ("competicaoId") REFERENCES "Competicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassificacaoEquipe" ADD CONSTRAINT "ClassificacaoEquipe_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
