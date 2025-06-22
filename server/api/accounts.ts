import { defineEventHandler, getQuery, readBody } from 'h3'
import { db } from '../database/db'

// Función para mapear cuenta de español a inglés
const mapCuentaToAccount = (cuenta: any) => ({
  _id: cuenta._id,
  name: cuenta.nombre,
  type: cuenta.tipo,
  balance: cuenta.saldo
})

// Función para mapear cuenta de inglés a español
const mapAccountToCuenta = (account: any) => ({
  nombre: account.name,
  tipo: account.type,
  saldo: account.balance
})

export default defineEventHandler(async (event) => {
  const metodo = event.method

  if (metodo === 'GET') {
    const cuentas = db.getCuentas()
    return cuentas.map(mapCuentaToAccount)
  }

  if (metodo === 'POST') {
    const cuerpo = await readBody(event)
    const cuentaData = mapAccountToCuenta(cuerpo)
    const nuevaCuenta = db.createCuenta(cuentaData)
    return mapCuentaToAccount(nuevaCuenta)
  }

  if (metodo === 'PUT') {
    const cuerpo = await readBody(event)
    const cuentaData = mapAccountToCuenta(cuerpo)
    const cuentaActualizada = db.updateCuenta(cuerpo._id, cuentaData)
    if (!cuentaActualizada) {
      return { error: 'Cuenta no encontrada' }
    }
    return mapCuentaToAccount(cuentaActualizada)
  }

  if (metodo === 'DELETE') {
    const consulta = getQuery(event)
    const id = consulta.id as string
    const eliminada = db.deleteCuenta(id)
    if (!eliminada) {
      return { error: 'Cuenta no encontrada' }
    }
    return { mensaje: 'Cuenta eliminada exitosamente' }
  }
}) 