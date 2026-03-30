export interface Usuario {
  id: string
  nome: string
  email: string
  papel: "PROFESSOR" | "COORDENADOR" | "ADMIN"
  ativo: boolean
  criadoEm: Date
  atualizadoEm: Date
}

export interface CategoriaRecurso {
  id: string
  nome: string
  icone: string | null
}

export interface Recurso {
  id: string
  nome: string
  descricao: string | null
  categoriaId: string
  categoria?: CategoriaRecurso
  quantidadeTotal: number
  quantidadeMinima: number
  ativo: boolean
  cor: string | null
  criadoEm: Date
}

export interface Turno {
  id: string
  nome: string
  ordem: number
}

export interface Horario {
  id: string
  turnoId: string
  turno?: Turno
  numero: number
  horaInicio: string
  horaFim: string
}

export interface Reserva {
  id: string
  data: Date
  usuarioId: string
  usuario?: Usuario
  recursoId: string
  recurso?: Recurso
  quantidadeUsada: number
  observacao: string | null
  status: "CONFIRMADA" | "CANCELADA" | "PENDENTE"
  criadoEm: Date
  atualizadoEm: Date
  horarios?: ReservaHorario[]
}

export interface ReservaHorario {
  id: string
  reservaId: string
  horarioId: string
  horario?: Horario
}

export interface LogAuditoria {
  id: string
  usuarioId: string
  acao: "CRIAR" | "EDITAR" | "CANCELAR"
  entidade: "Reserva" | "Recurso"
  entidadeId: string
  detalhes: string | null
  criadoEm: Date
}

export interface ConflictResult {
  hasConflict: boolean
  conflicts: {
    horarioNumero: number
    horarioLabel: string
    professorNome: string
    quantidadeJaReservada: number
    quantidadeDisponivel: number
  }[]
  recursoCapacidadeTotal: number
}
