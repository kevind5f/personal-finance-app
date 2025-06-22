<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <div class="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <span class="text-2xl text-white font-bold">💰</span>
                </div>
                <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Finanzas Personales
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Inicia sesión en tu cuenta
                </p>
            </div>
            
            <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
                <form class="space-y-6" @submit.prevent="handleLogin">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                        id="email"
                        v-model="email"
                        name="email"
                        type="email"
                        required
                        class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700"
                        placeholder="tu@email.com"
                        />
                    </div>
                    
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contraseña
                        </label>
                        <input
                        id="password"
                        v-model="password"
                        name="password"
                        type="password"
                        required
                        class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700"
                        placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <button
                        type="submit"
                        :disabled="loading"
                        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <span v-if="loading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </span>
                            <span v-else>Iniciar sesión</span>
                        </button>
                    </div>

                    <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
                            </div>
                        </div>
                    </div>
                </form>

                <!-- Credenciales de prueba -->
                <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                        🔑 Credenciales de Prueba
                    </h3>
                    <div class="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                        <p><strong>Email:</strong> test@example.com</p>
                        <p><strong>Contraseña:</strong> password123</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $auth } = useNuxtApp()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        error.value = ''

        console.log('Attempting login with:', { email: email.value })

        const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
        })

        const data = await response.json()
        console.log('Login response:', data)

        if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión')
        }

        // Guardar el token
        $auth.setToken(data.token)
        console.log('Token saved:', data.token)

        // Redirigir al dashboard
        router.push('/dashboard')
    } catch (err) {
        console.error('Login error:', err)
        error.value = err.message || 'Error al iniciar sesión'
    } finally {
        loading.value = false
    }
}
</script> 