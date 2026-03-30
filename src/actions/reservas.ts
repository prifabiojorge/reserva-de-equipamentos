"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { registrarLog } from "./auditoria"

export async function getReservasPorPeriodo(dataInicio: Date, dataFim: Date) {
  return prisma.reserva.findMany({
    where: {
      data: { gte: dataInicio, lte: dataFim },
      status: { not: "CANCELADA" },
    },
    include: {
      usuario: { select: { id: true, nome: true } },
      recurso: { select: { id: true, nome: true, cor: true, quantidadeTotal: true, categoria: true } },
      horarios: {
        include: {
          horario: { include: { turno: true } },
        },
        orderBy: { horario: { numero: "asc" } },
      },
    },
    orderBy: { data: "asc" },
  })
}

export async function getMinhasReservas() {
  const session = await auth()
  if (!session) throw new Error("Não autenticado")

  return prisma.reserva.findMany({
    where: {
      usuarioId: session.user.id,
      status: { not: "CANCELADA" },
    },
    include: {
      recurso: { select: { nome: true, cor: true } },
      horarios: {
        include: {
          horario: { include: { turno: true } },
        },
      },
    },
    orderBy: { data: "desc" },
    take: 50,
  })
}

export async function cancelarReserva(id: string) {
  const session = await auth()
  if (!session) throw new Error("Não autenticado")

  const reserva = await prisma.reserva.findUnique({ where: { id } })
  if (!reserva) throw new Error("Reserva não encontrada")

  // Professor só cancela próprias
  if (session.user.papel === "PROFESSOR" && reserva.usuarioId !== session.user.id) {
    throw new Error("Sem permissão")
  }

  await prisma.reserva.update({
    where: { id },
    data: { status: "CANCELADA" },
  })

  await registrarLog({
    acao: "CANCELAR",
    entidade: "Reserva",
    entidadeId: id,
    detalhes: JSON.stringify({ recursoId: reserva.recursoId, data: reserva.data }),
  })
}
