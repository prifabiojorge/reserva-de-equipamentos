"use client"

import type { ConflictResult } from "@/types"

interface ConflictAlertProps {
  conflictResult: ConflictResult | null
}

export function ConflictAlert({ conflictResult }: ConflictAlertProps) {
  if (!conflictResult || !conflictResult.hasConflict) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">⚡</span>
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 text-sm">
            Conflito detectado!
          </h4>
          <p className="text-xs text-red-600 mt-1">
            O recurso já está parcialmente ou totalmente reservado nos horários
            selecionados.
          </p>
          <div className="mt-3 space-y-2">
            {conflictResult.conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-red-200 px-3 py-2 text-xs"
              >
                <p className="font-medium text-red-700">
                  {conflict.horarioLabel}
                </p>
                <p className="text-red-600 mt-0.5">
                  Reservado por: <strong>{conflict.professorNome}</strong>
                </p>
                <p className="text-red-500">
                  Já reservado: {conflict.quantidadeJaReservada} de{" "}
                  {conflictResult.recursoCapacidadeTotal} unidades
                </p>
                <p className="text-red-500">
                  Disponível: {conflict.quantidadeDisponivel} unidades
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
