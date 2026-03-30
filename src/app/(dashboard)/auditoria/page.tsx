import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getLogs } from "@/actions/auditoria"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function AuditoriaPage() {
  const session = await auth()
  if (session?.user?.papel !== "ADMIN") {
    redirect("/reservas")
  }

  const logs = await getLogs(200)

  const iconeAcao: Record<string, string> = {
    CRIAR: "➕",
    EDITAR: "✏️",
    CANCELAR: "❌",
  }

  const corAcao: Record<string, string> = {
    CRIAR: "bg-emerald-100 text-emerald-700",
    EDITAR: "bg-blue-100 text-blue-700",
    CANCELAR: "bg-red-100 text-red-700",
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Log de Auditoria
        </h2>
        <p className="text-sm text-slate-500">
          Registro de todas as ações do sistema — {logs.length} eventos
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-slate-700">
            Nenhum log registrado
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            As ações de criar, editar e cancelar reservas/recursos aparecerão
            aqui.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Data/Hora
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Usuário
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Ação
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Entidade
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Detalhes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {format(new Date(log.criadoEm), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <p className="font-medium">{log.usuario.nome}</p>
                    <p className="text-xs text-slate-400">
                      {log.usuario.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${corAcao[log.acao] || "bg-slate-100 text-slate-600"}`}
                    >
                      {iconeAcao[log.acao] || "•"} {log.acao}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {log.entidade}
                    <span className="text-xs text-slate-400 ml-1">
                      #{log.entidadeId.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">
                    {log.detalhes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
