import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes (ordem importa por causa das FKs)
  await prisma.reservaHorario.deleteMany()
  await prisma.reserva.deleteMany()
  await prisma.horario.deleteMany()
  await prisma.turno.deleteMany()
  await prisma.recurso.deleteMany()
  await prisma.categoriaRecurso.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.logAuditoria.deleteMany()

  // ===== CATEGORIAS =====
  const catEspaco = await prisma.categoriaRecurso.create({
    data: { nome: "Espaço", icone: "🏫" },
  })
  const catEquipamento = await prisma.categoriaRecurso.create({
    data: { nome: "Equipamento", icone: "💻" },
  })

  // ===== RECURSOS =====
  await prisma.recurso.createMany({
    data: [
      {
        nome: "Laboratório de Informática",
        categoriaId: catEspaco.id,
        quantidadeTotal: 1,
        cor: "#3B82F6",
      },
      {
        nome: "Auditório",
        categoriaId: catEspaco.id,
        quantidadeTotal: 1,
        cor: "#8B5CF6",
      },
      {
        nome: "Sala de Leitura",
        categoriaId: catEspaco.id,
        quantidadeTotal: 1,
        cor: "#06B6D4",
      },
      {
        nome: "Chromebooks",
        categoriaId: catEquipamento.id,
        quantidadeTotal: 30,
        quantidadeMinima: 1,
        cor: "#10B981",
      },
      {
        nome: "Data Show Epson",
        categoriaId: catEquipamento.id,
        quantidadeTotal: 2,
        cor: "#F59E0B",
      },
      {
        nome: "TV",
        categoriaId: catEquipamento.id,
        quantidadeTotal: 1,
        cor: "#EF4444",
      },
    ],
  })

  // ===== TURNOS + HORÁRIOS (HORÁRIOS REAIS DO CISEB) =====
  //
  //  Manhã: Aulas 1-5 | INTERVALO 09:00-09:20
  //  Almoço: 11:45-13:15 (não é horário de aula)
  //  Tarde: Aulas 6-9 | INTERVALO 14:45-15:00
  //
  const manha = await prisma.turno.create({ data: { nome: "Manhã", ordem: 1 } })
  const tarde = await prisma.turno.create({ data: { nome: "Tarde", ordem: 2 } })

  const horariosManha = [
    { numero: 1, horaInicio: "07:20", horaFim: "08:10" },
    { numero: 2, horaInicio: "08:10", horaFim: "09:00" },
    // INTERVALO 09:00 - 09:20
    { numero: 3, horaInicio: "09:20", horaFim: "10:10" },
    { numero: 4, horaInicio: "10:10", horaFim: "11:00" },
    { numero: 5, horaInicio: "11:00", horaFim: "11:45" },
  ]

  const horariosTarde = [
    { numero: 6, horaInicio: "13:15", horaFim: "14:00" },
    { numero: 7, horaInicio: "14:00", horaFim: "14:45" },
    // INTERVALO 14:45 - 15:00
    { numero: 8, horaInicio: "15:00", horaFim: "15:45" },
    { numero: 9, horaInicio: "15:45", horaFim: "16:30" },
  ]

  for (const h of horariosManha) {
    await prisma.horario.create({ data: { ...h, turnoId: manha.id } })
  }
  for (const h of horariosTarde) {
    await prisma.horario.create({ data: { ...h, turnoId: tarde.id } })
  }

  // ===== USUÁRIOS INICIAIS =====
  const senhaHash = await bcrypt.hash("ciseb2026", 10)

  await prisma.usuario.createMany({
    data: [
      {
        nome: "Administrador",
        email: "admin@ciseb.edu.br",
        senha: senhaHash,
        papel: "ADMIN",
      },
      {
        nome: "Eliana",
        email: "eliana@ciseb.edu.br",
        senha: senhaHash,
        papel: "PROFESSOR",
      },
      {
        nome: "Luiz",
        email: "luiz@ciseb.edu.br",
        senha: senhaHash,
        papel: "PROFESSOR",
      },
      {
        nome: "Marília Barros",
        email: "marilia@ciseb.edu.br",
        senha: senhaHash,
        papel: "PROFESSOR",
      },
      {
        nome: "Vanessa",
        email: "vanessa@ciseb.edu.br",
        senha: senhaHash,
        papel: "PROFESSOR",
      },
      {
        nome: "Jhonatan",
        email: "jhonatan@ciseb.edu.br",
        senha: senhaHash,
        papel: "PROFESSOR",
      },
      {
        nome: "CISEB",
        email: "ciseb@ciseb.edu.br",
        senha: senhaHash,
        papel: "COORDENADOR",
      },
    ],
  })

  console.log("✅ Seed executado com sucesso!")
  console.log("   - 2 categorias (Espaço, Equipamento)")
  console.log("   - 6 recursos (Lab, Auditório, Sala, Chromebooks, Data Show, TV)")
  console.log("   - Manhã: Aulas 1-5 (07:20-11:45) + Intervalo 09:00-09:20")
  console.log("   - Tarde: Aulas 6-9 (13:15-16:30) + Intervalo 14:45-15:00")
  console.log("   - 7 usuários (1 admin, 1 coordenador, 5 professores)")
  console.log("   - Senha padrão para todos: ciseb2026")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
