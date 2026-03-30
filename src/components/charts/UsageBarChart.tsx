"use client"

interface UsageBarChartProps {
  data: {
    nome: string
    cor: string | null
    totalReservas: number
    totalHorarios: number
    percentualOcupacao: number
  }[]
}

export function UsageBarChart({ data }: UsageBarChartProps) {
  const max = Math.max(...data.map((d) => d.totalReservas), 1)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h4 className="text-sm font-semibold text-slate-700 mb-4">
        Uso por Recurso (últimos 30 dias)
      </h4>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.nome}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {item.cor && (
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.cor }}
                  />
                )}
                <span className="text-xs font-medium text-slate-700">
                  {item.nome}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {item.totalReservas} reservas ({item.percentualOcupacao}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: `${(item.totalReservas / max) * 100}%`,
                  backgroundColor: item.cor || "#94A3B8",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
