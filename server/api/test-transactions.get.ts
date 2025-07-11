import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    const transacciones = dbData.clientes[0]?.transacciones || []
    const cuentas = dbData.clientes[0]?.cuentas || []
    
    return {
      transacciones: transacciones,
      cuentas: cuentas,
      totalTransacciones: transacciones.length,
      totalCuentas: cuentas.length,
      transaccionesPorCuenta: cuentas.map((cuenta: any) => ({
        cuenta: cuenta,
        transacciones: transacciones.filter((t: any) => t.cuentaId === cuenta._id)
      }))
    }
  } catch (error) {
    console.error('Error en test-transactions:', error)
    return { error: 'Error interno del servidor' }
  }
}) 