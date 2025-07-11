import { defineEventHandler, getQuery, readBody } from 'h3'
import fs from 'fs'
import path from 'path'
import { db } from '../database/db'

// Función para mapear presupuesto de español a inglés
const mapPresupuestoToBudget = (presupuesto: any) => ({
  _id: presupuesto._id,
  name: presupuesto.name ?? presupuesto.titulo ?? presupuesto.nombre ?? '',
  category: presupuesto.categoria,
  totalBudget: presupuesto.monto ?? presupuesto.monto_total,
  spentAmount: presupuesto.gastado ?? presupuesto.monto_gastado,
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

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const presupuestos = dbData.clientes[0]?.presupuestos || []
  return presupuestos.map(mapPresupuestoToBudget)
}) 