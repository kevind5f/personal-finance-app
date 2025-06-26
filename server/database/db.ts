import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Tipos de datos
export interface Cuenta {
  _id: string
  nombre: string
  tipo: string
  saldo: number
}

export interface Transaccion {
  _id: string
  descripcion: string
  monto: number
  tipo: 'ingreso' | 'gasto'
  categoria: string
  fecha: string
  cuentaId: string
}

export interface Meta {
  _id: string
  nombre: string
  montoObjetivo: number
  montoActual: number
  fechaObjetivo: string
  descripcion: string
}

export interface Presupuesto {
  _id: string
  categoria: string
  monto: number
  gastado: number
  mes: string
  descripcion: string
  tipo: 'gasto' | 'ingreso' | 'ahorro' | 'inversion'
  formaPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'credito' | 'debito' | 'otro'
  periodicidad: 'unico' | 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual'
  presupuestoInicial: number
  fechaCreacion: string
  fechaActualizacion: string
  activo: boolean
}

export interface Ingreso {
  _id: string
  titulo: string
  descripcion?: string
  monto: number
  categoria: string
  fecha: string
  cuentaId: string
}

export interface Gasto {
  _id: string
  titulo: string
  descripcion?: string
  monto: number
  categoria: string
  fecha: string
  cuentaId: string
}

export interface Prestamo {
  _id: string
  nombre: string
  monto: number
  fecha: string
  descripcion?: string
  cuentaId?: string
}

export interface Deuda {
  _id: string
  nombre: string
  monto: number
  fecha: string
  descripcion?: string
  cuentaId?: string
}

export interface Configuracion {
  clienteId: string
  categoriasGastos: string[]
  categoriasIngreso: string[]
}

interface Database {
  cuentas: Cuenta[]
  ingresos: Ingreso[]
  gastos: Gasto[]
  transacciones: Transaccion[]
  metas: Meta[]
  presupuestos: Presupuesto[]
  prestamos: Prestamo[]
  deudas: Deuda[]
  configuraciones: Configuracion[]
}

// Clase para manejar la base de datos
export class DatabaseService {
  private db!: Database
  private dbPath: string

  constructor() {
    this.dbPath = join(process.cwd(), 'server', 'database', 'db.json')
    this.loadDatabase()
  }

  private loadDatabase() {
    try {
      const data = readFileSync(this.dbPath, 'utf-8')
      this.db = JSON.parse(data)
      // Inicializar arrays nuevos si no existen
      this.db.ingresos = this.db.ingresos || []
      this.db.gastos = this.db.gastos || []
      this.db.prestamos = this.db.prestamos || []
      this.db.deudas = this.db.deudas || []
      this.db.configuraciones = this.db.configuraciones || []
    } catch (error) {
      // Si el archivo no existe, crear una base de datos vacía
      this.db = {
        cuentas: [],
        ingresos: [],
        gastos: [],
        transacciones: [],
        metas: [],
        presupuestos: [],
        prestamos: [],
        deudas: [],
        configuraciones: []
      }
      this.saveDatabase()
    }
  }

