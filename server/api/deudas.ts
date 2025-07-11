import { defineEventHandler, getQuery, readBody } from 'h3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const metodo = event.method

  if (metodo === 'GET') {
    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      const deudas = dbData.clientes[0]?.deudas || []
      return deudas
    } catch (error) {
      console.error('Error reading deudas:', error)
      return []
    }
  }

  if (metodo === 'POST') {
    try {
      const cuerpo = await readBody(event)
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      
      const nuevaDeuda = {
        _id: String(Date.now()),
        ...cuerpo
      }
      
      if (!dbData.clientes[0].deudas) {
        dbData.clientes[0].deudas = []
      }
      
      dbData.clientes[0].deudas.push(nuevaDeuda)
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      
      return nuevaDeuda
    } catch (error) {
      console.error('Error creating deuda:', error)
      return { error: 'Error al crear la deuda' }
    }
  }

  if (metodo === 'PUT') {
    try {
      const cuerpo = await readBody(event)
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      
      const deudaIndex = dbData.clientes[0].deudas.findIndex((d: any) => d._id === cuerpo._id)
      if (deudaIndex === -1) {
        return { error: 'Deuda no encontrada' }
      }
      
      dbData.clientes[0].deudas[deudaIndex] = { ...dbData.clientes[0].deudas[deudaIndex], ...cuerpo }
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      
      return dbData.clientes[0].deudas[deudaIndex]
    } catch (error) {
      console.error('Error updating deuda:', error)
      return { error: 'Error al actualizar la deuda' }
    }
  }

  if (metodo === 'DELETE') {
    try {
      const consulta = getQuery(event)
      const id = consulta.id as string
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      
      const deudaIndex = dbData.clientes[0].deudas.findIndex((d: any) => d._id === id)
      if (deudaIndex === -1) {
        return { error: 'Deuda no encontrada' }
      }
      
      dbData.clientes[0].deudas.splice(deudaIndex, 1)
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      
      return { mensaje: 'Deuda eliminada exitosamente' }
    } catch (error) {
      console.error('Error deleting deuda:', error)
      return { error: 'Error al eliminar la deuda' }
    }
  }

  // Nuevo endpoint para agregar pagos a una deuda
  if (metodo === 'PATCH') {
    const consulta = getQuery(event)
    const deudaId = consulta.deudaId as string
    const accion = consulta.accion as string

    if (accion === 'addPayment') {
      try {
        const cuerpo = await readBody(event)
        const { amount, date } = cuerpo

        // Leer la base de datos
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
        const cliente = dbData.clientes[0]
        const deuda = cliente.deudas.find((d: any) => d._id === deudaId)

        if (!deuda) {
          return { error: 'Deuda no encontrada' }
        }

        // Inicializar array de pagos si no existe
        if (!deuda.payments) {
          deuda.payments = []
        }

        // Agregar el nuevo pago
        const nuevoPago = {
          fecha: date,
          monto: amount
        }
        deuda.payments.push(nuevoPago)

        // Guardar en la base de datos
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))

        return { 
          mensaje: 'Pago agregado exitosamente',
          deuda: deuda
        }
      } catch (error) {
        console.error('Error adding payment to deuda:', error)
        return { error: 'Error al agregar el pago' }
      }
    }

    return { error: 'Acción no válida' }
  }
}) 