export default defineNuxtRouteMiddleware((to) => {
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