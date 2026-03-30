export const TURNOS = {
  MANHA: "Manhã",
  TARDE: "Tarde",
} as const

// Horários reais do CISEB
export const HORARIOS_PADRAO = {
  MANHA: [
    { numero: 1, horaInicio: "07:20", horaFim: "08:10" },
    { numero: 2, horaInicio: "08:10", horaFim: "09:00" },
    // INTERVALO 09:00 - 09:20
    { numero: 3, horaInicio: "09:20", horaFim: "10:10" },
    { numero: 4, horaInicio: "10:10", horaFim: "11:00" },
    { numero: 5, horaInicio: "11:00", horaFim: "11:45" },
  ],
  TARDE: [
    { numero: 6, horaInicio: "13:15", horaFim: "14:00" },
    { numero: 7, horaInicio: "14:00", horaFim: "14:45" },
    // INTERVALO 14:45 - 15:00
    { numero: 8, horaInicio: "15:00", horaFim: "15:45" },
    { numero: 9, horaInicio: "15:45", horaFim: "16:30" },
  ],
} as const

export const STATUS_RESERVA = {
  CONFIRMADA: "CONFIRMADA",
  CANCELADA: "CANCELADA",
  PENDENTE: "PENDENTE",
} as const

export const PAPEIS = {
  PROFESSOR: "PROFESSOR",
  COORDENADOR: "COORDENADOR",
  ADMIN: "ADMIN",
} as const

export const DIAS_SEMANA = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
] as const

export const DIAS_SEMANA_COMPLETO = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const
