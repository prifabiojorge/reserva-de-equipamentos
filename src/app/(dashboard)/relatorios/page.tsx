import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isWeekend,
  subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { OccupancyHeatmap } from "@/components/charts/OccupancyHeatmap"
import { UsageBarChart } from "@/components/charts/UsageBarChart"

export default async function RelatoriosPage() {
  const session = await auth()
  if (
    session?.user?.papel !== "ADMIN" &&
    session?.user?.papel !== "COORDENADOR"
  ) {
    redirect("/reservas")
  }

  const agora = new Date()
  const inicioMes = startOfMonth(agora)
  const fimMes = endOfMonth(agora)
  const inicioMesAnterior = startOfMonth(subMonths(agora, 1))

  // Buscar todos os recursos ativos
  const recursos = await prisma.recurso.findMany({
    where: { ativo: true },
    include: { categoria: true },
    orderBy: { nome: "asc" },
  })

  // Buscar reservas do mês atual
  const reservasMes = await prisma.reserva.findMany({
    where: {
      data: { gte: inicioMesAnterior, lte: fimMes },
      status: { not: "CANCELADA" },
    },
    include: {
      recurso: { select: { nome: true, cor: true, quantidadeTotal: true } },
      horarios: { select: { horarioId: true } },
    },
  })

  // Calcular uso por recurso (últimos 30 dias)
  const usoPorRecurso = recursos.map((recurso) => {
    const reservasDoRecurso = reservasMes.filter(
      (r) => r.recursoId === recurso.id
    )
    const totalHorarios = reservasDoRecurso.reduce(
      (sum, r) => sum + r.horarios.length,
      0
    )
    // Capacidade teórica: 12 horários/dia × 22 dias úteis × quantidade
    const capacidade = 12 * 22 * recurso.quantidadeTotal
    const percentual = capacidade > 0 ? Math.round((totalHorarios / capacidade) * 100) : 0

    return {
      nome: recurso.nome,
      cor: recurso.cor,
      totalReservas: reservasDoRecurso.length,
      totalHorarios,
      percentualOcupacao: Math.min(percentual, 100),
    }
  })

  // Calcular heatmap para cada recurso
  const diasDoMes = eachDayOfInterval({ start: inicioMes, end: fimMes })
  const totalHorariosDia = 12 // 6 manhã + 6 tarde

  const heatmaps = recursos
    .filter((r) => r.quantidadeTotal === 1) // Apenas espaços
    .map((recurso) => {
      const heatmapData = diasDoMes.map((dia) => {
        if (isWeekend(dia)) {
          return {
            dia: dia.getDate(),
            mes: dia.getMonth() + 1,
            ano: dia.getFullYear(),
            ocupacao: -1,
            total: 0,
            label: format(dia, "dd/MM", { locale: ptBR }),
          }
        }

        const reservasDoDia = reservasMes.filter(
          (r) =>
            r.recursoId === recurso.id &&
            new Date(r.data).toDateString() === dia.toDateString()
        )
        const horariosOcupados = reservasDoDia.reduce(
          (sum, r) => sum + r.horarios.length,
          0
        )
        const ocupacao = Math.round(
          (horariosOcupados / totalHorariosDia) * 100
        )

        return {
          dia: dia.getDate(),
          mes: dia.getMonth() + 1,
          ano: dia.getFullYear(),
          ocupacao: Math.min(ocupacao, 100),
          total: reservasDoDia.length,
          label: format(dia, "dd/MM", { locale: ptBR }),
        }
      })

      return {
        nome: recurso.nome,
        data: heatmapData,
      }
    })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Relatórios</h2>
        <p className="text-sm text-slate-500">
          Analytics de ocupação —{" "}
          {format(agora, "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-800">
            {reservasMes.filter((r) => new Date(r.data) >= inicioMes).length}
          </p>
          <p className="text-xs text-slate-500">Reservas este mês</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-blue-600">
            {recursos.length}
          </p>
          <p className="text-xs text-slate-500">Recursos cadastrados</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-emerald-600">
            {usoPorRecurso.reduce((sum, r) => sum + r.totalReservas, 0)}
          </p>
          <p className="text-xs text-slate-500">Total de reservas (30d)</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-amber-600">
            {Math.round(
              usoPorRecurso.reduce((sum, r) => sum + r.percentualOcupacao, 0) /
                Math.max(usoPorRecurso.length, 1)
            )}
            %
          </p>
          <p className="text-xs text-slate-500">Ocupação média</p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="mb-6">
        <UsageBarChart data={usoPorRecurso} />
      </div>

      {/* Heatmaps por espaço */}
      {heatmaps.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Heatmap de Ocupação (Heijunka)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heatmaps.map((hm) => (
              <OccupancyHeatmap
                key={hm.nome}
                data={hm.data}
                recursoNome={hm.nome}
                mes={agora.getMonth() + 1}
                ano={agora.getFullYear()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
