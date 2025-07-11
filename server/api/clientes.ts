import { defineEventHandler, readBody } from 'h3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const method = event.node.req.method || event.method
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const clientes = dbData.clientes || []
  const cliente = clientes[0] || null

  if (method === 'GET') {
    if (!cliente) {
      return { error: 'Cliente no encontrado' }
    }
    return cliente
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    // Solo permitimos actualizar la moneda principal por ahora
    if (body && body.moneda_principal) {
      dbData.clientes[0].configuraciones.moneda_principal = body.moneda_principal
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8')
      return { success: true, moneda_principal: body.moneda_principal }
    } else {
      return { error: 'Falta el campo moneda_principal' }
    }
  }

  return { error: 'Método no soportado' }
}) 