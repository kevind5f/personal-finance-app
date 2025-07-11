import fs from 'fs'
import path from 'path'
import { readBody } from 'h3'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event)
      const { email, password } = body
      console.log('Login intento:', email, password)
      
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      console.log('Clientes:', dbData.clientes)
      
      const cliente = dbData.clientes.find(
        (c: any) => c.email === email && c.password === password
      )
      
      if (cliente) {
        return { success: true, cliente }
      } else {
        return { success: false, message: 'Credenciales incorrectas' }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, message: 'Error interno del servidor' }
    }
  } else {
    event.node.res.statusCode = 405
    return { error: `Method ${event.node.req.method} Not Allowed` }
  }
}) 