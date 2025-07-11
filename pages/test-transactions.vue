<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Test Transacciones</h1>
      
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
        {{ error }}
      </div>
      
      <div v-else class="space-y-8">
        <!-- Resumen -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Resumen</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ data.totalTransacciones }}</p>
              <p class="text-gray-600">Total Transacciones</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ data.totalCuentas }}</p>
              <p class="text-gray-600">Total Cuentas</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600">{{ data.transacciones.length }}</p>
              <p class="text-gray-600">Transacciones Cargadas</p>
            </div>
          </div>
        </div>
        
        <!-- Transacciones por Cuenta -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Transacciones por Cuenta</h2>
          <div class="space-y-4">
            <div v-for="item in data.transaccionesPorCuenta" :key="item.cuenta._id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 class="font-semibold text-lg mb-2">{{ item.cuenta.nombre }} ({{ item.cuenta.tipo }})</h3>
              <p class="text-gray-600 mb-2">ID: {{ item.cuenta._id }} | Saldo: S/{{ item.cuenta.saldo }}</p>
              <p class="text-sm text-gray-500 mb-3">{{ item.transacciones.length }} transacciones</p>
              
              <div v-if="item.transacciones.length > 0" class="space-y-2">
                <div v-for="trans in item.transacciones.slice(0, 3)" :key="trans._id" class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-medium">{{ trans.descripcion }}</p>
                      <p class="text-sm text-gray-600">{{ trans.categoria }} - {{ trans.fecha }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold" :class="trans.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'">
                        {{ trans.tipo === 'ingreso' ? '+' : '-' }}S/{{ trans.monto }}
                      </p>
                      <p class="text-xs text-gray-500">ID: {{ trans._id }}</p>
                    </div>
                  </div>
                </div>
                <p v-if="item.transacciones.length > 3" class="text-sm text-gray-500 text-center">
                  ... y {{ item.transacciones.length - 3 }} más
                </p>
              </div>
              
              <div v-else class="text-gray-500 text-center py-4">
                No hay transacciones en esta cuenta
              </div>
            </div>
          </div>
        </div>
        
        <!-- Todas las Transacciones -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Todas las Transacciones</h2>
          <div class="space-y-2">
            <div v-for="trans in data.transacciones" :key="trans._id" class="border border-gray-200 dark:border-gray-700 p-3 rounded">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ trans.descripcion }}</p>
                  <p class="text-sm text-gray-600">{{ trans.categoria }} - {{ trans.fecha }}</p>
                  <p class="text-xs text-gray-500">Cuenta ID: {{ trans.cuentaId }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold" :class="trans.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'">
                    {{ trans.tipo === 'ingreso' ? '+' : '-' }}S/{{ trans.monto }}
                  </p>
                  <p class="text-xs text-gray-500">{{ trans.tipo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const error = ref(null)
const data = ref({
  transacciones: [],
  cuentas: [],
  totalTransacciones: 0,
  totalCuentas: 0,
  transaccionesPorCuenta: []
})

const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await fetch('/api/test-transactions')
    const result = await response.json()
    
    if (result.error) {
      throw new Error(result.error)
    }
    
    data.value = result
  } catch (err) {
    console.error('Error loading test data:', err)
    error.value = err.message || 'Error al cargar los datos'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script> 