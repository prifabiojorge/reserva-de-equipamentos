"use client"

import { useState, useEffect, useCallback } from "react"

interface Horario {
  id: string
  numero: number
  horaInicio: string
  horaFim: string
}

interface Turno {
  id: string
  nome: string
  ordem: number
  horarios: Horario[]
}

export default function ConfiguracoesPage() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<string | null>(null)
  const [novoHorario, setNovoHorario] = useState<{
    turnoId: string
    numero: number
    horaInicio: string
    horaFim: string
  } | null>(null)
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro"
    texto: string
  } | null>(null)

  const carregarTurnos = useCallback(async () => {
    try {
      const res = await fetch("/api/horarios")
      if (res.ok) {
        const data = await res.json()
        setTurnos(data)
      }
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao carregar horários" })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarTurnos()
  }, [carregarTurnos])

  function mostrarMensagem(tipo: "sucesso" | "erro", texto: string) {
    setMensagem({ tipo, texto })
    setTimeout(() => setMensagem(null), 3000)
  }

  async function salvarHorario(horario: Horario) {
    try {
      const res = await fetch(`/api/horarios/${horario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: horario.numero,
          horaInicio: horario.horaInicio,
          horaFim: horario.horaFim,
        }),
      })
      if (res.ok) {
        mostrarMensagem("sucesso", "Horário atualizado!")
        setEditando(null)
        carregarTurnos()
      } else {
        const data = await res.json()
        mostrarMensagem("erro", data.error || "Erro ao salvar")
      }
    } catch {
      mostrarMensagem("erro", "Erro ao salvar horário")
    }
  }

  async function removerHorario(id: string) {
    if (!confirm("Tem certeza que deseja remover este horário?")) return
    try {
      const res = await fetch(`/api/horarios/${id}`, { method: "DELETE" })
      if (res.ok) {
        mostrarMensagem("sucesso", "Horário removido!")
        carregarTurnos()
      } else {
        const data = await res.json()
        mostrarMensagem("erro", data.error || "Erro ao remover")
      }
    } catch {
      mostrarMensagem("erro", "Erro ao remover horário")
    }
  }

  async function adicionarHorario() {
    if (!novoHorario) return
    try {
      const res = await fetch("/api/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoHorario),
      })
      if (res.ok) {
        mostrarMensagem("sucesso", "Horário adicionado!")
        setNovoHorario(null)
        carregarTurnos()
      } else {
        const data = await res.json()
        mostrarMensagem("erro", data.error || "Erro ao adicionar")
      }
    } catch {
      mostrarMensagem("erro", "Erro ao adicionar horário")
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-40 bg-slate-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Configurações</h2>
        <p className="text-sm text-slate-500">
          Gerenciar turnos e horários de aula — Escola Estadual Celso Rodrigues
        </p>
      </div>

      {/* Mensagem de feedback */}
      {mensagem && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm animate-fade-in ${
            mensagem.tipo === "sucesso"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {mensagem.tipo === "sucesso" ? "✅" : "❌"} {mensagem.texto}
        </div>
      )}

      <div className="space-y-6">
        {turnos.map((turno) => {
          const isManha = turno.nome === "Manhã"
          const intervaloLabel = isManha
            ? "09:00 - 09:20"
            : "14:45 - 15:00"
          const intervaloAfterIdx = isManha ? 1 : 1 // Após aula 2 (manhã) ou aula 7 (tarde)

          return (
            <div
              key={turno.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              {/* Header do turno */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {isManha ? "☀️" : "🌙"} {turno.nome}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {turno.horarios.length} aulas
                  </p>
                </div>
                <button
                  onClick={() =>
                    setNovoHorario({
                      turnoId: turno.id,
                      numero:
                        turno.horarios.length > 0
                          ? Math.max(...turno.horarios.map((h) => h.numero)) + 1
                          : 1,
                      horaInicio: "",
                      horaFim: "",
                    })
                  }
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  + Adicionar horário
                </button>
              </div>

              {/* Tabela de horários */}
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="text-left px-5 py-2 text-xs font-medium text-slate-500">
                      Aula
                    </th>
                    <th className="text-left px-5 py-2 text-xs font-medium text-slate-500">
                      Início
                    </th>
                    <th className="text-left px-5 py-2 text-xs font-medium text-slate-500">
                      Fim
                    </th>
                    <th className="text-left px-5 py-2 text-xs font-medium text-slate-500">
                      Duração
                    </th>
                    <th className="text-right px-5 py-2 text-xs font-medium text-slate-500">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {turno.horarios.map((horario, idx) => {
                    const [h1, m1] = horario.horaInicio.split(":").map(Number)
                    const [h2, m2] = horario.horaFim.split(":").map(Number)
                    const duracao = h2 * 60 + m2 - (h1 * 60 + m1)
                    const isEditing = editando === horario.id
                    const showIntervaloAfter = idx === intervaloAfterIdx

                    return (
                      <tr key={horario.id}>
                        {isEditing ? (
                          <EditarLinha
                            horario={horario}
                            onSave={salvarHorario}
                            onCancel={() => setEditando(null)}
                          />
                        ) : (
                          <>
                            <td className="px-5 py-3 font-medium text-slate-700">
                              AULA {horario.numero}
                            </td>
                            <td className="px-5 py-3 text-slate-600">
                              {horario.horaInicio}
                            </td>
                            <td className="px-5 py-3 text-slate-600">
                              {horario.horaFim}
                            </td>
                            <td className="px-5 py-3 text-slate-500">
                              {duracao} min
                            </td>
                            <td className="px-5 py-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => setEditando(horario.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 mr-3 font-medium"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => removerHorario(horario.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium"
                              >
                                Remover
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                  {/* Linha de intervalo */}
                  <tr className="bg-amber-50">
                    <td
                      colSpan={5}
                      className="px-5 py-2 text-xs text-amber-700"
                    >
                      ☕ INTERVALO {intervaloLabel}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Formulário de novo horário */}
              {novoHorario && novoHorario.turnoId === turno.id && (
                <div className="px-5 py-4 bg-blue-50 border-t border-blue-200">
                  <div className="flex items-end gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Nº da aula
                      </label>
                      <input
                        type="number"
                        value={novoHorario.numero}
                        onChange={(e) =>
                          setNovoHorario({
                            ...novoHorario,
                            numero: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Início
                      </label>
                      <input
                        type="time"
                        value={novoHorario.horaInicio}
                        onChange={(e) =>
                          setNovoHorario({
                            ...novoHorario,
                            horaInicio: e.target.value,
                          })
                        }
                        className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Fim
                      </label>
                      <input
                        type="time"
                        value={novoHorario.horaFim}
                        onChange={(e) =>
                          setNovoHorario({
                            ...novoHorario,
                            horaFim: e.target.value,
                          })
                        }
                        className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <button
                      onClick={adicionarHorario}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setNovoHorario(null)}
                      className="px-4 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente inline para edição de uma linha
function EditarLinha({
  horario,
  onSave,
  onCancel,
}: {
  horario: Horario
  onSave: (h: Horario) => void
  onCancel: () => void
}) {
  const [numero, setNumero] = useState(horario.numero)
  const [horaInicio, setHoraInicio] = useState(horario.horaInicio)
  const [horaFim, setHoraFim] = useState(horario.horaFim)

  return (
    <>
      <td className="px-5 py-3">
        <input
          type="number"
          value={numero}
          onChange={(e) => setNumero(parseInt(e.target.value) || 0)}
          className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
        />
      </td>
      <td className="px-5 py-3">
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          className="px-2 py-1 border border-blue-300 rounded text-sm"
        />
      </td>
      <td className="px-5 py-3">
        <input
          type="time"
          value={horaFim}
          onChange={(e) => setHoraFim(e.target.value)}
          className="px-2 py-1 border border-blue-300 rounded text-sm"
        />
      </td>
      <td className="px-5 py-3 text-slate-500 text-sm">—</td>
      <td className="px-5 py-3 text-right whitespace-nowrap">
        <button
          onClick={() =>
            onSave({ ...horario, numero, horaInicio, horaFim })
          }
          className="text-xs text-emerald-600 hover:text-emerald-800 mr-3 font-medium"
        >
          ✓ Salvar
        </button>
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          ✕ Cancelar
        </button>
      </td>
    </>
  )
}
