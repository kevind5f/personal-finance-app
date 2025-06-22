import { defineEventHandler } from 'h3'
import { db } from '../database/db'

export default defineEventHandler(async (event) => {
  // Devuelve el array de préstamos del archivo db.json
  return db.getPrestamos ? db.getPrestamos() : []
}) 