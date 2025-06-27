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
      <button type="submit" class="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Ingresar</button>
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
const router = useRouter()

const login = async () => {
  error.value = ''
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem('cliente', JSON.stringify(data.cliente))
      router.push('/dashboard')
    } else {
      error.value = data.message || 'Credenciales incorrectas'
    }
  } catch (e) {
    error.value = 'Error de conexión con el servidor'
  }
}
</script> 