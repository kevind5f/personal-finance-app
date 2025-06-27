import { defineEventHandler } from 'h3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const deudas = dbData.clientes[0]?.deudas || []
  return deudas
}) 