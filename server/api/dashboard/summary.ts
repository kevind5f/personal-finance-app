import { defineEventHandler } from 'h3'
import { db, type Cuenta, type Transaccion, type Meta, type Presupuesto } from '../../database/db'

export default defineEventHandler(async (event) => {
  // Obtener datos de la base de datos
  const cuentas = db.getCuentas()
  const transacciones = db.getAllTransacciones()
  const metas = db.getMetas()
  const presupuestos = db.getPresupuestos()

  // Calcular saldo total
  const saldoTotal = cuentas.reduce((suma: number, cuenta: Cuenta) => suma + cuenta.saldo, 0)

  // Calcular ingresos y gastos mensuales
  const mesActual = new Date().toISOString().slice(0, 7)
  const transaccionesMensuales = transacciones.filter((t: Transaccion) => t.fecha.startsWith(mesActual))
  const ingresosMensuales = transaccionesMensuales
    .filter((t: Transaccion) => t.tipo === 'ingreso')
    .reduce((suma: number, t: Transaccion) => suma + t.monto, 0)
  const gastosMensuales = transaccionesMensuales
    .filter((t: Transaccion) => t.tipo === 'gasto')
    .reduce((suma: number, t: Transaccion) => suma + t.monto, 0)

  // Calcular progreso de ahorro
  const ahorroTotal = metas.reduce((suma: number, meta: Meta) => suma + meta.montoActual, 0)
  const objetivoTotal = metas.reduce((suma: number, meta: Meta) => suma + meta.montoObjetivo, 0)
  const progresoAhorro = objetivoTotal > 0 ? (ahorroTotal / objetivoTotal) * 100 : 0

  // Calcular progreso del presupuesto
  const progresoPresupuesto = presupuestos.map((presupuesto: Presupuesto) => ({
    category: presupuesto.categoria,
    spent: presupuesto.gastado,
    total: presupuesto.monto,
    progress: (presupuesto.gastado / presupuesto.monto) * 100
  }))

  return {
    total_balance: saldoTotal,
    monthly_income: ingresosMensuales,
    monthly_expenses: gastosMensuales,
    savings_progress: progresoAhorro,
    budget_progress: progresoPresupuesto
  }
}) 