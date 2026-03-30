import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { checkConflicts } from "@/actions/conflitos"
import { registrarLog } from "@/actions/auditoria"
import { reservaSchema } from "@/lib/validators"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const formData = await request.formData()
    const dados = reservaSchema.parse({
      recursoId: formData.get("recursoId"),
      data: formData.get("data"),
      horarioIds: formData.getAll("horarioIds"),
      quantidadeUsada: formData.get("quantidadeUsada") || 1,
      observacao: formData.get("observacao") || undefined,
    })

    // Verificar conflitos antes de criar
    const conflict = await checkConflicts({
      recursoId: dados.recursoId,
      data: new Date(dados.data + "T12:00:00"),
      horarioIds: dados.horarioIds,
      quantidadeDesejada: dados.quantidadeUsada,
    })

    if (conflict.hasConflict) {
      return NextResponse.json(
        { error: "Conflito de horário detectado", conflicts: conflict.conflicts },
        { status: 409 }
      )
    }

    // Criar reserva com horários
    const reserva = await prisma.reserva.create({
      data: {
        data: new Date(dados.data + "T12:00:00"),
        usuarioId: session.user.id,
        recursoId: dados.recursoId,
        quantidadeUsada: dados.quantidadeUsada,
        observacao: dados.observacao,
        status: "CONFIRMADA",
        horarios: {
          create: dados.horarioIds.map((horarioId) => ({
            horarioId,
          })),
        },
      },
    })

    // Registrar log de auditoria
    await registrarLog({
      acao: "CRIAR",
      entidade: "Reserva",
      entidadeId: reserva.id,
      detalhes: JSON.stringify({
        recursoId: dados.recursoId,
        data: dados.data,
        horarios: dados.horarioIds.length,
        quantidade: dados.quantidadeUsada,
      }),
    })

    return NextResponse.json({ id: reserva.id }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar reserva:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const reservas = await prisma.reserva.findMany({
      where: { status: { not: "CANCELADA" } },
      include: {
        usuario: { select: { nome: true } },
        recurso: { select: { nome: true, cor: true } },
        horarios: {
          include: {
            horario: { include: { turno: true } },
          },
        },
      },
      orderBy: { data: "desc" },
      take: 50,
    })

    return NextResponse.json(reservas)
  } catch (error) {
    console.error("Erro ao buscar reservas:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
