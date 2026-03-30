import type { Metadata, Viewport } from "next"
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister"
import "./globals.css"

export const metadata: Metadata = {
  title: "Reservas — Escola Estadual Celso Rodrigues",
  description: "Sistema de reserva de equipamentos e espaços — Escola Estadual Celso Rodrigues. Desenvolvido por prof. Fábio Fabuloso — CISEB Celso Rodrigues/Santo Antônio do Tauá (PA) — 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reservas",
  },
}

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
