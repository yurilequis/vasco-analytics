-- CreateTable
CREATE TABLE "Equipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nomeCurto" TEXT NOT NULL,
    "sigla" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "fundacao" DATETIME,
    "escudoUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Competicao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nomeCurto" TEXT,
    "tipo" TEXT,
    "temporada" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Estadio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nomePopular" TEXT,
    "cidade" TEXT NOT NULL,
    "estado" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "capacidade" INTEGER,
    "inauguracao" DATETIME,
    "proprietario" TEXT,
    "grama" TEXT,
    "fotoUrl" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Arbitro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCompleto" TEXT NOT NULL,
    "nomePopular" TEXT NOT NULL,
    "dataNascimento" DATETIME,
    "nacionalidade" TEXT NOT NULL DEFAULT 'Brasileiro',
    "estado" TEXT,
    "fotoUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Jogador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipeId" INTEGER NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "nomePopular" TEXT NOT NULL,
    "dataNascimento" DATETIME,
    "nacionalidade" TEXT,
    "posicao" TEXT,
    "posicaoSecundaria" TEXT,
    "numeroCamisa" INTEGER,
    "peDominante" TEXT,
    "alturaCm" INTEGER,
    "pesoKg" REAL,
    "fotoUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Jogador_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "competicaoId" INTEGER NOT NULL,
    "equipeCasaId" INTEGER NOT NULL,
    "equipeVisitanteId" INTEGER NOT NULL,
    "estadioId" INTEGER,
    "arbitroId" INTEGER,
    "dataHora" DATETIME NOT NULL,
    "rodada" INTEGER,
    "fase" TEXT,
    "golsCasa" INTEGER,
    "golsVisitante" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'agendada',
    "publico" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Partida_competicaoId_fkey" FOREIGN KEY ("competicaoId") REFERENCES "Competicao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Partida_equipeCasaId_fkey" FOREIGN KEY ("equipeCasaId") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Partida_equipeVisitanteId_fkey" FOREIGN KEY ("equipeVisitanteId") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Partida_estadioId_fkey" FOREIGN KEY ("estadioId") REFERENCES "Estadio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Partida_arbitroId_fkey" FOREIGN KEY ("arbitroId") REFERENCES "Arbitro" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EstatisticaJogador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partidaId" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "titular" BOOLEAN NOT NULL DEFAULT false,
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
    "notaDesempenho" REAL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EstatisticaJogador_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EstatisticaJogador_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EstatisticaJogador_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EstatisticaEquipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partidaId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "posseBola" REAL,
    "chutes" INTEGER NOT NULL DEFAULT 0,
    "chutesGol" INTEGER NOT NULL DEFAULT 0,
    "escanteios" INTEGER NOT NULL DEFAULT 0,
    "faltas" INTEGER NOT NULL DEFAULT 0,
    "impedimentos" INTEGER NOT NULL DEFAULT 0,
    "passesTentados" INTEGER NOT NULL DEFAULT 0,
    "passesCompletos" INTEGER NOT NULL DEFAULT 0,
    "cartoesAmarelos" INTEGER NOT NULL DEFAULT 0,
    "cartoesVermelhos" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EstatisticaEquipe_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EstatisticaEquipe_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EstatisticaArbitro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EstatisticaArbitro_arbitroId_fkey" FOREIGN KEY ("arbitroId") REFERENCES "Arbitro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EstatisticaArbitro_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventoPartida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partidaId" INTEGER NOT NULL,
    "equipeId" INTEGER NOT NULL,
    "jogadorId" INTEGER,
    "jogadorSecundarioId" INTEGER,
    "tipoEvento" TEXT NOT NULL,
    "minuto" INTEGER NOT NULL,
    "minutoAcrescimo" INTEGER NOT NULL DEFAULT 0,
    "descricao" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventoPartida_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventoPartida_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventoPartida_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EventoPartida_jogadorSecundarioId_fkey" FOREIGN KEY ("jogadorSecundarioId") REFERENCES "Jogador" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipe_nome_key" ON "Equipe"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaJogador_partidaId_jogadorId_key" ON "EstatisticaJogador"("partidaId", "jogadorId");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaEquipe_partidaId_equipeId_key" ON "EstatisticaEquipe"("partidaId", "equipeId");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaArbitro_partidaId_key" ON "EstatisticaArbitro"("partidaId");

-- CreateIndex
CREATE UNIQUE INDEX "EstatisticaArbitro_arbitroId_partidaId_key" ON "EstatisticaArbitro"("arbitroId", "partidaId");
