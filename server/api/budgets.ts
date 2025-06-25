import { defineEventHandler, getQuery, readBody } from 'h3'
import { db } from '../database/db'

// Función para mapear presupuesto de español a inglés
const mapPresupuestoToBudget = (presupuesto: any) => ({
  _id: presupuesto._id,
  category: presupuesto.categoria,
  totalBudget: presupuesto.monto,
  spentAmount: presupuesto.gastado,
  month: presupuesto.mes,
  description: presupuesto.descripcion,
  type: presupuesto.tipo,
  paymentMethod: presupuesto.formaPago,
  frequency: presupuesto.periodicidad,
  initialBudget: presupuesto.presupuestoInicial,
  createdAt: presupuesto.fechaCreacion,
  updatedAt: presupuesto.fechaActualizacion,
  active: presupuesto.activo
})

// Función para mapear presupuesto de inglés a español
const mapBudgetToPresupuesto = (budget: any) => ({
  categoria: budget.category,
  monto: budget.totalBudget,
  gastado: budget.spentAmount,
  mes: budget.month,
  descripcion: budget.description,
  tipo: budget.type,
  formaPago: budget.paymentMethod,
  periodicidad: budget.frequency,
  presupuestoInicial: budget.initialBudget,
  fechaCreacion: budget.createdAt,
  fechaActualizacion: budget.updatedAt,
  activo: budget.active
})

export default defineEventHandler(async (event) => {
  const metodo = event.method

  if (metodo === 'GET') {
    const presupuestos = db.getPresupuestos()
    return presupuestos.map(mapPresupuestoToBudget)
  }

  if (metodo === 'POST') {
    const cuerpo = await readBody(event)
    const presupuestoData = mapBudgetToPresupuesto(cuerpo)
    const nuevoPresupuesto = db.createPresupuesto(presupuestoData)
    return mapPresupuestoToBudget(nuevoPresupuesto)
  }

  if (metodo === 'PUT') {
    const cuerpo = await readBody(event)
    const presupuestoData = mapBudgetToPresupuesto(cuerpo)
    const presupuestoActualizado = db.updatePresupuesto(cuerpo._id, presupuestoData)
    if (!presupuestoActualizado) {
      return { error: 'Presupuesto no encontrado' }
    }
    return mapPresupuestoToBudget(presupuestoActualizado)
  }

  if (metodo === 'DELETE') {
    const consulta = getQuery(event)
    const id = consulta.id as string
    const eliminado = db.deletePresupuesto(id)
    if (!eliminado) {
      return { error: 'Presupuesto no encontrado' }
    }
    return { mensaje: 'Presupuesto eliminado exitosamente' }
  }
}) 