# 🏫 Reservas — Escola Estadual Celso Rodrigues

Sistema de reserva de equipamentos e espaços — transforma o processo caótico de WhatsApp em um quadro Kanban digital com detecção automática de conflitos (Poka-Yoke).

> Desenvolvido por prof. Fábio Fabuloso — CISEB Celso Rodrigues/Santo Antônio do Tauá (PA) — 2026

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

# Rodar em desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Credenciais de teste

| Email | Senha | Papel |
|-------|-------|-------|
| admin@ciseb.edu.br | ciseb2026 | ADMIN |
| ciseb@ciseb.edu.br | ciseb2026 | COORDENADOR |
| eliana@ciseb.edu.br | ciseb2026 | PROFESSOR |
| luiz@ciseb.edu.br | ciseb2026 | PROFESSOR |
| marilia@ciseb.edu.br | ciseb2026 | PROFESSOR |
| vanessa@ciseb.edu.br | ciseb2026 | PROFESSOR |
| jhonatan@ciseb.edu.br | ciseb2026 | PROFESSOR |

## 📁 Estrutura do Projeto

```
├── prisma/
│   ├── schema.prisma          # 7 models (Usuario, Recurso, Reserva, etc.)
│   ├── seed.ts                # Dados iniciais (recursos, turnos, usuários)
│   └── migrations/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── icons/
├── src/
│   ├── actions/               # Server Actions
│   │   ├── conflitos.ts       # Motor de detecção de conflitos (Poka-Yoke)
│   │   ├── reservas.ts        # CRUD de reservas
│   │   ├── recursos.ts        # CRUD de recursos
│   │   ├── horarios.ts        # CRUD de horários/turnos
│   │   └── auditoria.ts       # Log de auditoria
│   ├── app/
│   │   ├── (auth)/login/      # Página de login
│   │   ├── (dashboard)/
│   │   │   ├── reservas/      # Quadro Kanban semanal + nova reserva
│   │   │   ├── recursos/      # Lista de equipamentos/espaços
│   │   │   ├── calendario/    # Visão mensal
│   │   │   ├── relatorios/    # Heatmap Heijunka + gráficos
│   │   │   ├── auditoria/     # Log de ações (ADMIN)
│   │   │   └── configuracoes/ # Turnos e horários (ADMIN)
│   │   └── api/
│   │       ├── auth/          # NextAuth API
│   │       └── reservas/      # API REST de reservas
│   ├── components/
│   │   ├── charts/            # Heatmap e gráficos de ocupação
│   │   ├── reserva/           # KanbanBoard, KanbanCard, ConflictAlert
│   │   └── ServiceWorkerRegister.tsx
│   ├── lib/
│   │   ├── auth.ts            # NextAuth.js v5 config
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── validators.ts      # Schemas Zod
│   │   └── constants.ts       # Turnos, horários, dias
│   ├── types/
│   └── middleware.ts          # Auth middleware
├── scripts/
│   └── backup-db.ts           # Backup automático do SQLite
├── PILARES-CISEB.md           # Documentação dos 8 pilares
└── .env                       # DATABASE_URL, NEXTAUTH_SECRET
```

## 🛠️ Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Linting
npm run db:generate  # Gerar Prisma Client
npm run db:push      # Sincronizar schema com banco
npm run db:seed      # Popular banco com dados iniciais
npm run db:backup    # Backup do SQLite
```

## 🏗️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript + Tailwind CSS 4 |
| Backend | Next.js Server Actions + API Routes |
| ORM | Prisma ORM |
| Database | SQLite (arquivo local) |
| Auth | NextAuth.js v5 (credenciais) |
| Validação | Zod + react-hook-form |
| PWA | Service Worker manual |

## 🎯 Princípios Lean aplicados

- **Poka-Yoke**: Detecção automática de conflitos impossibilita reservas duplicadas
- **Kanban**: Quadro semanal visual como dashboard principal
- **Heijunka**: Heatmap de ocupação mostra nivelamento de carga
- **5S**: Estrutura modular de pastas e código organizado
- **Jidoka**: Notificação instantânea de conflitos em tempo real
- **Just-in-Time**: Professor vê apenas o que precisa, quando precisa
- **Kaizen**: Relatórios de uso para melhoria contínua

## 📄 Licença

Projeto interno da Escola Estadual Celso Rodrigues.
