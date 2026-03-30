import Link from "next/link"
import { redirect } from "next/navigation"
import { auth, signOut } from "@/lib/auth"

const navItems = [
  { href: "/reservas", label: "Reservas", icone: "📋" },
  { href: "/recursos", label: "Recursos", icone: "💻" },
  { href: "/calendario", label: "Calendário", icone: "📅" },
  { href: "/relatorios", label: "Relatórios", icone: "📊" },
  { href: "/auditoria", label: "Auditoria", icone: "📝" },
  { href: "/configuracoes", label: "Configurações", icone: "⚙️" },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session.user.papel === "ADMIN"
  const isCoord = session.user.papel === "COORDENADOR"

  const filteredNav = navItems.filter((item) => {
    if (item.href === "/configuracoes" && !isAdmin) return false
    if (item.href === "/auditoria" && !isAdmin) return false
    if (item.href === "/relatorios" && !isAdmin && !isCoord) return false
    return true
  })

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <div>
              <h1 className="text-base font-bold">Celso Rodrigues</h1>
              <p className="text-xs text-slate-400">Reservas</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {filteredNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span className="text-lg">{item.icone}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{session.user?.name}</p>
              <p className="text-xs text-slate-400">{session.user?.papel}</p>
            </div>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <button
                type="submit"
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                title="Sair"
              >
                ✕
              </button>
            </form>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            prof. Fábio Fabuloso — CISEB Celso Rodrigues/Santo Antônio do Tauá (PA) — 2026
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
    </div>
  )
}
