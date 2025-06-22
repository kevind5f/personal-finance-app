import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    // Aquí deberías validar las credenciales contra tu base de datos
    // Por ahora, usaremos un usuario de prueba
    if (email === 'test@example.com' && password === 'password123') {
      const config = useRuntimeConfig();
      const token = jwt.sign(
        { userId: '123' }, // En producción, usa el ID real del usuario
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      return {
        token,
        user: {
          id: '123',
          email: 'test@example.com'
        }
      };
    }

    throw createError({
      statusCode: 401,
      message: 'Credenciales inválidas'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error al iniciar sesión'
    });
  }
}); 