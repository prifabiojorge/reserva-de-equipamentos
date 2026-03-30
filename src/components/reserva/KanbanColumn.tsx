"use client"

import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { KanbanCard } from "./KanbanCard"

interface Reserva {
  id: string
  quantidadeUsada: number
  observacao: string | null
  status: string
  usuario: { nome: string }
  recurso: { nome: string; cor: string | null; quantidadeTotal: number }
  horarios: {
    horario: {
      numero: number
      horaInicio: string
      horaFim: string
      turno: { nome: string }
    }
  }[]
}

interface KanbanColumnProps {
  date: Date
  reservas: Reserva[]
}

export function KanbanColumn({ date, reservas }: KanbanColumnProps) {
  const diaSemana = format(date, "EEE", { locale: ptBR })
  const diaNumero = format(date, "dd")
  const hoje = isToday(date)

  // Separar por turno
  const reservasManha = reservas.filter((r) =>
    r.horarios.some((rh) => rh.horario.turno.nome === "Manhã")
  )
  const reservasTarde = reservas.filter((r) =>
    r.horarios.some((rh) => rh.horario.turno.nome === "Tarde")
  )

  function formatHorarios(reserva: Reserva) {
    return reserva.horarios
      .map(
        (rh) =>
          `${rh.horario.turno.nome.charAt(0)}${rh.horario.numero}º(${rh.horario.horaInicio}-${rh.horario.horaFim})`
      )
      .join(", ")
  }

  return (
    <div
      className={`flex flex-col min-w-[180px] flex-1 border-r border-slate-200 last:border-r-0 ${
        hoje ? "bg-blue-50/30" : ""
      }`}
    >
      {/* Header da coluna */}
      <div
        className={`text-center py-2.5 border-b border-slate-200 ${
          hoje ? "bg-blue-100" : "bg-slate-50"
        }`}
      >
        <p
          className={`text-xs font-medium uppercase ${
            hoje ? "text-blue-700" : "text-slate-500"
          }`}
        >
          {diaSemana}
        </p>
        <p
          className={`text-lg font-bold ${
            hoje ? "text-blue-700" : "text-slate-800"
          }`}
        >
          {diaNumero}
        </p>
      </div>

      {/* Turno Manhã */}
      <div className="flex-1 p-2 space-y-2 min-h-[100px]">
        {reservasManha.length === 0 ? (
          <p className="text-[10px] text-slate-300 text-center py-4">—</p>
        ) : (
          reservasManha.map((reserva) => (
            <KanbanCard
              key={reserva.id}
              id={reserva.id}
              recursoNome={reserva.recurso.nome}
              recursoCor={reserva.recurso.cor}
              professorNome={reserva.usuario.nome}
              quantidadeUsada={reserva.quantidadeUsada}
              quantidadeTotal={reserva.recurso.quantidadeTotal}
              horarios={formatHorarios(reserva)}
              observacao={reserva.observacao}
              status={reserva.status}
            />
          ))
        )}
      </div>

      {/* Separador de turno */}
      <div className="border-t-2 border-dashed border-slate-300 mx-2" />

      {/* Turno Tarde */}
      <div className="flex-1 p-2 space-y-2 min-h-[100px]">
        {reservasTarde.length === 0 ? (
          <p className="text-[10px] text-slate-300 text-center py-4">—</p>
        ) : (
          reservasTarde.map((reserva) => (
            <KanbanCard
              key={reserva.id}
              id={reserva.id}
              recursoNome={reserva.recurso.nome}
              recursoCor={reserva.recurso.cor}
              professorNome={reserva.usuario.nome}
              quantidadeUsada={reserva.quantidadeUsada}
              quantidadeTotal={reserva.recurso.quantidadeTotal}
              horarios={formatHorarios(reserva)}
              observacao={reserva.observacao}
              status={reserva.status}
            />
          ))
        )}
      </div>
    </div>
  )
}
