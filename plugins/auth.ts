import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const auth = {
    token: null as string | null,
    
    setToken(token: string) {
      this.token = token
      localStorage.setItem('auth_token', token)
    },

    getToken(): string | null {
      if (!this.token) {
        this.token = localStorage.getItem('auth_token')
      }
      return this.token
    },

    removeToken() {
      this.token = null
      localStorage.removeItem('auth_token')
    },

    isAuthenticated(): boolean {
      return !!this.getToken()
    },

    async fetch(url: string, options: RequestInit = {}) {
      const token = this.getToken()
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
        throw new Error('Network response was not ok')
      }

      return response.json()
    }
  }

  return {
    provide: {
      auth
    }
  }
}) 