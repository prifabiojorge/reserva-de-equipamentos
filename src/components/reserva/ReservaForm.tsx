"use client"

import { useState, useTransition, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { checkConflicts } from "@/actions/conflitos"
import { ConflictAlert } from "@/components/reserva/ConflictAlert"
import type { ConflictResult } from "@/types"

interface Recurso {
  id: string
  nome: string
  quantidadeTotal: number
  cor: string | null
  categoria: { nome: string }
}

interface Turno {
  id: string
  nome: string
  ordem: number
  horarios: {
    id: string
    numero: number
    horaInicio: string
    horaFim: string
  }[]
}

interface NovaReservaFormProps {
  recursos: Recurso[]
  turnos: Turno[]
}

export function NovaReservaForm({ recursos, turnos }: NovaReservaFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [recursoId, setRecursoId] = useState("")
  const [data, setData] = useState("")
  const [horarioIds, setHorarioIds] = useState<string[]>([])
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState("")
  const [conflictResult, setConflictResult] = useState<ConflictResult | null>(
    null
  )
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(false)

  const recursoSelecionado = recursos.find((r) => r.id === recursoId)

  // Verificar conflitos quando recurso, data ou horários mudam
  const verificarConflitos = useCallback(async () => {
    if (!recursoId || !data || horarioIds.length === 0) {
      setConflictResult(null)
      return
    }

    const result = await checkConflicts({
      recursoId,
      data: new Date(data + "T12:00:00"),
      horarioIds,
      quantidadeDesejada: quantidade,
    })
    setConflictResult(result)
  }, [recursoId, data, horarioIds, quantidade])

  useEffect(() => {
    const timer = setTimeout(verificarConflitos, 300)
    return () => clearTimeout(timer)
  }, [verificarConflitos])

  function toggleHorario(horarioId: string) {
    setHorarioIds((prev) =>
      prev.includes(horarioId)
        ? prev.filter((id) => id !== horarioId)
        : [...prev, horarioId]
    )
  }

  function selecionarTodosHorarios(turnoId: string) {
    const turno = turnos.find((t) => t.id === turnoId)
    if (!turno) return

    const idsDoTurno = turno.horarios.map((h) => h.id)
    const todosSelecionados = idsDoTurno.every((id) =>
      horarioIds.includes(id)
    )

    if (todosSelecionados) {
      setHorarioIds((prev) => prev.filter((id) => !idsDoTurno.includes(id)))
    } else {
      setHorarioIds((prev) => [...new Set([...prev, ...idsDoTurno])])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setSucesso(false)

    if (conflictResult?.hasConflict) {
      setErro(
        "Não é possível criar reserva: há conflito de horário. Ajuste os horários ou a quantidade."
      )
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.set("recursoId", recursoId)
        formData.set("data", data)
        formData.set("quantidadeUsada", quantidade.toString())
        formData.set("observacao", observacao)
        horarioIds.forEach((id) => formData.append("horarioIds", id))

        const response = await fetch("/api/reservas", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Erro ao criar reserva")
        }

        setSucesso(true)
        setRecursoId("")
        setData("")
        setHorarioIds([])
        setQuantidade(1)
        setObservacao("")
        setConflictResult(null)

        router.refresh()
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro desconhecido")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recurso */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Recurso
        </label>
        <select
          value={recursoId}
          onChange={(e) => setRecursoId(e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Selecione um recurso...</option>
          {recursos.map((r) => (
            <option key={r.id} value={r.id}>
              {r.categoria.nome === "Espaço" ? "🏫" : "💻"} {r.nome} (
              {r.quantidadeTotal} un.)
            </option>
          ))}
        </select>
      </div>

      {/* Quantidade (apenas para equipamentos) */}
      {recursoSelecionado && recursoSelecionado.quantidadeTotal > 1 && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Quantidade (máx: {recursoSelecionado.quantidadeTotal})
          </label>
          <input
            type="number"
            min={1}
            max={recursoSelecionado.quantidadeTotal}
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Data */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Data
        </label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Horários por turno */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Horários
        </label>
        <div className="space-y-4">
          {turnos.map((turno) => (
            <div
              key={turno.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {turno.nome === "Manhã" ? "☀️" : "🌙"} {turno.nome}
                </span>
                <button
                  type="button"
                  onClick={() => selecionarTodosHorarios(turno.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Todos
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-slate-100">
                {turno.horarios.map((horario) => {
                  const selecionado = horarioIds.includes(horario.id)
                  return (
                    <button
                      key={horario.id}
                      type="button"
                      onClick={() => toggleHorario(horario.id)}
                      className={`px-3 py-3 text-sm text-left transition-colors ${
                        selecionado
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="font-medium">{horario.numero}º</span>
                      <span className="text-xs text-slate-500 ml-1">
                        {horario.horaInicio}-{horario.horaFim}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        {horarioIds.length > 0 && (
          <p className="text-xs text-slate-500 mt-2">
            {horarioIds.length} horário(s) selecionado(s)
          </p>
        )}
      </div>

      {/* Observação */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Observação (opcional)
        </label>
        <textarea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          rows={2}
          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Ex: Preciso de 8 Chromebooks para turma do 9º ano"
        />
      </div>

      {/* Alerta de conflito (Poka-Yoke) */}
      <ConflictAlert conflictResult={conflictResult} />

      {/* Mensagens */}
      {erro && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg animate-fade-in">
          ✅ Reserva criada com sucesso!
        </div>
      )}

      {/* Botão submit */}
      <button
        type="submit"
        disabled={isPending || conflictResult?.hasConflict}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Criando reserva..." : "Criar Reserva"}
      </button>
    </form>
  )
}
