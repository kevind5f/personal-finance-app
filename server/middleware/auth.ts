import jwt from 'jsonwebtoken';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/_nuxt', // Archivos estáticos de Nuxt
    '/__nuxt', // Archivos estáticos de Nuxt
    '/favicon.ico',
    '/'
  ];

  // Verificar si la ruta actual es pública
  if (publicRoutes.some(route => event.path.startsWith(route))) {
    return;
  }

  try {
    // Obtener el token del header
    const authHeader = getHeader(event, 'Authorization');

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        message: 'No token provided'
      });
    }

    // Extraer el token del header
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token format'
      });
    }

    // Verificar el token
    const config = useRuntimeConfig();
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      
      // Agregar la información del usuario al contexto
      event.context.auth = {
        userId: decoded.userId
      };
    } catch (jwtError) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token'
      });
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: error.message || 'Authentication failed'
    });
  }
}); 