  private saveDatabase() {
    writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2), 'utf-8')
  }

  // Métodos para Cuentas
  getCuentas(): Cuenta[] {
    return this.db.cuentas
  }

  getCuenta(id: string): Cuenta | undefined {
    return this.db.cuentas.find(c => c._id === id)
  }

  createCuenta(cuenta: Omit<Cuenta, '_id'>): Cuenta {
    const nuevaCuenta = {
      _id: String(this.db.cuentas.length + 1),
      ...cuenta
    }
    this.db.cuentas.push(nuevaCuenta)
    this.saveDatabase()
    return nuevaCuenta
  }

  updateCuenta(id: string, cuenta: Partial<Cuenta>): Cuenta | undefined {
    const index = this.db.cuentas.findIndex(c => c._id === id)
    if (index !== -1) {
      this.db.cuentas[index] = { ...this.db.cuentas[index], ...cuenta }
      this.saveDatabase()
      return this.db.cuentas[index]
    }
    return undefined
  }

  deleteCuenta(id: string): boolean {
    const index = this.db.cuentas.findIndex(c => c._id === id)
    if (index !== -1) {
      this.db.cuentas.splice(index, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Transacciones
  getTransacciones(): Transaccion[] {
    return this.db.transacciones
  }

  getTransaccion(id: string): Transaccion | undefined {
    return this.db.transacciones.find(t => t._id === id)
  }

  createTransaccion(transaccion: Omit<Transaccion, '_id'>): Transaccion {
    const nuevaTransaccion = {
      _id: String(this.db.transacciones.length + 1),
      ...transaccion
    }
    this.db.transacciones.push(nuevaTransaccion)
    this.saveDatabase()
    return nuevaTransaccion
  }

  updateTransaccion(id: string, transaccion: Partial<Transaccion>): Transaccion | undefined {
    const index = this.db.transacciones.findIndex(t => t._id === id)
    if (index !== -1) {
      this.db.transacciones[index] = { ...this.db.transacciones[index], ...transaccion }
      this.saveDatabase()
      return this.db.transacciones[index]
    }
    return undefined
  }

  deleteTransaccion(id: string): boolean {
    const index = this.db.transacciones.findIndex(t => t._id === id)
    if (index !== -1) {
      this.db.transacciones.splice(index, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Metas
  getMetas(): Meta[] {
    return this.db.metas
  }

  getMeta(id: string): Meta | undefined {
    return this.db.metas.find(m => m._id === id)
  }

  createMeta(meta: Omit<Meta, '_id'>): Meta {
    const nuevaMeta = {
      _id: String(this.db.metas.length + 1),
      ...meta
    }
    this.db.metas.push(nuevaMeta)
    this.saveDatabase()
    return nuevaMeta
  }

  updateMeta(id: string, meta: Partial<Meta>): Meta | undefined {
    const index = this.db.metas.findIndex(m => m._id === id)
    if (index !== -1) {
      this.db.metas[index] = { ...this.db.metas[index], ...meta }
      this.saveDatabase()
      return this.db.metas[index]
    }
    return undefined
  }

  deleteMeta(id: string): boolean {
    const index = this.db.metas.findIndex(m => m._id === id)
    if (index !== -1) {
      this.db.metas.splice(index, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Presupuestos
  getPresupuestos(): Presupuesto[] {
    return this.db.presupuestos
  }

  getPresupuesto(id: string): Presupuesto | undefined {
    return this.db.presupuestos.find(p => p._id === id)
  }

  createPresupuesto(presupuesto: Omit<Presupuesto, '_id'>): Presupuesto {
    const fechaActual = new Date().toISOString()
    const nuevoPresupuesto = {
      _id: String(this.db.presupuestos.length + 1),
      ...presupuesto,
      gastado: presupuesto.gastado || 0,
      tipo: presupuesto.tipo || 'gasto',
      formaPago: presupuesto.formaPago || 'efectivo',
      periodicidad: presupuesto.periodicidad || 'mensual',
      presupuestoInicial: presupuesto.presupuestoInicial || presupuesto.monto,
      fechaCreacion: presupuesto.fechaCreacion || fechaActual,
      fechaActualizacion: presupuesto.fechaActualizacion || fechaActual,
      activo: presupuesto.activo !== undefined ? presupuesto.activo : true
    }
    this.db.presupuestos.push(nuevoPresupuesto)
    this.saveDatabase()
    return nuevoPresupuesto
  }

  updatePresupuesto(id: string, presupuesto: Partial<Presupuesto>): Presupuesto | undefined {
    const index = this.db.presupuestos.findIndex(p => p._id === id)
    if (index !== -1) {
      this.db.presupuestos[index] = { ...this.db.presupuestos[index], ...presupuesto }
      this.saveDatabase()
      return this.db.presupuestos[index]
    }
    return undefined
  }

  deletePresupuesto(id: string): boolean {
    const index = this.db.presupuestos.findIndex(p => p._id === id)
    if (index !== -1) {
      this.db.presupuestos.splice(index, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Ingresos
  getIngresos(): Ingreso[] {
    return this.db.ingresos
  }
  getIngreso(id: string): Ingreso | undefined {
    return this.db.ingresos.find(i => i._id === id)
  }
  createIngreso(ingreso: Omit<Ingreso, '_id'>): Ingreso {
    const nuevo = { _id: String(this.db.ingresos.length + 1), ...ingreso }
    this.db.ingresos.push(nuevo)
    this.saveDatabase()
    return nuevo
  }
  updateIngreso(id: string, ingreso: Partial<Ingreso>): Ingreso | undefined {
    const idx = this.db.ingresos.findIndex(i => i._id === id)
    if (idx !== -1) {
      this.db.ingresos[idx] = { ...this.db.ingresos[idx], ...ingreso }
      this.saveDatabase()
      return this.db.ingresos[idx]
    }
    return undefined
  }
  deleteIngreso(id: string): boolean {
    const idx = this.db.ingresos.findIndex(i => i._id === id)
    if (idx !== -1) {
      this.db.ingresos.splice(idx, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Gastos
  getGastos(): Gasto[] {
    return this.db.gastos
  }
  getGasto(id: string): Gasto | undefined {
    return this.db.gastos.find(g => g._id === id)
  }
  createGasto(gasto: Omit<Gasto, '_id'>): Gasto {
    const nuevo = { _id: String(this.db.gastos.length + 1), ...gasto }
    this.db.gastos.push(nuevo)
    this.saveDatabase()
    return nuevo
  }
  updateGasto(id: string, gasto: Partial<Gasto>): Gasto | undefined {
    const idx = this.db.gastos.findIndex(g => g._id === id)
    if (idx !== -1) {
      this.db.gastos[idx] = { ...this.db.gastos[idx], ...gasto }
      this.saveDatabase()
      return this.db.gastos[idx]
    }
    return undefined
  }
  deleteGasto(id: string): boolean {
    const idx = this.db.gastos.findIndex(g => g._id === id)
    if (idx !== -1) {
      this.db.gastos.splice(idx, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Prestamos
  getPrestamos(): Prestamo[] {
    return this.db.prestamos
  }
  getPrestamo(id: string): Prestamo | undefined {
    return this.db.prestamos.find(p => p._id === id)
  }
  createPrestamo(prestamo: Omit<Prestamo, '_id'>): Prestamo {
    const nuevo = { _id: String(this.db.prestamos.length + 1), ...prestamo }
    this.db.prestamos.push(nuevo)
    this.saveDatabase()
    return nuevo
  }
  updatePrestamo(id: string, prestamo: Partial<Prestamo>): Prestamo | undefined {
    const idx = this.db.prestamos.findIndex(p => p._id === id)
    if (idx !== -1) {
      this.db.prestamos[idx] = { ...this.db.prestamos[idx], ...prestamo }
      this.saveDatabase()
      return this.db.prestamos[idx]
    }
    return undefined
  }
  deletePrestamo(id: string): boolean {
    const idx = this.db.prestamos.findIndex(p => p._id === id)
    if (idx !== -1) {
      this.db.prestamos.splice(idx, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Deudas
  getDeudas(): Deuda[] {
    return this.db.deudas
  }
  getDeuda(id: string): Deuda | undefined {
    return this.db.deudas.find(d => d._id === id)
  }
  createDeuda(deuda: Omit<Deuda, '_id'>): Deuda {
    const nuevo = { _id: String(this.db.deudas.length + 1), ...deuda }
    this.db.deudas.push(nuevo)
    this.saveDatabase()
    return nuevo
  }
  updateDeuda(id: string, deuda: Partial<Deuda>): Deuda | undefined {
    const idx = this.db.deudas.findIndex(d => d._id === id)
    if (idx !== -1) {
      this.db.deudas[idx] = { ...this.db.deudas[idx], ...deuda }
      this.saveDatabase()
      return this.db.deudas[idx]
    }
    return undefined
  }
  deleteDeuda(id: string): boolean {
    const idx = this.db.deudas.findIndex(d => d._id === id)
    if (idx !== -1) {
      this.db.deudas.splice(idx, 1)
      this.saveDatabase()
      return true
    }
    return false
  }

  // Métodos para Configuraciones
  getConfiguracion(clienteId: string): Configuracion | undefined {
    return this.db.configuraciones.find(c => c.clienteId === clienteId)
  }
  setConfiguracion(config: Configuracion): Configuracion {
    const idx = this.db.configuraciones.findIndex(c => c.clienteId === config.clienteId)
    if (idx !== -1) {
      this.db.configuraciones[idx] = config
    } else {
      this.db.configuraciones.push(config)
    }
    this.saveDatabase()
    return config
  }

  // NUEVO: Devuelve todos los movimientos combinando ingresos y gastos
  getAllTransacciones(): Transaccion[] {
    // Normalizar ingresos
    const ingresos = (this.db.ingresos || []).map(i => ({
      _id: i._id,
      descripcion: i.descripcion || i.titulo || '',
      monto: i.monto,
      tipo: 'ingreso' as const,
      categoria: i.categoria,
      fecha: i.fecha,
      cuentaId: i.cuentaId
    }))
    // Normalizar gastos
    const gastos = (this.db.gastos || []).map(g => ({
      _id: g._id,
      descripcion: g.descripcion || g.titulo || '',
      monto: g.monto,
      tipo: 'gasto' as const,
      categoria: g.categoria,
      fecha: g.fecha,
      cuentaId: g.cuentaId
    }))
    // Unir y ordenar por fecha descendente
    return [...ingresos, ...gastos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }
}

// Exportar una instancia única de la base de datos
export const db = new DatabaseService() 