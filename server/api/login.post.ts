import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
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
  } else {
    event.node.res.statusCode = 405
    return { error: `Method ${event.node.req.method} Not Allowed` }
  }
}) 