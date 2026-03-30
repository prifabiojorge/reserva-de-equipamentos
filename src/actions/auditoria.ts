"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

interface LogParams {
  acao: string
  entidade: string
  entidadeId: string
  detalhes?: string
}

export async function registrarLog(params: LogParams) {
  const session = await auth()
  if (!session) return

  await prisma.logAuditoria.create({
    data: {
      usuarioId: session.user.id,
      acao: params.acao,
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      detalhes: params.detalhes,
    },
  })
}

export async function getLogs(limit = 100) {
  const session = await auth()
  if (!session) throw new Error("Não autenticado")
  if (session.user.papel !== "ADMIN") throw new Error("Sem permissão")

  return prisma.logAuditoria.findMany({
    include: {
      usuario: { select: { nome: true, email: true } },
    },
    orderBy: { criadoEm: "desc" },
    take: limit,
  })
}
