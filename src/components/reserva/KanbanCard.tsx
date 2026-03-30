"use client"

interface KanbanCardProps {
  id: string
  recursoNome: string
  recursoCor: string | null
  professorNome: string
  quantidadeUsada: number
  quantidadeTotal: number
  horarios: string
  observacao: string | null
  status: string
}

export function KanbanCard({
  recursoNome,
  recursoCor,
  professorNome,
  quantidadeUsada,
  quantidadeTotal,
  horarios,
  observacao,
  status,
}: KanbanCardProps) {
  const isEspaco = quantidadeTotal === 1
  const isParcial = !isEspaco && quantidadeUsada < quantidadeTotal
  const isCompleto = !isEspaco && quantidadeUsada >= quantidadeTotal

  // Cores por status do recurso
  let cardStyle = "bg-blue-50 border-blue-200"
  let badgeBg = "bg-blue-100 text-blue-700"

  if (status === "CANCELADA") {
    cardStyle = "bg-gray-50 border-gray-200 opacity-60"
    badgeBg = "bg-gray-100 text-gray-500"
  } else if (isEspaco) {
    cardStyle = "bg-blue-50 border-blue-300"
    badgeBg = "bg-blue-100 text-blue-700"
  } else if (isCompleto) {
    cardStyle = "bg-red-50 border-red-300"
    badgeBg = "bg-red-100 text-red-700"
  } else if (isParcial) {
    cardStyle = "bg-amber-50 border-amber-300"
    badgeBg = "bg-amber-100 text-amber-700"
  } else {
    cardStyle = "bg-emerald-50 border-emerald-300"
    badgeBg = "bg-emerald-100 text-emerald-700"
  }

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 text-sm ${cardStyle} hover:shadow-sm transition-shadow`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {recursoCor && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: recursoCor }}
            />
          )}
          <span className="font-medium text-slate-800 truncate text-xs">
            {recursoNome}
          </span>
        </div>
        {!isEspaco && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${badgeBg} shrink-0`}
          >
            {quantidadeUsada}/{quantidadeTotal}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-600 mt-1 truncate">{professorNome}</p>
      <p className="text-[10px] text-slate-500 mt-0.5">{horarios}</p>
      {observacao && (
        <p className="text-[10px] text-slate-400 mt-1 italic truncate">
          {observacao}
        </p>
      )}
    </div>
  )
}
