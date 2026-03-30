"use client"

interface HeatmapCell {
  dia: number
  mes: number
  ano: number
  ocupacao: number
  total: number
  label: string
}

interface OccupancyHeatmapProps {
  data: HeatmapCell[]
  recursoNome: string
  mes: number
  ano: number
}

export function OccupancyHeatmap({
  data,
  recursoNome,
  mes,
  ano,
}: OccupancyHeatmapProps) {
  const nomesDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

  // Organizar em grid semanal
  const semanas: HeatmapCell[][] = []
  let semanaAtual: HeatmapCell[] = []

  // Preencher dias vazios no início
  const primeiroDia = data[0]
  if (primeiroDia) {
    const dt = new Date(primeiroDia.ano, primeiroDia.mes - 1, primeiroDia.dia)
    let dow = dt.getDay()
    if (dow === 0) dow = 7
    for (let i = 1; i < dow; i++) {
      semanaAtual.push({
        dia: 0,
        mes: 0,
        ano: 0,
        ocupacao: -1,
        total: 0,
        label: "",
      })
    }
  }

  for (const cell of data) {
    semanaAtual.push(cell)
    const dt = new Date(cell.ano, cell.mes - 1, cell.dia)
    if (dt.getDay() === 0 || cell === data[data.length - 1]) {
      semanas.push(semanaAtual)
      semanaAtual = []
    }
  }

  function getCor(ocupacao: number): string {
    if (ocupacao < 0) return "bg-transparent"
    if (ocupacao === 0) return "bg-slate-100"
    if (ocupacao < 25) return "bg-emerald-100"
    if (ocupacao < 50) return "bg-emerald-300"
    if (ocupacao < 75) return "bg-amber-300"
    if (ocupacao < 100) return "bg-orange-400"
    return "bg-red-500"
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">
        {recursoNome} — {String(mes).padStart(2, "0")}/{ano}
      </h4>

      {/* Header dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {nomesDias.map((d) => (
          <div
            key={d}
            className="text-[10px] text-slate-400 text-center font-medium"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid de células */}
      {semanas.map((semana, si) => (
        <div key={si} className="grid grid-cols-7 gap-1 mb-1">
          {semana.map((cell, ci) => (
            <div
              key={ci}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium ${getCor(cell.ocupacao)} ${
                cell.ocupacao >= 0
                  ? "text-slate-700 cursor-default"
                  : "border border-dashed border-slate-200"
              }`}
              title={
                cell.ocupacao >= 0
                  ? `${cell.label}: ${cell.ocupacao}% ocupado (${cell.total} reservas)`
                  : ""
              }
            >
              {cell.dia > 0 ? cell.dia : ""}
            </div>
          ))}
        </div>
      ))}

      {/* Legenda */}
      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-500">
        <span>0%</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-4 rounded bg-slate-100" />
          <div className="w-4 h-4 rounded bg-emerald-100" />
          <div className="w-4 h-4 rounded bg-emerald-300" />
          <div className="w-4 h-4 rounded bg-amber-300" />
          <div className="w-4 h-4 rounded bg-orange-400" />
          <div className="w-4 h-4 rounded bg-red-500" />
        </div>
        <span>100%</span>
      </div>
    </div>
  )
}
