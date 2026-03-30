"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  format,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns"
import { ptBR } from "date-fns/locale"

interface WeekNavigatorProps {
  currentWeekStart: Date
}

export function WeekNavigator({ currentWeekStart }: WeekNavigatorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  const prevWeek = subWeeks(currentWeekStart, 1)
  const nextWeek = addWeeks(currentWeekStart, 1)
  const today = new Date()

  function navigateToWeek(date: Date) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("semana", format(date, "yyyy-MM-dd"))
    router.push(`/reservas?${params.toString()}`)
  }

  const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd })

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateToWeek(prevWeek)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Semana anterior"
        >
          ←
        </button>
        <button
          onClick={() => navigateToWeek(today)}
          className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Hoje
        </button>
        <button
          onClick={() => navigateToWeek(nextWeek)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Próxima semana"
        >
          →
        </button>
      </div>

      <h3 className="text-sm font-semibold text-slate-700">
        {format(currentWeekStart, "dd", { locale: ptBR })} –{" "}
        {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </h3>

      <Link
        href="/reservas/nova"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        + Nova
      </Link>
    </div>
  )
}
