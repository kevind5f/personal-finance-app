import { defineEventHandler } from 'h3'
import fs from 'fs'
import path from 'path'
import { db } from '../database/db'

// Función para mapear meta de español a inglés
const mapMetaToGoal = (meta: any) => ({
  _id: meta._id,
  name: meta.nombre,
  targetAmount: meta.monto_objetivo ?? meta.montoObjetivo,
  currentAmount: meta.monto_actual ?? meta.montoActual,
  deadline: meta.fecha_objetivo ?? meta.fechaObjetivo,
  description: meta.descripcion
})

// Función para mapear meta de inglés a español
const mapGoalToMeta = (goal: any) => ({
  nombre: goal.name,
  montoObjetivo: goal.targetAmount,
  montoActual: goal.currentAmount,
  fechaObjetivo: goal.deadline,
  descripcion: goal.description
})

const dbPath = path.join(process.cwd(), 'server', 'database', 'db.json')

export default defineEventHandler(async (event) => {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  const metas = dbData.clientes[0]?.metas || []
  return metas.map(mapMetaToGoal)
}) 