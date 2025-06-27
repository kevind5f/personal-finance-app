import { defineEventHandler } from 'h3'
import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const cliente = dbData.clientes[0]

  // Saldo total de todas las cuentas
  const total_balance = (cliente.cuentas || []).reduce((acc: number, c: any) => acc + (c.saldo || 0), 0)

  // Mes actual en formato YYYY-MM
  const mesActual = new Date().toISOString().slice(0, 7)

  // Ingresos y gastos del mes actual
  const monthly_income = (cliente.ingresos || [])
    .filter((i: any) => (i.fecha || '').slice(0, 7) === mesActual)
    .reduce((acc: number, i: any) => acc + (i.monto || 0), 0)
  const monthly_expenses = (cliente.gastos || [])
    .filter((g: any) => (g.fecha || '').slice(0, 7) === mesActual)
    .reduce((acc: number, g: any) => acc + (g.monto || 0), 0)

  // Progreso de ahorro (metas)
  const metas = cliente.metas || []
  const ahorroTotal = metas.reduce((suma: number, meta: any) => suma + (meta.monto_actual || 0), 0)
  const objetivoTotal = metas.reduce((suma: number, meta: any) => suma + (meta.monto_objetivo || 0), 0)
  const savings_progress = objetivoTotal > 0 ? (ahorroTotal / objetivoTotal) * 100 : 0

  // Progreso de presupuestos
  const presupuestos = cliente.presupuestos || []
  const budget_progress = presupuestos.map((p: any) => ({
    category: p.categoria,
    spent: p.monto_gastado,
    total: p.monto_total,
    progress: p.monto_total > 0 ? (p.monto_gastado / p.monto_total) * 100 : 0
  }))

  // Cuentas
  const cuentas = cliente.cuentas || []

  // Deudas
  const deudas = cliente.deudas || []

  // Préstamos
  const prestamos = cliente.prestamos || []

  // Últimos movimientos (transacciones más recientes)
  const transacciones = (cliente.transacciones || [])
    .slice() // copia para no mutar el original
    .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5)

  return {
    total_balance,
    monthly_income,
    monthly_expenses,
    savings_progress,
    budget_progress,
    cuentas,
    deudas,
    prestamos,
    metas,
    ultimos_movimientos: transacciones
  }
}) 