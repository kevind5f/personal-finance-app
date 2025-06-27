import { defineEventHandler } from 'h3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    const clientes = dbData.clientes || []
    const cliente = clientes[0] || null
    if (!cliente) {
      return { error: 'Cliente no encontrado' }
    }
    return cliente
  } catch (error: any) {
    console.error('Error reading client data:', error)
    return { error: 'Error interno del servidor', details: error.message }
  }
}) 