import { getRecursos } from "@/actions/recursos"
import { getTurnosComHorarios } from "@/actions/horarios"
import { NovaReservaForm } from "@/components/reserva/ReservaForm"

export default async function NovaReservaPage() {
  const [recursos, turnos] = await Promise.all([
    getRecursos(),
    getTurnosComHorarios(),
  ])

  const recursosFormatted = recursos.map((r) => ({
    id: r.id,
    nome: r.nome,
    quantidadeTotal: r.quantidadeTotal,
    cor: r.cor,
    categoria: { nome: r.categoria.nome },
  }))

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <a
          href="/reservas"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Voltar para reservas
        </a>
        <h2 className="text-2xl font-bold text-slate-800 mt-2">
          Nova Reserva
        </h2>
        <p className="text-sm text-slate-500">
          Preencha os dados abaixo. O sistema detectará automaticamente
          conflitos de horário.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <NovaReservaForm recursos={recursosFormatted} turnos={turnos} />
      </div>
    </div>
  )
}
