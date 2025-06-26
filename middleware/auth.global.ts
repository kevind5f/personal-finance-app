import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  // Redirigir la raíz '/' a '/login'
  if (to.path === '/') {
    return navigateTo('/login')
  }

  // Lista de rutas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

  // Si la ruta es pública, permitir el acceso
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Verificar si estamos en el lado del cliente
  if (process.client) {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return navigateTo('/login')
    }
  }
}) 