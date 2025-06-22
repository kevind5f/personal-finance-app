import { defineEventHandler } from 'h3'
import { db } from '../database/db'

export default defineEventHandler(async (event) => {
  // Devuelve el array de deudas del archivo db.json
  return db.getDeudas ? db.getDeudas() : []
}) 