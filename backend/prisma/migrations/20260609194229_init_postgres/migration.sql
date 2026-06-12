-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Equipe" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeCurto" TEXT NOT NULL,
    "sigla" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "fundacao" TIMESTAMP(3),
    "escudoUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competicao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeCurto" TEXT,
    "tipo" TEXT,
    "temporada" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estadio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nomePopular" TEXT,
    "cidade" TEXT NOT NULL,
    "estado" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "capacidade" INTEGER,
    "inauguracao" TIMESTAMP(3),
    "proprietario" TEXT,
    "grama" TEXT,
    "fotoUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estadio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arbitro" (
    "id" SERIAL NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "nomePopular" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "nacionalidade" TEXT NOT NULL DEFAULT 'Brasileiro',
    "estado" TEXT,
    "fotoUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Arbitro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" SERIAL NOT NULL,
    "equipeId" INTEGER,
    "nomeCompleto" TEXT NOT NULL,
    "nomePopular" TEXT NOT NULL,
    "nomeOriginal" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "nacionalidade" TEXT,
    "categoria" TEXT NOT NULL DEFAULT 'Profissional',
    "posicao" TEXT,
    "posicaoSecundaria" TEXT,
    "numeroCamisa" INTEGER,
    "peDominante" TEXT,
    "alturaCm" INTEGER,
    "biografia" TEXT,
    "pesoKg" DOUBLE PRECISION,
    "fotoUrl" TEXT,
    "emprestado" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "origem" TEXT NOT NULL DEFAULT 'Desconhecida',

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" SERIAL NOT NULL,
    "competicaoId" INTEGER NOT NULL,
    "equipeCasaId" INTEGER NOT NULL,
    "equipeVisitanteId" INTEGER NOT NULL,
    "estadioId" INTEGER,
    "arbitroId" INTEGER,
    "treinadorCasaId" INTEGER,
    "treinadorVisitanteId" INTEGER,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "rodada" INTEGER,
    "fase" TEXT,
    "golsCasa" INTEGER,
    "golsVisitante" INTEGER,
    "golsPenaltisCasa" INTEGER,
    "golsPenaltisVisitante" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'agendada',
    "publico" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER,

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstatisticaJogador" (
    "id" SERIAL NOT NULL,
    "partidaId" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "titular" BOOLEAN NOT NULL DEFAULT false,
    "posicaoPartida" TEXT,
    "numeroCamisa" INTEGER,
    "posicaoMediaX" DOUBLE PRECISION,
    "posicaoMediaY" DOUBLE PRECISION,
    "heatmapUrl" TEXT,
    "minutosJogados" INTEGER NOT NULL DEFAULT 0,
    "gols" INTEGER NOT NULL DEFAULT 0,
    "assistencias" INTEGER NOT NULL DEFAULT 0,
    "chutes" INTEGER NOT NULL DEFAULT 0,
    "chutesGol" INTEGER NOT NULL DEFAULT 0,
    "passesTentados" INTEGER NOT NULL DEFAULT 0,
    "passesCompletos" INTEGER NOT NULL DEFAULT 0,
    "driblesTentados" INTEGER NOT NULL DEFAULT 0,
    "driblesCompletos" INTEGER NOT NULL DEFAULT 0,
    "desarmes" INTEGER NOT NULL DEFAULT 0,
    "interceptacoes" INTEGER NOT NULL DEFAULT 0,
    "faltasCometidas" INTEGER NOT NULL DEFAULT 0,
    "faltasSofridas" INTEGER NOT NULL DEFAULT 0,
    "cartoesAmarelos" INTEGER NOT NULL DEFAULT 0,
    "cartoesVermelhos" INTEGER NOT NULL DEFAULT 0,
    "notaDesempenho" DOUBLE PRECISION,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstatisticaJogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstatisticaEquipe" (
    "id" SERIAL NOT NULL,
    "partidaId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "posseBola" DOUBLE PRECISION,
    "chutes" INTEGER NOT NULL DEFAULT 0,
    "chutesGol" INTEGER NOT NULL DEFAULT 0,
    "escanteios" INTEGER NOT NULL DEFAULT 0,
    "faltas" INTEGER NOT NULL DEFAULT 0,
    "impedimentos" INTEGER NOT NULL DEFAULT 0,
    "passesTentados" INTEGER NOT NULL DEFAULT 0,
    "passesCompletos" INTEGER NOT NULL DEFAULT 0,
    "cartoesAmarelos" INTEGER NOT NULL DEFAULT 0,
    "cartoesVermelhos" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstatisticaEquipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstatisticaArbitro" (
    "id" SERIAL NOT NULL,
    "arbitroId" INTEGER NOT NULL,
    "partidaId" INTEGER NOT NULL,
    "faltasMarcadas" INTEGER NOT NULL DEFAULT 0,
    "cartoesAmarelos" INTEGER NOT NULL DEFAULT 0,
    "cartoesVermelhos" INTEGER NOT NULL DEFAULT 0,
    "penaltisMarcados" INTEGER NOT NULL DEFAULT 0,
    "impedimentosAssinalados" INTEGER NOT NULL DEFAULT 0,
    "tempoBola" INTEGER,
    "acrescimos1t" INTEGER NOT NULL DEFAULT 0,
    "acrescimos2t" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstatisticaArbitro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoPartida" (
    "id" SERIAL NOT NULL,
    "partidaId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "jogadorId" INTEGER,
    "jogadorSecundarioId" INTEGER,
    "tipoEvento" TEXT NOT NULL,
    "minuto" INTEGER NOT NULL,
    "minutoAcrescimo" INTEGER NOT NULL DEFAULT 0,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventoPartida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treinador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nacionalidade" TEXT NOT NULL DEFAULT 'Brasileiro',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Treinador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilFM" (
    "id" SERIAL NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "cabeceamento" INTEGER,
    "chutesLonge" INTEGER,
    "cobrancaFalta" INTEGER,
    "cruzamento" INTEGER,
    "desarme" INTEGER,
    "drible" INTEGER,
    "escanteios" INTEGER,
    "finalizacao" INTEGER,
    "laterais" INTEGER,
    "marcacao" INTEGER,
    "passe" INTEGER,
    "penaltis" INTEGER,
    "primeiroToque" INTEGER,
    "tecnica" INTEGER,
    "agressividade" INTEGER,
    "antecipacao" INTEGER,
    "bravura" INTEGER,
    "compostura" INTEGER,
    "concentracao" INTEGER,
    "decisoes" INTEGER,
    "determinacao" INTEGER,
    "imprevisibilidade" INTEGER,
    "indiceTrabalho" INTEGER,
    "lideranca" INTEGER,
    "posicionamento" INTEGER,
    "semBola" INTEGER,
    "trabalhoEquipe" INTEGER,
    "visaoJogo" INTEGER,
    "aceleracao" INTEGER,
    "agilidade" INTEGER,
    "aptidaoNatural" INTEGER,
    "equilibrio" INTEGER,
    "forca" INTEGER,
    "impulsao" INTEGER,
    "resistencia" INTEGER,
    "velocidade" INTEGER,
    "alcanceAereo" INTEGER,
    "comandoArea" INTEGER,
    "comunicacao" INTEGER,
    "excentricidade" INTEGER,
    "jogoMaos" INTEGER,
    "lancamentos" INTEGER,
    "reflexos" INTEGER,
    "reposicao" INTEGER,
    "saidaGol" INTEGER,
    "socos" INTEGER,
    "umContraUm" INTEGER,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerfilFM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_nome_key" ON "Equipe"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Competicao_nome_temporada_key" ON "Competicao"("nome", "temporada");

-- CreateIndex
CREATE UNIQUE INDEX "Jogador_nomePopular_equipeId_key" ON "Jogador"("nomePopular", "equipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Partida_equipeCasaId_equipeVisitanteId_dataHora_key" ON "Partida"("equipeCasaId", "equipeVisitanteId", "dataHora");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaJogador_partidaId_jogadorId_key" ON "EstatisticaJogador"("partidaId", "jogadorId");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaEquipe_partidaId_equipeId_key" ON "EstatisticaEquipe"("partidaId", "equipeId");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaArbitro_partidaId_key" ON "EstatisticaArbitro"("partidaId");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaArbitro_arbitroId_partidaId_key" ON "EstatisticaArbitro"("arbitroId", "partidaId");

-- CreateIndex
CREATE UNIQUE INDEX "Treinador_nome_key" ON "Treinador"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilFM_jogadorId_key" ON "PerfilFM"("jogadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Jogador" ADD CONSTRAINT "Jogador_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_competicaoId_fkey" FOREIGN KEY ("competicaoId") REFERENCES "Competicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_equipeCasaId_fkey" FOREIGN KEY ("equipeCasaId") REFERENCES "Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_equipeVisitanteId_fkey" FOREIGN KEY ("equipeVisitanteId") REFERENCES "Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_estadioId_fkey" FOREIGN KEY ("estadioId") REFERENCES "Estadio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_arbitroId_fkey" FOREIGN KEY ("arbitroId") REFERENCES "Arbitro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_treinadorCasaId_fkey" FOREIGN KEY ("treinadorCasaId") REFERENCES "Treinador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partida" ADD CONSTRAINT "Partida_treinadorVisitanteId_fkey" FOREIGN KEY ("treinadorVisitanteId") REFERENCES "Treinador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaJogador" ADD CONSTRAINT "EstatisticaJogador_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaJogador" ADD CONSTRAINT "EstatisticaJogador_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaJogador" ADD CONSTRAINT "EstatisticaJogador_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaEquipe" ADD CONSTRAINT "EstatisticaEquipe_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaEquipe" ADD CONSTRAINT "EstatisticaEquipe_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaArbitro" ADD CONSTRAINT "EstatisticaArbitro_arbitroId_fkey" FOREIGN KEY ("arbitroId") REFERENCES "Arbitro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatisticaArbitro" ADD CONSTRAINT "EstatisticaArbitro_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPartida" ADD CONSTRAINT "EventoPartida_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPartida" ADD CONSTRAINT "EventoPartida_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPartida" ADD CONSTRAINT "EventoPartida_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPartida" ADD CONSTRAINT "EventoPartida_jogadorSecundarioId_fkey" FOREIGN KEY ("jogadorSecundarioId") REFERENCES "Jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilFM" ADD CONSTRAINT "PerfilFM_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
