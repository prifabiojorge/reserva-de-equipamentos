import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
})

export const reservaSchema = z.object({
  recursoId: z.string().min(1, "Selecione um recurso"),
  data: z.string().min(1, "Selecione uma data"),
  horarioIds: z.array(z.string()).min(1, "Selecione ao menos 1 horário"),
  quantidadeUsada: z.coerce.number().min(1, "Quantidade mínima é 1"),
  observacao: z.string().optional(),
})

export const recursoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  categoriaId: z.string().min(1, "Selecione uma categoria"),
  quantidadeTotal: z.coerce.number().min(1, "Quantidade mínima é 1"),
  quantidadeMinima: z.coerce.number().min(1).default(1),
  cor: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ReservaInput = z.infer<typeof reservaSchema>
export type RecursoInput = z.infer<typeof recursoSchema>
