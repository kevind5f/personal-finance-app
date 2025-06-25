<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-400 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-lg w-full space-y-10">
            <div class="text-center">
                <div class="mx-auto h-20 w-20 bg-blue-600 dark:bg-blue-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <span class="text-4xl text-white font-bold">💰</span>
                </div>
                <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Finanzas Personales
                </h2>
                <p class="mt-3 text-lg text-gray-700 dark:text-gray-300">
                    Inicia sesión en tu cuenta
                </p>
            </div>
            
            <div class="bg-white dark:bg-gray-900 py-10 px-8 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800">
                <form class="space-y-8" @submit.prevent="handleLogin">
                    <div>
                        <label for="email" class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                        id="email"
                        v-model="email"
                        name="email"
                        type="email"
                        required
                        class="block w-full px-5 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white dark:bg-gray-800 shadow-sm"
                        placeholder="tu@email.com"
                        />
                    </div>
                    
                    <div>
                        <label for="password" class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contraseña
                        </label>
                        <input
                        id="password"
                        v-model="password"
                        name="password"
                        type="password"
                        required
                        class="block w-full px-5 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white dark:bg-gray-800 shadow-sm"
                        placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <button
                        type="submit"
                        :disabled="loading"
                        class="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-colors duration-200"
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
                                <p class="text-base text-red-700 dark:text-red-400">{{ error }}</p>
                            </div>
                        </div>
                    </div>
                </form>

                <!-- Credenciales de prueba -->
                <div class="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
                    <h3 class="text-base font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center justify-center gap-2">
                        <span class="text-xl">🔑</span> Credenciales de Prueba
                    </h3>
                    <div class="text-base text-blue-700 dark:text-blue-400 space-y-1">
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