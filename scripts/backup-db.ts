import * as fs from "fs"
import * as path from "path"

const DB_PATH = path.join(__dirname, "..", "prisma", "dev.db")
const BACKUP_DIR = path.join(__dirname, "..", "backups")

async function backup() {
  // Criar diretório de backup se não existir
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }

  // Verificar se o banco existe
  if (!fs.existsSync(DB_PATH)) {
    console.error("❌ Banco de dados não encontrado:", DB_PATH)
    process.exit(1)
  }

  // Nome do backup com timestamp
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19)
  const backupName = `dev-backup-${timestamp}.db`
  const backupPath = path.join(BACKUP_DIR, backupName)

  // Copiar arquivo
  fs.copyFileSync(DB_PATH, backupPath)

  const stats = fs.statSync(backupPath)
  const sizeKB = (stats.size / 1024).toFixed(1)

  console.log(`✅ Backup criado: ${backupName} (${sizeKB} KB)`)
  console.log(`📁 ${backupPath}`)

  // Manter apenas os 10 backups mais recentes
  const backups = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("dev-backup-") && f.endsWith(".db"))
    .sort()
    .reverse()

  if (backups.length > 10) {
    for (const old of backups.slice(10)) {
      fs.unlinkSync(path.join(BACKUP_DIR, old))
      console.log(`🗑️  Backup antigo removido: ${old}`)
    }
  }
}

backup().catch(console.error)
