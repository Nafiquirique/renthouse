-- CreateEnum
CREATE TYPE "public"."TipoUser" AS ENUM ('ADMIN', 'PROPRIETARIO', 'CLIENTE');

-- CreateEnum
CREATE TYPE "public"."TipoImovel" AS ENUM ('QUARTO', 'CASA', 'APARTAMENTO', 'DEPENDENCIA');

-- CreateEnum
CREATE TYPE "public"."EstadoImovel" AS ENUM ('DISPONIVEL', 'RESERVADO', 'ARRENDADO');

-- CreateEnum
CREATE TYPE "public"."EstadoReserva" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "tipo" "public"."TipoUser" NOT NULL DEFAULT 'CLIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Imovel" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "public"."TipoImovel" NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "endereco" TEXT,
    "imagem" TEXT,
    "contacto" TEXT,
    "estado" "public"."EstadoImovel" NOT NULL DEFAULT 'DISPONIVEL',
    "proprietarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reserva" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT,
    "estado" "public"."EstadoReserva" NOT NULL DEFAULT 'PENDENTE',
    "clienteId" INTEGER NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Imovel" ADD CONSTRAINT "Imovel_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "public"."Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
