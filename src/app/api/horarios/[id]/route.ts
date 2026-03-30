import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const horario = await prisma.horario.update({
    where: { id },
    data: {
      numero: body.numero,
      horaInicio: body.horaInicio,
      horaFim: body.horaFim,
    },
  })

  return NextResponse.json(horario)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.papel !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  const { id } = await params

  // Verificar se há reservas usando este horário
  const reservas = await prisma.reservaHorario.count({
    where: { horarioId: id },
  })

  if (reservas > 0) {
    return NextResponse.json(
      { error: "Não é possível remover: existem reservas neste horário" },
      { status: 409 }
    )
  }

  await prisma.horario.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
