import { defineEventHandler, getQuery, readBody } from 'h3'
import { db } from '../database/db'

// Función para mapear meta de español a inglés
const mapMetaToGoal = (meta: any) => ({
  _id: meta._id,
  name: meta.nombre,
  targetAmount: meta.montoObjetivo,
  currentAmount: meta.montoActual,
  deadline: meta.fechaObjetivo,
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

export default defineEventHandler(async (event) => {
  const metodo = event.method

  if (metodo === 'GET') {
    const metas = db.getMetas()
    return metas.map(mapMetaToGoal)
  }

  if (metodo === 'POST') {
    const cuerpo = await readBody(event)
    const metaData = mapGoalToMeta(cuerpo)
    const nuevaMeta = db.createMeta(metaData)
    return mapMetaToGoal(nuevaMeta)
  }

  if (metodo === 'PUT') {
    const cuerpo = await readBody(event)
    const metaData = mapGoalToMeta(cuerpo)
    const metaActualizada = db.updateMeta(cuerpo._id, metaData)
    if (!metaActualizada) {
      return { error: 'Meta no encontrada' }
    }
    return mapMetaToGoal(metaActualizada)
  }

  if (metodo === 'DELETE') {
    const consulta = getQuery(event)
    const id = consulta.id as string
    const eliminada = db.deleteMeta(id)
    if (!eliminada) {
      return { error: 'Meta no encontrada' }
    }
    return { mensaje: 'Meta eliminada exitosamente' }
  }
}) 