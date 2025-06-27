<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-2xl bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-full p-2">📝</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Gestor de Deudas</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Administra tus deudas y pagos pendientes</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
        >✕</button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Sidebar con filtros -->
        <div class="w-80 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div class="space-y-6">
            <!-- Estadísticas -->
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Estadísticas</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total deudas:</span>
                  <span class="font-semibold text-red-600 dark:text-red-400">{{ deudas.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Activas:</span>
                  <span class="font-semibold text-red-600 dark:text-red-400">{{ activeDebts }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Finalizadas:</span>
                  <span class="font-semibold text-green-600 dark:text-green-400">{{ finishedDebts }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total adeudado:</span>
                  <span class="font-semibold text-red-600 dark:text-red-400">${{ formatAmount(totalDebtAmount) }}</span>
                </div>
              </div>
            </div>

            <!-- Filtros -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900 dark:text-white">Filtros</h4>
              
              <!-- Estado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Todos</option>
                  <option value="activa">Activas</option>
                  <option value="finalizada">Finalizadas</option>
                </select>
              </div>

              <!-- Motivo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motivo</label>
                <select v-model="filters.motivo" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Todos</option>
                  <option v-for="motivo in motivos" :key="motivo" :value="motivo">{{ motivo }}</option>
                </select>
              </div>

              <!-- Rango de fechas -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha desde</label>
                <input v-model="filters.dateFrom" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha hasta</label>
                <input v-model="filters.dateTo" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <!-- Rango de monto -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto mínimo</label>
                <input v-model="filters.minAmount" type="number" placeholder="0" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto máximo</label>
                <input v-model="filters.maxAmount" type="number" placeholder="999999" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <!-- Botones de filtro -->
              <div class="space-y-2">
                <button @click="applyFilters" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Aplicar Filtros
                </button>
                <button @click="clearFilters" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de deudas -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <!-- Header de la lista -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Deudas ({{ filteredDebts.length }})
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {{ filteredDebts.length }} de {{ deudas.length }} deudas
                </p>
              </div>
            </div>

            <!-- Lista de deudas -->
            <div v-if="filteredDebts.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-500 dark:text-gray-400 text-lg">No se encontraron deudas</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm">Intenta ajustar los filtros o crear una nueva deuda</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="deuda in filteredDebts" :key="deuda._id" 
                   class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                   @click="selectDebt(deuda)">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                         :class="deuda.estado === 'activa' ? 'bg-red-200 dark:bg-red-900' : 'bg-green-200 dark:bg-green-900'">
                      <span class="text-xl">
                        {{ deuda.estado === 'activa' ? '📝' : '✅' }}
                      </span>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900 dark:text-white">{{ deuda.nombre }}</h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ deuda.motivo }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        Adquirida: {{ formatDate(deuda.fecha_adquisicion) }} | 
                        Cuotas: {{ deuda.numero_cuotas }} | 
                        Tasa: {{ deuda.tasa_interes }}%
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-red-600 dark:text-red-400">
                      ${{ formatAmount(deuda.monto) }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Cuota: ${{ formatAmount(deuda.valor_cuota) }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button @click.stop="editDebt(deuda)" 
                              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        ✏️ Editar
                      </button>
                      <button @click.stop="deleteDebt(deuda._id)" 
                              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modales -->
      <ClientOnly>
        <!-- Modal de Edición -->
        <EditModal
          v-if="showEditModal"
          :is-open="showEditModal"
          :type="'debt'"
          :data="selectedItem"
          @close="closeEditModal"
          @save="handleSaveEdit"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import EditModal from './EditModal.vue'

const props = defineProps({
  isOpen: Boolean,
  deudas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'refresh'])

// Estado de filtros
const filters = ref({
  status: '',
  motivo: '',
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: ''
})

// Estado del modal de edición
const showEditModal = ref(false)
const selectedItem = ref(null)

// Computed properties
const motivos = computed(() => {
  const motivos = new Set(props.deudas.map(d => d.motivo))
  return Array.from(motivos).sort()
})

const activeDebts = computed(() => {
  return props.deudas.filter(d => d.estado === 'activa').length
})

const finishedDebts = computed(() => {
  return props.deudas.filter(d => d.estado === 'finalizada').length
})

const totalDebtAmount = computed(() => {
  return props.deudas
    .filter(d => d.estado === 'activa')
    .reduce((sum, d) => sum + (d.monto || 0), 0)
})

const filteredDebts = computed(() => {
  let filtered = [...props.deudas]

  // Filtrar por estado
  if (filters.value.status) {
    filtered = filtered.filter(d => d.estado === filters.value.status)
  }

  // Filtrar por motivo
  if (filters.value.motivo) {
    filtered = filtered.filter(d => d.motivo === filters.value.motivo)
  }

  // Filtrar por fecha desde
  if (filters.value.dateFrom) {
    filtered = filtered.filter(d => d.fecha_adquisicion >= filters.value.dateFrom)
  }

  // Filtrar por fecha hasta
  if (filters.value.dateTo) {
    filtered = filtered.filter(d => d.fecha_adquisicion <= filters.value.dateTo)
  }

  // Filtrar por monto mínimo
  if (filters.value.minAmount) {
    filtered = filtered.filter(d => d.monto >= Number(filters.value.minAmount))
  }

  // Filtrar por monto máximo
  if (filters.value.maxAmount) {
    filtered = filtered.filter(d => d.monto <= Number(filters.value.maxAmount))
  }

  // Ordenar por fecha (más recientes primero)
  return filtered.sort((a, b) => new Date(b.fecha_adquisicion) - new Date(a.fecha_adquisicion))
})

// Funciones
const applyFilters = () => {
  // Los filtros se aplican automáticamente por el computed
}

const clearFilters = () => {
  filters.value = {
    status: '',
    motivo: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  }
}

const selectDebt = (deuda) => {
  // Aquí podrías abrir un modal de detalles
  console.log('Deuda seleccionada:', deuda)
}

const editDebt = (deuda) => {
  if (confirm(`¿Estás seguro de que quieres editar la deuda "${deuda.nombre}"?\n\nMonto: $${formatAmount(deuda.monto)}\nMotivo: ${deuda.motivo}\nEstado: ${deuda.estado}\nCuotas: ${deuda.numero_cuotas}`)) {
    selectedItem.value = { ...deuda }
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedItem.value = null
}

const handleSaveEdit = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/deudas/${selectedItem.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      emit('refresh')
      closeEditModal()
      alert('Deuda actualizada correctamente')
    } else {
      const errorData = await response.json()
      alert(`Error al actualizar la deuda: ${errorData.message || 'Error desconocido'}`)
    }
  } catch (error) {
    console.error('Error updating debt:', error)
    alert('Error al actualizar la deuda')
  }
}

const deleteDebt = async (debtId) => {
  const deuda = props.deudas.find(d => d._id === debtId)
  if (deuda) {
    const warningMessage = `⚠️ ADVERTENCIA ⚠️\n\n¿Estás seguro de que quieres ELIMINAR esta deuda?\n\n📝 Nombre: ${deuda.nombre}\n💰 Monto: $${formatAmount(deuda.monto)}\n📋 Motivo: ${deuda.motivo}\n📊 Estado: ${deuda.estado}\n📅 Fecha de adquisición: ${formatDate(deuda.fecha_adquisicion)}\n🔢 Número de cuotas: ${deuda.numero_cuotas}\n💳 Valor de cuota: $${formatAmount(deuda.valor_cuota)}\n\n❌ Esta acción NO se puede deshacer y eliminará permanentemente el registro.`
    
    if (confirm(warningMessage)) {
      try {
        const response = await fetch(`http://localhost:3000/api/deudas/${debtId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          emit('refresh')
          alert('✅ Deuda eliminada correctamente')
        } else {
          const errorData = await response.json()
          alert(`❌ Error al eliminar la deuda: ${errorData.message || 'Error desconocido'}`)
        }
      } catch (error) {
        console.error('Error deleting debt:', error)
        alert('❌ Error al eliminar la deuda')
      }
    }
  }
}

const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00'
  const num = Number(amount)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Limpiar filtros cuando se cierra el modal
watch(() => props.isOpen, (newValue) => {
  if (!newValue) {
    clearFilters()
  }
})
</script> 