import { Suspense } from "react"
import { parseISO, startOfWeek } from "date-fns"
import { auth } from "@/lib/auth"
import { KanbanBoard } from "@/components/reserva/KanbanBoard"

interface PageProps {
  searchParams: Promise<{ semana?: string }>
}

export default async function ReservasPage({ searchParams }: PageProps) {
  const session = await auth()
  const params = await searchParams

  let weekStart: Date
  if (params.semana) {
    weekStart = startOfWeek(parseISO(params.semana), { weekStartsOn: 1 })
  } else {
    weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Quadro de Reservas
        </h2>
        <p className="text-sm text-slate-500">
          {session?.user?.name} — visão semanal tipo Kanban
        </p>
      </div>

      <Suspense fallback={<KanbanSkeleton />}>
        <KanbanBoard weekStart={weekStart} />
      </Suspense>
    </div>
  )
}

function KanbanSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-8 w-32 bg-slate-200 rounded" />
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded" />
      </div>
      <div className="h-[400px] bg-slate-200 rounded-xl" />
    </div>
  )
}
