import { defineEventHandler, getQuery, readBody } from 'h3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const metodo = event.method

  if (metodo === 'GET') {
    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      const prestamos = dbData.clientes[0]?.prestamos || []
      return prestamos
    } catch (error) {
      console.error('Error reading prestamos:', error)
      return []
    }
  }

  if (metodo === 'POST') {
    try {
      const cuerpo = await readBody(event)
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      
      const nuevoPrestamo = {
        _id: String(Date.now()),
        ...cuerpo
      }
      
      if (!dbData.clientes[0].prestamos) {
        dbData.clientes[0].prestamos = []
      }
      
      dbData.clientes[0].prestamos.push(nuevoPrestamo)
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      
      return nuevoPrestamo
    } catch (error) {
      console.error('Error creating prestamo:', error)
      return { error: 'Error al crear el préstamo' }
    }
  }

  if (metodo === 'PUT') {
    try {
      const cuerpo = await readBody(event)
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      
      const prestamoIndex = dbData.clientes[0].prestamos.findIndex((p: any) => p._id === cuerpo._id)
      if (prestamoIndex === -1) {
        return { error: 'Préstamo no encontrado' }
      }
      
      dbData.clientes[0].prestamos[prestamoIndex] = { ...dbData.clientes[0].prestamos[prestamoIndex], ...cuerpo }
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      
      return dbData.clientes[0].prestamos[prestamoIndex]
    } catch (error) {
      console.error('Error updating prestamo:', error)
      return { error: 'Error al actualizar el préstamo' }
    }
  }

  if (metodo === 'DELETE') {
    try {
      const consulta = getQuery(event)
      const id = consulta.id as string
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
      
      const prestamoIndex = dbData.clientes[0].prestamos.findIndex((p: any) => p._id === id)
      if (prestamoIndex === -1) {
        return { error: 'Préstamo no encontrado' }
      }
      
      dbData.clientes[0].prestamos.splice(prestamoIndex, 1)
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))
      
      return { mensaje: 'Préstamo eliminado exitosamente' }
    } catch (error) {
      console.error('Error deleting prestamo:', error)
      return { error: 'Error al eliminar el préstamo' }
    }
  }

  // Nuevo endpoint para agregar pagos a un préstamo
  if (metodo === 'PATCH') {
    const consulta = getQuery(event)
    const prestamoId = consulta.prestamoId as string
    const accion = consulta.accion as string

    if (accion === 'addPayment') {
      try {
        const cuerpo = await readBody(event)
        const { amount, date } = cuerpo

        // Leer la base de datos
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
        const cliente = dbData.clientes[0]
        const prestamo = cliente.prestamos.find((p: any) => p._id === prestamoId)

        if (!prestamo) {
          return { error: 'Préstamo no encontrado' }
        }

        // Inicializar array de pagos si no existe
        if (!prestamo.payments) {
          prestamo.payments = []
        }

        // Agregar el nuevo pago
        const nuevoPago = {
          fecha: date,
          monto: amount
        }
        prestamo.payments.push(nuevoPago)

        // Guardar en la base de datos
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))

        return { 
          mensaje: 'Pago agregado exitosamente',
          prestamo: prestamo
        }
      } catch (error) {
        console.error('Error adding payment to prestamo:', error)
        return { error: 'Error al agregar el pago' }
      }
    }

    return { error: 'Acción no válida' }
  }
}) 