import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const turnos = await prisma.turno.findMany({
    include: {
      horarios: { orderBy: { numero: "asc" } },
    },
    orderBy: { ordem: "asc" },
  })

  return NextResponse.json(turnos)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  const body = await request.json()
  const { turnoId, numero, horaInicio, horaFim } = body

  if (!turnoId || !numero || !horaInicio || !horaFim) {
    return NextResponse.json(
      { error: "Campos obrigatórios: turnoId, numero, horaInicio, horaFim" },
      { status: 400 }
    )
  }

  const horario = await prisma.horario.create({
    data: { turnoId, numero, horaInicio, horaFim },
  })

  return NextResponse.json(horario, { status: 201 })
}
