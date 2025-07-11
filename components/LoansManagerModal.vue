<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-2xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded-full p-2">🏦</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Gestor de Préstamos</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Administra préstamos otorgados y recibidos</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total préstamos:</span>
                  <span class="font-semibold text-purple-600 dark:text-purple-400">{{ prestamos.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Activos:</span>
                  <span class="font-semibold text-purple-600 dark:text-purple-400">{{ activeLoans }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Finalizados:</span>
                  <span class="font-semibold text-green-600 dark:text-green-400">{{ finishedLoans }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total prestado:</span>
                  <span class="font-semibold text-purple-600 dark:text-purple-400">${{ formatAmount(totalLoansAmount) }}</span>
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
                  <option value="activo">Activos</option>
                  <option value="finalizado">Finalizados</option>
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
                <button @click="applyFilters" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  Aplicar Filtros
                </button>
                <button @click="clearFilters" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de préstamos -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <!-- Header de la lista -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Préstamos ({{ filteredLoans.length }})
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {{ filteredLoans.length }} de {{ prestamos.length }} préstamos
                </p>
              </div>
            </div>

            <!-- Lista de préstamos -->
            <div v-if="filteredLoans.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-500 dark:text-gray-400 text-lg">No se encontraron préstamos</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm">Intenta ajustar los filtros o crear un nuevo préstamo</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="prestamo in filteredLoans" :key="prestamo._id" 
                   class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                   @click="selectLoan(prestamo)">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                         :class="prestamo.estado === 'activo' ? 'bg-purple-200 dark:bg-purple-900' : 'bg-green-200 dark:bg-green-900'">
                      <span class="text-xl">
                        {{ prestamo.estado === 'activo' ? '🏦' : '✅' }}
                      </span>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900 dark:text-white">{{ prestamo.nombre }}</h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ prestamo.motivo }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        {{ prestamo.tipo === 'recibido' ? 'Recibido' : 'Otorgado' }} | 
                        Fecha: {{ formatDate(prestamo.fecha) }} | 
                        Tasa: {{ prestamo.tasa_interes }}%
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      ${{ formatAmount(prestamo.monto) }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Cuota: ${{ formatAmount(prestamo.valor_cuota) }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button @click.stop="editLoan(prestamo)" 
                              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        ✏️ Editar
                      </button>
                      <button @click.stop="deleteLoan(prestamo._id)" 
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
          :type="'loan'"
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
  prestamos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'refresh'])

// Estado de filtros
const filters = ref({
  status: '',
  tipo: '',
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
  const motivos = new Set(props.prestamos.map(p => p.motivo))
  return Array.from(motivos).sort()
})

const activeLoans = computed(() => {
  return props.prestamos.filter(p => p.estado === 'activo').length
})

const finishedLoans = computed(() => {
  return props.prestamos.filter(p => p.estado === 'finalizado').length
})

const totalLoansAmount = computed(() => {
  return props.prestamos
    .filter(p => p.estado === 'activo')
    .reduce((sum, p) => sum + (p.monto || 0), 0)
})

const filteredLoans = computed(() => {
  let filtered = [...props.prestamos]

  // Filtrar por estado
  if (filters.value.status) {
    filtered = filtered.filter(p => p.estado === filters.value.status)
  }

  // Filtrar por tipo
  if (filters.value.tipo) {
    filtered = filtered.filter(p => p.tipo === filters.value.tipo)
  }

  // Filtrar por motivo
  if (filters.value.motivo) {
    filtered = filtered.filter(p => p.motivo === filters.value.motivo)
  }

  // Filtrar por fecha desde
  if (filters.value.dateFrom) {
    filtered = filtered.filter(p => p.fecha >= filters.value.dateFrom)
  }

  // Filtrar por fecha hasta
  if (filters.value.dateTo) {
    filtered = filtered.filter(p => p.fecha <= filters.value.dateTo)
  }

  // Filtrar por monto mínimo
  if (filters.value.minAmount) {
    filtered = filtered.filter(p => p.monto >= Number(filters.value.minAmount))
  }

  // Filtrar por monto máximo
  if (filters.value.maxAmount) {
    filtered = filtered.filter(p => p.monto <= Number(filters.value.maxAmount))
  }

  // Ordenar por fecha (más recientes primero)
  return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
})

// Funciones
const applyFilters = () => {
  // Los filtros se aplican automáticamente por el computed
}

const clearFilters = () => {
  filters.value = {
    status: '',
    tipo: '',
    motivo: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  }
}

const selectLoan = (prestamo) => {
  // Aquí podrías abrir un modal de detalles
  console.log('Préstamo seleccionado:', prestamo)
}

const editLoan = (prestamo) => {
  if (confirm(`¿Estás seguro de que quieres editar el préstamo "${prestamo.nombre}"?\n\nMonto: $${formatAmount(prestamo.monto)}\nMotivo: ${prestamo.motivo}\nTipo: ${prestamo.tipo}\nEstado: ${prestamo.estado}`)) {
    selectedItem.value = { ...prestamo }
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedItem.value = null
}

const handleSaveEdit = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/prestamos/${selectedItem.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      emit('refresh')
      closeEditModal()
      alert('Préstamo actualizado correctamente')
    } else {
      const errorData = await response.json()
      alert(`Error al actualizar el préstamo: ${errorData.message || 'Error desconocido'}`)
    }
  } catch (error) {
    console.error('Error updating loan:', error)
    alert('Error al actualizar el préstamo')
  }
}

const deleteLoan = async (loanId) => {
  const prestamo = props.prestamos.find(p => p._id === loanId)
  if (prestamo) {
    const warningMessage = `⚠️ ADVERTENCIA ⚠️\n\n¿Estás seguro de que quieres ELIMINAR este préstamo?\n\n📝 Nombre: ${prestamo.nombre}\n💰 Monto: $${formatAmount(prestamo.monto)}\n📋 Motivo: ${prestamo.motivo}\n🏦 Tipo: ${prestamo.tipo}\n📊 Estado: ${prestamo.estado}\n📅 Fecha: ${formatDate(prestamo.fecha)}\n🔢 Número de cuotas: ${prestamo.numero_cuotas}\n💳 Valor de cuota: $${formatAmount(prestamo.valor_cuota)}\n\n❌ Esta acción NO se puede deshacer y eliminará permanentemente el registro.`
    
    if (confirm(warningMessage)) {
      try {
        const response = await fetch(`http://localhost:3000/api/prestamos/${loanId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          emit('refresh')
          alert('✅ Préstamo eliminado correctamente')
        } else {
          const errorData = await response.json()
          alert(`❌ Error al eliminar el préstamo: ${errorData.message || 'Error desconocido'}`)
        }
      } catch (error) {
        console.error('Error deleting loan:', error)
        alert('❌ Error al eliminar el préstamo')
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