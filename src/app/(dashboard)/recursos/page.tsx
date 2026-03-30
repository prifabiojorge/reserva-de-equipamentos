import { getRecursos, getCategorias } from "@/actions/recursos"
import { auth } from "@/lib/auth"

export default async function RecursosPage() {
  const session = await auth()
  const isAdmin = session?.user?.papel === "ADMIN"
  const recursos = await getRecursos()
  const categorias = await getCategorias()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Recursos</h2>
          <p className="text-sm text-slate-500">
            Equipamentos e espaços disponíveis para reserva
          </p>
        </div>
        {isAdmin && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            + Novo Recurso
          </button>
        )}
      </div>

      {/* Filtro por categoria */}
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-medium">
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-full text-xs font-medium hover:bg-slate-50"
          >
            {cat.icone} {cat.nome}
          </button>
        ))}
      </div>

      {/* Grid de recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recursos.map((recurso) => (
          <div
            key={recurso.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {recurso.cor && (
                  <span
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: recurso.cor }}
                  />
                )}
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {recurso.nome}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {recurso.categoria.nome}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {recurso.quantidadeTotal} un.
              </span>
            </div>
            {recurso.descricao && (
              <p className="text-sm text-slate-500 mt-3">
                {recurso.descricao}
              </p>
            )}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Min: {recurso.quantidadeMinima} un.
              </span>
              {isAdmin && (
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Editar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
