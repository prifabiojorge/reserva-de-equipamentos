"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { recursoSchema } from "@/lib/validators"
import { registrarLog } from "./auditoria"

export async function getRecursos() {
  return prisma.recurso.findMany({
    where: { ativo: true },
    include: { categoria: true },
    orderBy: { nome: "asc" },
  })
}

export async function getRecursoPorId(id: string) {
  return prisma.recurso.findUnique({
    where: { id },
    include: { categoria: true },
  })
}

export async function getCategorias() {
  return prisma.categoriaRecurso.findMany({
    orderBy: { nome: "asc" },
  })
}

export async function criarRecurso(formData: FormData) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    throw new Error("Sem permissão")
  }

  const dados = recursoSchema.parse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    categoriaId: formData.get("categoriaId"),
    quantidadeTotal: formData.get("quantidadeTotal"),
    quantidadeMinima: formData.get("quantidadeMinima") || 1,
    cor: formData.get("cor"),
  })

  const novo = await prisma.recurso.create({ data: dados })
  await registrarLog({ acao: "CRIAR", entidade: "Recurso", entidadeId: novo.id, detalhes: JSON.stringify(dados) })
  revalidatePath("/recursos")
}

export async function atualizarRecurso(id: string, formData: FormData) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    throw new Error("Sem permissão")
  }

  const dados = recursoSchema.parse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao"),
    categoriaId: formData.get("categoriaId"),
    quantidadeTotal: formData.get("quantidadeTotal"),
    quantidadeMinima: formData.get("quantidadeMinima") || 1,
    cor: formData.get("cor"),
  })

  await prisma.recurso.update({ where: { id }, data: dados })
  revalidatePath("/recursos")
}

export async function desativarRecurso(id: string) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    throw new Error("Sem permissão")
  }

  await prisma.recurso.update({ where: { id }, data: { ativo: false } })
  revalidatePath("/recursos")
}
