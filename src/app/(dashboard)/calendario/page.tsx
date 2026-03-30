import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import Link from "next/link"

interface PageProps {
  searchParams: Promise<{ mes?: string }>
}

export default async function CalendarioPage({ searchParams }: PageProps) {
  const session = await auth()
  const params = await searchParams

  let currentDate: Date
  if (params.mes) {
    currentDate = parseISO(params.mes + "-01")
  } else {
    currentDate = new Date()
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const allDays = eachDayOfInterval({ start: calStart, end: calEnd })

  const reservas = await prisma.reserva.findMany({
    where: {
      data: { gte: calStart, lte: calEnd },
      status: { not: "CANCELADA" },
    },
    include: {
      usuario: { select: { nome: true } },
      recurso: { select: { nome: true, cor: true } },
      horarios: {
        include: {
          horario: { include: { turno: true } },
        },
      },
    },
    orderBy: { data: "asc" },
  })

  const nomesDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

  const prevMonth = new Date(currentDate)
  prevMonth.setMonth(prevMonth.getMonth() - 1)
  const nextMonth = new Date(currentDate)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const totalReservasMes = reservas.filter(
    (r) => new Date(r.data) >= monthStart && new Date(r.data) <= monthEnd
  ).length

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Calendário</h2>
          <p className="text-sm text-slate-500">
            {format(monthStart, "MMMM 'de' yyyy", { locale: ptBR })} —{" "}
            {totalReservasMes} reservas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/calendario?mes=${format(prevMonth, "yyyy-MM")}`}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
          >
            ←
          </Link>
          <Link
            href="/calendario"
            className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200"
          >
            Hoje
          </Link>
          <Link
            href={`/calendario?mes=${format(nextMonth, "yyyy-MM")}`}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
          >
            →
          </Link>
        </div>
      </div>

      {/* Grid do calendário */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header dias da semana */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {nomesDias.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-medium text-slate-500 bg-slate-50"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7">
          {allDays.map((day) => {
            const dayReservas = reservas.filter((r) =>
              isSameDay(new Date(r.data), day)
            )
            const inMonth = isSameMonth(day, currentDate)
            const today = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] border-b border-r border-slate-100 p-1.5 ${
                  !inMonth ? "bg-slate-50/50" : ""
                } ${today ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium ${
                      today
                        ? "bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center"
                        : inMonth
                          ? "text-slate-700"
                          : "text-slate-300"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayReservas.length > 0 && (
                    <span className="text-[9px] text-slate-400">
                      {dayReservas.length}
                    </span>
                  )}
                </div>

                {/* Cards de reserva (máx 3 visíveis) */}
                <div className="space-y-0.5">
                  {dayReservas.slice(0, 3).map((reserva) => (
                    <div
                      key={reserva.id}
                      className="flex items-center gap-1 text-[9px] truncate"
                    >
                      {reserva.recurso.cor && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: reserva.recurso.cor }}
                        />
                      )}
                      <span className="text-slate-600 truncate">
                        {reserva.recurso.nome}
                      </span>
                    </div>
                  ))}
                  {dayReservas.length > 3 && (
                    <p className="text-[9px] text-slate-400">
                      +{dayReservas.length - 3} mais
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
