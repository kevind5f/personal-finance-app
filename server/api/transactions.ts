import { defineEventHandler, getQuery, readBody } from 'h3'
import { db } from '../database/db'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

// Función para mapear transacción de español a inglés
const mapTransaccionToTransaction = (transaccion: any) => ({
  _id: transaccion._id,
  description: transaccion.descripcion,
  amount: transaccion.monto,
  type: transaccion.tipo === 'ingreso' ? 'income' : 'expense',
  category: transaccion.categoria,
  date: transaccion.fecha,
  accountId: transaccion.cuentaId
})

// Función para mapear transacción de inglés a español (para POST/PUT)
const mapTransactionToTransaccion = (transaction: any) => ({
  descripcion: transaction.description,
  monto: transaction.amount,
  tipo: (transaction.type === 'income' ? 'ingreso' : 'gasto') as 'ingreso' | 'gasto',
  categoria: transaction.category,
  fecha: transaction.date,
  cuentaId: transaction.accountId
})

export default defineEventHandler(async (event) => {
  const metodo = event.method

  if (metodo === 'GET') {
    const consulta = getQuery(event)
    const accountId = consulta.accountId as string
    const limit = consulta.limit ? parseInt(consulta.limit as string) : undefined

    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    const cliente = dbData.clientes[0]
    const ingresos = cliente.ingresos || []
    const gastos = cliente.gastos || []
    // Unir ingresos y gastos como transacciones
    let transacciones = [
      ...ingresos.map((i: any) => ({
        _id: i._id,
        descripcion: i.descripcion || i.titulo,
        monto: i.monto,
        tipo: 'ingreso',
        categoria: i.categoria,
        fecha: i.fecha,
        cuentaId: i.cuentaId
      })),
      ...gastos.map((g: any) => ({
        _id: g._id,
        descripcion: g.descripcion || g.titulo,
        monto: g.monto,
        tipo: 'gasto',
        categoria: g.categoria,
        fecha: g.fecha,
        cuentaId: g.cuentaId
      }))
    ]
    // Filtrar por cuenta si se especifica
    if (accountId) {
      transacciones = transacciones.filter((t) => t.cuentaId === accountId)
    }
    // Ordenar por fecha descendente
    transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    // Limitar resultados si se especifica
    if (limit) {
      transacciones = transacciones.slice(0, limit)
    }
    // Aplicar mapeo a todas las transacciones retornadas
    return transacciones.map(mapTransaccionToTransaction)
  }

  if (metodo === 'POST') {
    const cuerpo = await readBody(event)
    const transaccionData = mapTransactionToTransaccion(cuerpo)
    // Leer y modificar el archivo db.json directamente
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    const cliente = dbData.clientes[0]
    if (transaccionData.tipo === 'ingreso') {
      if (!cliente.ingresos) cliente.ingresos = []
      const nuevoIngreso = {
        _id: String(cliente.ingresos.length + 1),
        titulo: cuerpo.title || cuerpo.description || '',
        descripcion: cuerpo.description || '',
        monto: transaccionData.monto,
        categoria: transaccionData.categoria,
        fecha: transaccionData.fecha,
        cuentaId: transaccionData.cuentaId
      }
      cliente.ingresos.push(nuevoIngreso)
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      return mapTransaccionToTransaction({ ...nuevoIngreso, tipo: 'ingreso' })
    } else {
      if (!cliente.gastos) cliente.gastos = []
      const nuevoGasto = {
        _id: String(cliente.gastos.length + 1),
        titulo: cuerpo.title || cuerpo.description || '',
        descripcion: cuerpo.description || '',
        monto: transaccionData.monto,
        categoria: transaccionData.categoria,
        fecha: transaccionData.fecha,
        cuentaId: transaccionData.cuentaId
      }
      cliente.gastos.push(nuevoGasto)
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      return mapTransaccionToTransaction({ ...nuevoGasto, tipo: 'gasto' })
    }
  }

  if (metodo === 'PUT') {
    const cuerpo = await readBody(event)
    const transaccionData = mapTransactionToTransaccion(cuerpo)
    const transaccionActualizada = db.updateTransaccion(cuerpo._id, transaccionData)
    if (!transaccionActualizada) {
      return { error: 'Transacción no encontrada' }
    }
    return mapTransaccionToTransaction(transaccionActualizada)
  }

  if (metodo === 'DELETE') {
    const consulta = getQuery(event)
    const id = consulta.id as string
    const accountId = consulta.accountId as string
    
    // Si se especifica accountId, eliminar todas las transacciones de esa cuenta
    if (accountId) {
      const transacciones = db.getTransacciones()
      const transaccionesAEliminar = transacciones.filter(t => t.cuentaId === accountId)
      
      let eliminadas = 0
      for (const transaccion of transaccionesAEliminar) {
        if (db.deleteTransaccion(transaccion._id)) {
          eliminadas++
        }
      }
      
      return { 
        mensaje: `${eliminadas} transacciones eliminadas exitosamente de la cuenta`,
        eliminadas: eliminadas
      }
    }
    
    // Si se especifica id, eliminar una transacción específica
    if (id) {
      const eliminada = db.deleteTransaccion(id)
      if (!eliminada) {
        return { error: 'Transacción no encontrada' }
      }
      return { mensaje: 'Transacción eliminada exitosamente' }
    }
    
    return { error: 'Se requiere id o accountId' }
  }
}) 