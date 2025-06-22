// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
  tailwindcss: {
    cssPath: '~/assets/css/main.scss',
    configPath: 'tailwind.config.cjs',
    exposeConfig: false,
    viewer: true,
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000'
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
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  }
})