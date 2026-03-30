-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'PROFESSOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CategoriaRecurso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "icone" TEXT
);

-- CreateTable
CREATE TABLE "Recurso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoriaId" TEXT NOT NULL,
    "quantidadeTotal" INTEGER NOT NULL DEFAULT 1,
    "quantidadeMinima" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "cor" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recurso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaRecurso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "turnoId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    CONSTRAINT "Horario_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "recursoId" TEXT NOT NULL,
    "quantidadeUsada" INTEGER NOT NULL DEFAULT 1,
    "observacao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMADA',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Reserva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reserva_recursoId_fkey" FOREIGN KEY ("recursoId") REFERENCES "Recurso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReservaHorario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservaId" TEXT NOT NULL,
    "horarioId" TEXT NOT NULL,
    CONSTRAINT "ReservaHorario_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReservaHorario_horarioId_fkey" FOREIGN KEY ("horarioId") REFERENCES "Horario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogAuditoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT NOT NULL,
    "detalhes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaRecurso_nome_key" ON "CategoriaRecurso"("nome");

-- CreateIndex
CREATE INDEX "Recurso_categoriaId_idx" ON "Recurso"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "Turno_nome_key" ON "Turno"("nome");

-- CreateIndex
CREATE INDEX "Horario_turnoId_idx" ON "Horario"("turnoId");

-- CreateIndex
CREATE UNIQUE INDEX "Horario_turnoId_numero_key" ON "Horario"("turnoId", "numero");

-- CreateIndex
CREATE INDEX "Reserva_data_recursoId_idx" ON "Reserva"("data", "recursoId");

-- CreateIndex
CREATE INDEX "Reserva_usuarioId_idx" ON "Reserva"("usuarioId");

-- CreateIndex
CREATE INDEX "Reserva_data_idx" ON "Reserva"("data");

-- CreateIndex
CREATE INDEX "ReservaHorario_horarioId_idx" ON "ReservaHorario"("horarioId");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaHorario_reservaId_horarioId_key" ON "ReservaHorario"("reservaId", "horarioId");

-- CreateIndex
CREATE INDEX "LogAuditoria_criadoEm_idx" ON "LogAuditoria"("criadoEm");
