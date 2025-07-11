<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <form @submit.prevent="login" class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Iniciar Sesión</h2>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
        <input v-model="password" type="password" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div v-if="error" class="text-red-600 dark:text-red-400 text-center">{{ error }}</div>
      <div v-if="isLoading" class="text-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    console.log('Intentando login con:', { email: email.value, password: password.value })
    
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    
    console.log('Respuesta del servidor:', res.status, res.statusText)
    
    const data = await res.json()
    console.log('Datos de respuesta:', data)
    
    if (data.success) {
      localStorage.setItem('auth_token', 'authenticated')
      localStorage.setItem('cliente', JSON.stringify(data.cliente))
      console.log('Login exitoso, redirigiendo a dashboard')
      router.push('/dashboard')
    } else {
      error.value = data.message || 'Credenciales incorrectas'
      console.log('Login fallido:', error.value)
    }
  } catch (e) {
    console.error('Error en login:', e)
    error.value = 'Error de conexión con el servidor'
  } finally {
    isLoading.value = false
  }
}
</script> 