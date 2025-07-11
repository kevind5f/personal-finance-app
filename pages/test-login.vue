<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md space-y-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Test Login</h2>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input v-model="email" type="email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
        <input v-model="password" type="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      
      <div v-if="error" class="text-red-600 dark:text-red-400 text-center">{{ error }}</div>
      <div v-if="success" class="text-green-600 dark:text-green-400 text-center">{{ success }}</div>
      
      <div class="space-y-2">
        <button @click="testLogin" class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Test Login Endpoint
        </button>
        <button @click="testRealLogin" class="w-full py-2 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition">
          Test Real Login
        </button>
        <button @click="goToDashboard" class="w-full py-2 px-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
          Go to Dashboard
        </button>
      </div>
      
      <div v-if="response" class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 class="font-semibold mb-2">Response:</h3>
        <pre class="text-xs">{{ JSON.stringify(response, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('test@example.com')
const password = ref('password123')
const error = ref('')
const success = ref('')
const response = ref(null)
const router = useRouter()

const testLogin = async () => {
  error.value = ''
  success.value = ''
  response.value = null
  
  try {
    const res = await fetch('/api/test-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    
    const data = await res.json()
    response.value = data
    
    if (data.success) {
      success.value = 'Test endpoint working!'
    } else {
      error.value = data.message || 'Error'
    }
  } catch (e) {
    error.value = 'Error de conexión: ' + e.message
  }
}

const testRealLogin = async () => {
  error.value = ''
  success.value = ''
  response.value = null
  
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    
    const data = await res.json()
    response.value = data
    
    if (data.success) {
      success.value = 'Login exitoso!'
      localStorage.setItem('auth_token', 'authenticated')
      localStorage.setItem('cliente', JSON.stringify(data.cliente))
    } else {
      error.value = data.message || 'Credenciales incorrectas'
    }
  } catch (e) {
    error.value = 'Error de conexión: ' + e.message
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}
</script> 