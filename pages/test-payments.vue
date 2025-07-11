<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Test Pagos</h1>
      
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
        {{ error }}
      </div>
      
      <div v-else class="space-y-8">
        <!-- Deudas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Deudas</h2>
          <div class="space-y-4">
            <div v-for="deuda in deudas" :key="deuda._id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 class="font-semibold text-lg mb-2">{{ deuda.nombre }}</h3>
              <p class="text-gray-600 mb-2">{{ deuda.motivo }}</p>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-500">Monto Total</p>
                  <p class="font-semibold">S/{{ deuda.monto }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Valor Cuota</p>
                  <p class="font-semibold">S/{{ deuda.valor_cuota }}</p>
                </div>
              </div>
              
              <!-- Pagos -->
              <div class="mt-4">
                <h4 class="font-medium mb-2">Historial de Pagos ({{ deuda.payments?.length || 0 }})</h4>
                <div v-if="deuda.payments && deuda.payments.length > 0" class="space-y-2">
                  <div v-for="(pago, index) in deuda.payments" :key="index" class="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">{{ pago.fecha }}</span>
                      <span class="font-semibold text-green-600">S/{{ pago.monto }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-500 text-sm">No hay pagos registrados</div>
              </div>
              
              <!-- Formulario de pago -->
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 class="font-medium mb-2">Agregar Pago</h4>
                <div class="flex gap-2">
                  <input 
                    v-model="paymentForms[deuda._id].amount" 
                    type="number" 
                    placeholder="Monto" 
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  >
                  <input 
                    v-model="paymentForms[deuda._id].date" 
                    type="date" 
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  >
                  <button 
                    @click="addPayment('deuda', deuda._id)"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Préstamos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 class="text-xl font-semibold mb-4">Préstamos</h2>
          <div class="space-y-4">
            <div v-for="prestamo in prestamos" :key="prestamo._id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 class="font-semibold text-lg mb-2">{{ prestamo.nombre }}</h3>
              <p class="text-gray-600 mb-2">{{ prestamo.motivo }}</p>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-500">Monto Total</p>
                  <p class="font-semibold">S/{{ prestamo.monto }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Valor Cuota</p>
                  <p class="font-semibold">S/{{ prestamo.valor_cuota }}</p>
                </div>
              </div>
              
              <!-- Pagos -->
              <div class="mt-4">
                <h4 class="font-medium mb-2">Historial de Pagos ({{ prestamo.payments?.length || 0 }})</h4>
                <div v-if="prestamo.payments && prestamo.payments.length > 0" class="space-y-2">
                  <div v-for="(pago, index) in prestamo.payments" :key="index" class="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">{{ pago.fecha }}</span>
                      <span class="font-semibold text-green-600">S/{{ pago.monto }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-500 text-sm">No hay pagos registrados</div>
              </div>
              
              <!-- Formulario de pago -->
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 class="font-medium mb-2">Agregar Pago</h4>
                <div class="flex gap-2">
                  <input 
                    v-model="paymentForms[prestamo._id].amount" 
                    type="number" 
                    placeholder="Monto" 
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  >
                  <input 
                    v-model="paymentForms[prestamo._id].date" 
                    type="date" 
                    class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                  >
                  <button 
                    @click="addPayment('prestamo', prestamo._id)"
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Agregar
                  </button>
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
const deudas = ref([])
const prestamos = ref([])
const paymentForms = ref({})

const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Cargar deudas
    const deudasResponse = await fetch('/api/deudas')
    const deudasData = await deudasResponse.json()
    deudas.value = Array.isArray(deudasData) ? deudasData : []
    
    // Cargar préstamos
    const prestamosResponse = await fetch('/api/prestamos')
    const prestamosData = await prestamosResponse.json()
    prestamos.value = Array.isArray(prestamosData) ? prestamosData : []
    
    // Inicializar formularios de pago
    deudas.value.forEach(deuda => {
      paymentForms.value[deuda._id] = { amount: '', date: new Date().toISOString().substr(0, 10) }
    })
    prestamos.value.forEach(prestamo => {
      paymentForms.value[prestamo._id] = { amount: '', date: new Date().toISOString().substr(0, 10) }
    })
    
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = err.message || 'Error al cargar los datos'
  } finally {
    isLoading.value = false
  }
}

const addPayment = async (type, id) => {
  try {
    const form = paymentForms.value[id]
    if (!form.amount || !form.date) {
      alert('Por favor completa todos los campos')
      return
    }
    
    const endpoint = type === 'deuda' ? 'deudas' : 'prestamos'
    const idParam = type === 'deuda' ? 'deudaId' : 'prestamoId'
    
    const response = await fetch(`/api/${endpoint}?${idParam}=${id}&accion=addPayment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Number(form.amount),
        date: form.date
      })
    })
    
    if (response.ok) {
      // Recargar datos
      await loadData()
      alert('Pago agregado exitosamente')
    } else {
      const errorData = await response.json()
      alert(`Error: ${errorData.error || 'Error al agregar el pago'}`)
    }
  } catch (err) {
    console.error('Error adding payment:', err)
    alert('Error al agregar el pago')
  }
}

onMounted(() => {
  loadData()
})
</script> 