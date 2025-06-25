// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/main.scss'],
  postcss: {
    plugins: {
      'postcss-import': {},
      '@tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    // Variables privadas del servidor
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
    databaseUrl: process.env.DATABASE_URL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    tokenExpiry: process.env.TOKEN_EXPIRY || '24h',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    
    // Variables públicas (accesibles en el cliente)
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  },
  nitro: {
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    },
    // Configuración para producción
    compressPublicAssets: true,
    minify: true,
    sourceMap: process.env.NODE_ENV === 'development'
  },
  // Configuración de seguridad adicional
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'robots', content: 'noindex, nofollow' } // Cambiar en producción
      ]
    }
  }
})