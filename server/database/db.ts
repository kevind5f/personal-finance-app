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

interface Database {
  cuentas: Cuenta[]
  transacciones: Transaccion[]
  metas: Meta[]
  presupuestos: Presupuesto[]
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
    } catch (error) {
      // Si el archivo no existe, crear una base de datos vacía
      this.db = {
        cuentas: [],
        transacciones: [],
        metas: [],
        presupuestos: []
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

  // NUEVO: Método para obtener préstamos
  getPrestamos(): any[] {
    // Si el array existe, lo retorna, si no, retorna array vacío
    // (el tipo any[] se puede mejorar si defines una interfaz Prestamo)
    // @ts-ignore
    return this.db.prestamos || []
  }

  // NUEVO: Método para obtener deudas
  getDeudas(): any[] {
    // Si el array existe, lo retorna, si no, retorna array vacío
    // (el tipo any[] se puede mejorar si defines una interfaz Deuda)
    // @ts-ignore
    return this.db.deudas || []
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
}

// Exportar una instancia única de la base de datos
export const db = new DatabaseService() 