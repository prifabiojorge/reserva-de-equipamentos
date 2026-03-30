"use server"

import { prisma } from "@/lib/prisma"
import type { ConflictResult } from "@/types"

interface CheckConflictParams {
  recursoId: string
  data: Date
  horarioIds: string[]
  quantidadeDesejada: number
  reservaIdExcluir?: string
}

export async function checkConflicts(
  params: CheckConflictParams
): Promise<ConflictResult> {
  const { recursoId, data, horarioIds, quantidadeDesejada, reservaIdExcluir } = params

  const recurso = await prisma.recurso.findUniqueOrThrow({
    where: { id: recursoId },
  })

  const reservasExistentes = await prisma.reservaHorario.findMany({
    where: {
      horarioId: { in: horarioIds },
      reserva: {
        data,
        recursoId,
        status: { not: "CANCELADA" },
        ...(reservaIdExcluir ? { id: { not: reservaIdExcluir } } : {}),
      },
    },
    include: {
      horario: { include: { turno: true } },
      reserva: { include: { usuario: true } },
    },
  })

  const conflictMap = new Map<
    string,
    {
      horarioNumero: number
      horarioLabel: string
      professores: string[]
      quantidadeTotal: number
    }
  >()

  for (const rh of reservasExistentes) {
    const key = rh.horarioId
    const existing = conflictMap.get(key) || {
      horarioNumero: rh.horario.numero,
      horarioLabel: `${rh.horario.turno.nome} - ${rh.horario.numero}º horário (${rh.horario.horaInicio}-${rh.horario.horaFim})`,
      professores: [],
      quantidadeTotal: 0,
    }
    existing.professores.push(rh.reserva.usuario.nome)
    existing.quantidadeTotal += rh.reserva.quantidadeUsada
    conflictMap.set(key, existing)
  }

  const conflicts = []
  for (const [, info] of conflictMap) {
    const disponivel = recurso.quantidadeTotal - info.quantidadeTotal
    if (disponivel < quantidadeDesejada) {
      conflicts.push({
        horarioNumero: info.horarioNumero,
        horarioLabel: info.horarioLabel,
        professorNome: info.professores.join(", "),
        quantidadeJaReservada: info.quantidadeTotal,
        quantidadeDisponivel: Math.max(0, disponivel),
      })
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    recursoCapacidadeTotal: recurso.quantidadeTotal,
  }
}
