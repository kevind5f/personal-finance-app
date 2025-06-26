import { defineEventHandler } from 'h3'
import { db } from '../database/db'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Obtener datos de la base de datos
    const cuentas = db.getCuentas()
    const transacciones = db.getAllTransacciones()
    const metas = db.getMetas()
    const presupuestos = db.getPresupuestos()

    // LOGS DE DEPURACIÓN
    // Imprime la ruta real del archivo de base de datos
    // @ts-ignore
    console.log('DB PATH:', db.dbPath || 'No disponible')
    console.log('Cuentas:', cuentas.length)
    console.log('Transacciones:', transacciones.length)
    console.log('Primeras transacciones:', JSON.stringify(transacciones.slice(0, 2), null, 2))

    // Procesar transacciones
    let totalIngresos = 0
    let totalGastos = 0
    const ingresosPorMes: Record<string, number> = {}
    const gastosPorMes: Record<string, number> = {}
    const ingresosPorCategoria: Record<string, number> = {}
    const gastosPorCategoria: Record<string, number> = {}

    transacciones.forEach(transaccion => {
      const monto = Number(transaccion.monto)
      const fecha = new Date(transaccion.fecha)
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
      const categoria = transaccion.categoria || 'Sin categoría'

      if (transaccion.tipo === 'ingreso') {
        totalIngresos += monto
        ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + monto
        ingresosPorCategoria[categoria] = (ingresosPorCategoria[categoria] || 0) + monto
      } else {
        totalGastos += monto
        gastosPorMes[mes] = (gastosPorMes[mes] || 0) + monto
        gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + monto
      }
    })

    // Calcular balance neto
    const balanceNeto = totalIngresos - totalGastos

    // Calcular máximos
    const maxIngresos = Math.max(...Object.values(ingresosPorMes), 0)
    const maxGastos = Math.max(...Object.values(gastosPorMes), 0)
    const maxIngresosCategoria = Math.max(...Object.values(ingresosPorCategoria), 0)
    const maxGastosCategoria = Math.max(...Object.values(gastosPorCategoria), 0)

    // Calcular promedios
    const mesesCount = Math.max(Object.keys(ingresosPorMes).length, 1)
    const diasCount = mesesCount * 30
    const añosCount = Number(mesesCount) / 12

    const promedioIngresos = {
      diario: totalIngresos / diasCount,
      mensual: totalIngresos / mesesCount,
      anual: totalIngresos / añosCount
    }

    const promedioGastos = {
      diario: totalGastos / diasCount,
      mensual: totalGastos / mesesCount,
      anual: totalGastos / añosCount
    }

    // Analizar cuentas
    const analisisCuentas = cuentas.map(cuenta => {
      const transaccionesCuenta = transacciones.filter(t => t.cuentaId === cuenta._id)
      const ultimaTransaccion = transaccionesCuenta.length > 0 
        ? transaccionesCuenta.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0].fecha
        : null

      return {
        _id: cuenta._id,
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        saldo: cuenta.saldo,
        transaccionesCount: transaccionesCuenta.length,
        ultimaTransaccion
      }
    })

    // Encontrar mayor deuda y préstamo usando los arrays de db.json
    const deudasArr = db.getDeudas()
    const prestamosArr = db.getPrestamos()

    const mayorDeuda = deudasArr.length > 0
      ? deudasArr.reduce((max, deuda) => (Number(deuda.monto) > Number(max.monto) ? deuda : max), deudasArr[0])
      : null

    const mayorPrestamo = prestamosArr.length > 0
      ? prestamosArr.reduce((max, prestamo) => (Number(prestamo.monto) > Number(max.monto) ? prestamo : max), prestamosArr[0])
      : null

    // Calcular tendencias
    const meses = Object.keys(ingresosPorMes).sort()
    let tendenciaIngresos = { icono: '📈', direccion: 'up', porcentaje: 0, descripcion: 'Sin datos suficientes' }
    let tendenciaGastos = { icono: '📉', direccion: 'down', porcentaje: 0, descripcion: 'Sin datos suficientes' }

    if (meses.length >= 2) {
      const mesActual = meses[meses.length - 1]
      const mesAnterior = meses[meses.length - 2]
      
      const ingresosActual = ingresosPorMes[mesActual] || 0
      const ingresosAnterior = ingresosPorMes[mesAnterior] || 0
      
      if (ingresosAnterior > 0) {
        const cambioIngresos = ((ingresosActual - ingresosAnterior) / ingresosAnterior) * 100
        tendenciaIngresos = {
          icono: cambioIngresos >= 0 ? '📈' : '📉',
          direccion: cambioIngresos >= 0 ? 'up' : 'down',
          porcentaje: Number(Math.abs(cambioIngresos).toFixed(1)),
          descripcion: cambioIngresos >= 0 ? 'Aumento vs mes anterior' : 'Disminución vs mes anterior'
        }
      }

      const gastosActual = gastosPorMes[mesActual] || 0
      const gastosAnterior = gastosPorMes[mesAnterior] || 0
      
      if (gastosAnterior > 0) {
        const cambioGastos = ((gastosActual - gastosAnterior) / gastosAnterior) * 100
        tendenciaGastos = {
          icono: cambioGastos >= 0 ? '📈' : '📉',
          direccion: cambioGastos >= 0 ? 'up' : 'down',
          porcentaje: Number(Math.abs(cambioGastos).toFixed(1)),
          descripcion: cambioGastos >= 0 ? 'Aumento vs mes anterior' : 'Disminución vs mes anterior'
        }
      }
    }

    // Procesar metas de ahorro
    const progresoAhorro = metas.reduce((suma, meta) => suma + meta.montoActual, 0)
    const objetivoTotal = metas.reduce((suma, meta) => suma + meta.montoObjetivo, 0)
    const porcentajeAhorro = objetivoTotal > 0 ? (progresoAhorro / objetivoTotal) * 100 : 0

    // Procesar presupuestos
    const presupuestosActuales = presupuestos.filter(p => p.mes === new Date().toISOString().slice(0, 7))
    const analisisPresupuestos = presupuestosActuales.map(p => ({
      categoria: p.categoria,
      gastado: p.gastado,
      total: p.monto,
      progreso: (p.gastado / p.monto) * 100
    }))

    return {
      // Resumen general
      total_income: totalIngresos,
      total_expenses: totalGastos,
      net_balance: balanceNeto,
      total_transactions: transacciones.length,
      active_accounts: cuentas.length,
      
      // Datos por mes
      income_by_month: ingresosPorMes,
      expenses_by_month: gastosPorMes,
      
      // Datos por categoría
      income_by_category: ingresosPorCategoria,
      expenses_by_category: gastosPorCategoria,
      
      // Máximos
      max_income: maxIngresos,
      max_expenses: maxGastos,
      max_income_category: maxIngresosCategoria,
      max_expense_category: maxGastosCategoria,
      
      // Promedios
      average_income: promedioIngresos,
      average_expenses: promedioGastos,
      
      // Deudas y préstamos
      largest_debt: mayorDeuda,
      largest_loan: mayorPrestamo,
      
      // Análisis de cuentas
      account_analysis: analisisCuentas,
      
      // Tendencias
      income_trend: tendenciaIngresos,
      expense_trend: tendenciaGastos,
      
      // Metas y presupuestos
      savings_progress: porcentajeAhorro,
      budget_analysis: analisisPresupuestos
    }

  } catch (error) {
    console.error('Error generating report:', error)
    return {
      error: 'Error al generar el reporte',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}) 