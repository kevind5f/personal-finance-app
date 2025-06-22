import { defineEventHandler, getQuery, readBody } from 'h3'
import { db } from '../database/db'

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

// Función para mapear transacción de inglés a español
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
    
    let transacciones = db.getTransacciones()
    
    // Filtrar por cuenta si se especifica
    if (accountId) {
      transacciones = transacciones.filter(t => t.cuentaId === accountId)
    }
    
    // Ordenar por fecha (más recientes primero)
    transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    
    // Limitar resultados si se especifica
    if (limit) {
      transacciones = transacciones.slice(0, limit)
    }
    
    return transacciones.map(mapTransaccionToTransaction)
  }

  if (metodo === 'POST') {
    const cuerpo = await readBody(event)
    const transaccionData = mapTransactionToTransaccion(cuerpo)
    const nuevaTransaccion = db.createTransaccion(transaccionData)
    return mapTransaccionToTransaction(nuevaTransaccion)
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