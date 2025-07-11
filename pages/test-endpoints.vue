<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Test Endpoints</h1>
      
      <div class="space-y-6">
        <!-- Test Deudas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Test Deudas</h2>
          <div class="space-y-4">
            <button 
              @click="testDeudas"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cargar Deudas
            </button>
            <div v-if="deudasResult" class="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h3 class="font-medium mb-2">Resultado:</h3>
              <pre class="text-sm overflow-auto">{{ JSON.stringify(deudasResult, null, 2) }}</pre>
            </div>
          </div>
        </div>
        
        <!-- Test Préstamos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Test Préstamos</h2>
          <div class="space-y-4">
            <button 
              @click="testPrestamos"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Cargar Préstamos
            </button>
            <div v-if="prestamosResult" class="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h3 class="font-medium mb-2">Resultado:</h3>
              <pre class="text-sm overflow-auto">{{ JSON.stringify(prestamosResult, null, 2) }}</pre>
            </div>
          </div>
        </div>
        
        <!-- Test Base de Datos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Test Base de Datos</h2>
          <div class="space-y-4">
            <button 
              @click="testDatabase"
              class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Ver Estructura DB
            </button>
            <div v-if="dbResult" class="bg-gray-50 dark:bg-gray-700 p-4 rounded">
              <h3 class="font-medium mb-2">Estructura:</h3>
              <pre class="text-sm overflow-auto">{{ JSON.stringify(dbResult, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const deudasResult = ref(null)
const prestamosResult = ref(null)
const dbResult = ref(null)

const testDeudas = async () => {
  try {
    const response = await fetch('/api/deudas')
    const data = await response.json()
    deudasResult.value = data
    console.log('Deudas:', data)
  } catch (error) {
    console.error('Error testing deudas:', error)
    deudasResult.value = { error: error.message }
  }
}

const testPrestamos = async () => {
  try {
    const response = await fetch('/api/prestamos')
    const data = await response.json()
    prestamosResult.value = data
    console.log('Préstamos:', data)
  } catch (error) {
    console.error('Error testing prestamos:', error)
    prestamosResult.value = { error: error.message }
  }
}

const testDatabase = async () => {
  try {
    const response = await fetch('/api/clientes')
    const data = await response.json()
    dbResult.value = {
      cliente: data,
      deudas: data?.deudas || [],
      prestamos: data?.prestamos || []
    }
    console.log('Database structure:', data)
  } catch (error) {
    console.error('Error testing database:', error)
    dbResult.value = { error: error.message }
  }
}
</script> 