import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const api = {
    async fetch(url: string, options: RequestInit = {}) {
      const token = localStorage.getItem('auth_token')
      const headers = new Headers(options.headers)
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      
      headers.set('Content-Type', 'application/json')

      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error en la petición')
      }

      return response.json()
    }
  }

  return {
    provide: {
      api
    }
  }
}) 