import { defineEventHandler } from 'h3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const cuentas = dbData.clientes[0]?.cuentas || []
  // Mapear al formato esperado por el frontend
  return cuentas.map((cuenta: any) => ({
    _id: cuenta._id,
    name: cuenta.nombre,
    type: cuenta.tipo,
    balance: cuenta.saldo
  }))
}) 