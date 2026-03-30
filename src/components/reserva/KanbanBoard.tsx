import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  getDay,
} from "date-fns"
import { getReservasPorPeriodo } from "@/actions/reservas"
import { WeekNavigator } from "./WeekNavigator"
import { KanbanColumn } from "./KanbanColumn"

interface KanbanBoardProps {
  weekStart: Date
}

export async function KanbanBoard({ weekStart }: KanbanBoardProps) {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
  const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Apenas dias úteis (seg=1 até sex=5)
  const workDays = allDays.filter((d) => {
    const dow = getDay(d)
    return dow >= 1 && dow <= 5
  })

  const reservas = await getReservasPorPeriodo(weekStart, weekEnd)

  return (
    <div>
      <WeekNavigator currentWeekStart={weekStart} />

      {/* Legenda */}
      <div className="flex gap-4 mb-3 text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
          Espaço
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
          Disponível
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
          Parcial
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-300" />
          Ocupado
        </div>
      </div>

      {/* Turno labels + Quadro */}
      <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white">
        {/* Coluna de labels de turno */}
        <div className="w-14 shrink-0 flex flex-col border-r border-slate-200">
          <div className="h-[60px] border-b border-slate-200 bg-slate-50" />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[10px] font-medium text-slate-500 -rotate-90 whitespace-nowrap">
              ☀️ MANHÃ
            </span>
          </div>
          <div className="border-t-2 border-dashed border-slate-300" />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[10px] font-medium text-slate-500 -rotate-90 whitespace-nowrap">
              🌙 TARDE
            </span>
          </div>
        </div>

        {/* Colunas de dias */}
        <div className="flex flex-1">
          {workDays.map((day) => {
            const dayReservas = reservas.filter((r) =>
              isSameDay(new Date(r.data), day)
            )
            return (
              <KanbanColumn
                key={day.toISOString()}
                date={day}
                reservas={dayReservas}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
