"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getTurnosComHorarios() {
  return prisma.turno.findMany({
    include: {
      horarios: { orderBy: { numero: "asc" } },
    },
    orderBy: { ordem: "asc" },
  })
}

export async function criarHorario(
  turnoId: string,
  numero: number,
  horaInicio: string,
  horaFim: string
) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    throw new Error("Sem permissão")
  }

  await prisma.horario.create({
    data: { turnoId, numero, horaInicio, horaFim },
  })
  revalidatePath("/configuracoes")
}

export async function atualizarHorario(
  id: string,
  dados: { numero?: number; horaInicio?: string; horaFim?: string }
) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    throw new Error("Sem permissão")
  }

  await prisma.horario.update({ where: { id }, data: dados })
  revalidatePath("/configuracoes")
}

export async function deletarHorario(id: string) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    throw new Error("Sem permissão")
  }

  // Verificar se há reservas usando este horário
  const reservas = await prisma.reservaHorario.count({
    where: { horarioId: id },
  })
  if (reservas > 0) {
    throw new Error("Não é possível deletar horário com reservas existentes")
  }

  await prisma.horario.delete({ where: { id } })
  revalidatePath("/configuracoes")
}

export async function criarTurno(nome: string, ordem: number) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    throw new Error("Sem permissão")
  }

  await prisma.turno.create({ data: { nome, ordem } })
  revalidatePath("/configuracoes")
}
