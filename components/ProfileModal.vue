<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full p-2">👤</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Perfil del Cliente</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Información personal y financiera</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >✕</button>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline">{{ error }}</span>
        </div>
        
        <div v-else-if="cliente" class="space-y-8">
          <!-- Información Personal -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>👤</span> Información Personal
            </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nombre Completo</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.nombre }} {{ cliente.apellido }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">DNI</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.dni }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Edad</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.edad }} años</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Teléfono</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.telefono }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Dirección</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.direccion }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Profesión</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.profesion }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Empresa</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.empresa }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Salario Mensual</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ currencySymbol }} {{ formatAmount(cliente.salario_mensual) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Estado Civil</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.estado_civil }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Hijos</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.hijos }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nivel Educativo</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.nivel_educativo }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha de Registro</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(cliente.fecha_registro) }}</p>
              </div>
            </div>
          </div>

          <!-- Resumen Financiero -->
          <div class="bg-green-50 dark:bg-green-900 rounded-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>💰</span> Resumen Financiero
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Cuentas</label>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ cliente.cuentas.length }}</p>
              </div>
              <div class="text-center">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Ingresos</label>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ cliente.ingresos.length }}</p>
              </div>
              <div class="text-center">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Gastos</label>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ cliente.gastos.length }}</p>
              </div>
            </div>
          </div>

          <!-- Cuentas -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🏦</span> Cuentas ({{ cliente.cuentas.length }})
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="cuenta in cliente.cuentas" :key="cuenta._id" 
                   class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-start mb-2">
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ cuenta.nombre }}</h5>
                  <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {{ cuenta.tipo }}
                  </span>
                </div>
                <p class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {{ currencySymbol }} {{ formatAmount(cuenta.saldo) }}
                </p>
                <div v-if="cuenta.banco" class="text-sm text-gray-600 dark:text-gray-400">
                  <p>{{ cuenta.banco }}</p>
                  <p>{{ cuenta.numero_cuenta }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Metas de Ahorro -->
          <div class="bg-yellow-50 dark:bg-yellow-900 rounded-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Metas de Ahorro ({{ cliente.metas.length }})
            </h4>
            <div class="space-y-4">
              <div v-for="meta in cliente.metas" :key="meta._id" 
                   class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="flex justify-between items-start mb-2">
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ meta.nombre }}</h5>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(meta.fecha_objetivo) }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ meta.descripcion }}</p>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-2">
                  <div class="bg-yellow-600 h-2.5 rounded-full"
                       :style="{ width: ((meta.monto_actual / meta.monto_objetivo) * 100) + '%' }"></div>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-yellow-700 dark:text-yellow-300">{{ currencySymbol }} {{ formatAmount(meta.monto_actual) }}</span>
                  <span class="text-gray-500 dark:text-gray-400">Meta: {{ currencySymbol }} {{ formatAmount(meta.monto_objetivo) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Préstamos y Deudas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Préstamos -->
            <div class="bg-blue-50 dark:bg-blue-900 rounded-xl p-6">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🏦</span> Préstamos ({{ cliente.prestamos.length }})
              </h4>
              <div class="space-y-3">
                <div v-for="prestamo in cliente.prestamos" :key="prestamo._id" 
                     class="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ prestamo.nombre }}</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ prestamo.motivo }}</p>
                  <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ currencySymbol }} {{ formatAmount(prestamo.monto) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ prestamo.numero_cuotas }} cuotas de {{ currencySymbol }} {{ formatAmount(prestamo.valor_cuota) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Deudas -->
            <div class="bg-red-50 dark:bg-red-900 rounded-xl p-6">
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📝</span> Deudas ({{ cliente.deudas.length }})
              </h4>
              <div class="space-y-3">
                <div v-for="deuda in cliente.deudas" :key="deuda._id" 
                     class="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ deuda.nombre }}</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ deuda.motivo }}</p>
                  <p class="text-lg font-bold text-red-600 dark:text-red-400">{{ currencySymbol }} {{ formatAmount(deuda.monto) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ deuda.numero_cuotas }} cuotas de {{ currencySymbol }} {{ formatAmount(deuda.valor_cuota) }}
                  </p>
                </div>
              </div>
          </div>
        </div>

          <!-- Configuraciones -->
          <div class="bg-purple-50 dark:bg-purple-900 rounded-xl p-6">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>⚙️</span> Configuraciones
            </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Moneda Principal</label>
                <select
                  v-model="selectedCurrency"
                  @change="updateCurrency"
                  class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2"
                  :disabled="isUpdatingCurrency"
                >
                  <option value="PEN">PEN - Sol peruano</option>
                  <option value="USD">USD - Dólar estadounidense</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
                <p v-if="currencyUpdateSuccess" class="text-green-600 text-xs mt-1">Moneda actualizada correctamente</p>
                <p v-if="currencyUpdateError" class="text-red-600 text-xs mt-1">Error al actualizar la moneda</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Idioma</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.configuraciones.idioma }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tema</label>
                <p class="text-gray-900 dark:text-white font-medium capitalize">{{ cliente.configuraciones.tema }}</p>
          </div>
          <div>
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Notificaciones</label>
                <p class="text-gray-900 dark:text-white font-medium">{{ cliente.configuraciones.notificaciones ? 'Activadas' : 'Desactivadas' }}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

// Estado del componente
const cliente = ref(null)
const isLoading = ref(false)
const error = ref(null)
const selectedCurrency = ref('')
const isUpdatingCurrency = ref(false)
const currencyUpdateSuccess = ref(false)
const currencyUpdateError = ref(false)

// Función para cargar los datos del cliente
const loadClienteData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await fetch('http://localhost:3000/api/clientes')
    if (!response.ok) {
      throw new Error('Error al cargar los datos del cliente')
    }
    
    const data = await response.json()
    cliente.value = data
  } catch (err) {
    console.error('Error loading client data:', err)
    error.value = err.message || 'Error al cargar los datos del cliente'
  } finally {
    isLoading.value = false
  }
}

// Función para formatear montos
const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00'
  const num = Number(amount)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Cargar datos cuando se abre el modal
onMounted(() => {
  if (props.isOpen) {
    loadClienteData()
  }
})

// Observar cambios en isOpen para cargar datos
import { watch } from 'vue'
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    loadClienteData()
  }
})

watch(
  () => cliente.value?.configuraciones?.moneda_principal,
  (newVal) => {
    if (newVal) selectedCurrency.value = newVal
  },
  { immediate: true }
)

const updateCurrency = async () => {
  isUpdatingCurrency.value = true
  currencyUpdateSuccess.value = false
  currencyUpdateError.value = false
  try {
    const res = await fetch('http://localhost:3000/api/clientes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moneda_principal: selectedCurrency.value })
    })
    const data = await res.json()
    if (data.success) {
      currencyUpdateSuccess.value = true
      if (cliente.value?.configuraciones) {
        cliente.value.configuraciones.moneda_principal = selectedCurrency.value
      }
    } else {
      currencyUpdateError.value = true
    }
  } catch (e) {
    currencyUpdateError.value = true
  } finally {
    isUpdatingCurrency.value = false
    setTimeout(() => {
      currencyUpdateSuccess.value = false
      currencyUpdateError.value = false
    }, 2000)
  }
}

const currencyCode = computed(() => selectedCurrency.value || cliente.value?.configuraciones?.moneda_principal || 'PEN')
const currencySymbol = computed(() => {
  switch (currencyCode.value) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'PEN': default: return 'S/';
  }
})
</script> 