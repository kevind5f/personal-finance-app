<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-2xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded-full p-2">📊</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Gestor de Presupuestos</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Administra presupuestos por categoría</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total presupuestos:</span>
                  <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ presupuestos.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Activos:</span>
                  <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ activeBudgets }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Inactivos:</span>
                  <span class="font-semibold text-gray-600 dark:text-gray-400">{{ inactiveBudgets }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total presupuesto:</span>
                  <span class="font-semibold text-indigo-600 dark:text-indigo-400">${{ formatAmount(totalBudgetAmount) }}</span>
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
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                <select v-model="filters.category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Todas</option>
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
              </div>

              <!-- Período -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Período</label>
                <select v-model="filters.period" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Todos</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
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
                <button @click="applyFilters" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Aplicar Filtros
                </button>
                <button @click="clearFilters" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de presupuestos -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <!-- Header de la lista -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Presupuestos ({{ filteredBudgets.length }})
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {{ filteredBudgets.length }} de {{ presupuestos.length }} presupuestos
                </p>
              </div>
            </div>

            <!-- Lista de presupuestos -->
            <div v-if="filteredBudgets.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-500 dark:text-gray-400 text-lg">No se encontraron presupuestos</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm">Intenta ajustar los filtros o crear un nuevo presupuesto</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="presupuesto in filteredBudgets" :key="presupuesto._id" 
                   class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                   @click="selectBudget(presupuesto)">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                         :class="presupuesto.activo ? 'bg-indigo-200 dark:bg-indigo-900' : 'bg-gray-200 dark:bg-gray-700'">
                      <span class="text-xl">
                        {{ presupuesto.activo ? '📊' : '⏸️' }}
                      </span>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900 dark:text-white">{{ presupuesto.nombre }}</h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ presupuesto.categoria }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        Período: {{ presupuesto.periodo }} | 
                        Inicio: {{ formatDate(presupuesto.fechaInicio) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      ${{ formatAmount(presupuesto.monto) }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Gastado: ${{ formatAmount(presupuesto.gastado || 0) }}
                    </p>
                    <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div class="bg-indigo-500 h-2 rounded-full" 
                           :style="{ width: `${Math.min(((presupuesto.gastado || 0) / presupuesto.monto) * 100, 100)}%` }"></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ Math.round(((presupuesto.gastado || 0) / presupuesto.monto) * 100) }}% usado
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button @click.stop="editBudget(presupuesto)" 
                              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        ✏️ Editar
                      </button>
                      <button @click.stop="deleteBudget(presupuesto._id)" 
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
          :type="'budget'"
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
  presupuestos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'refresh'])

// Estado de filtros
const filters = ref({
  status: '',
  category: '',
  period: '',
  minAmount: '',
  maxAmount: ''
})

// Estado del modal de edición
const showEditModal = ref(false)
const selectedItem = ref(null)

// Computed properties
const categories = computed(() => {
  const cats = new Set(props.presupuestos.map(p => p.categoria))
  return Array.from(cats).sort()
})

const activeBudgets = computed(() => {
  return props.presupuestos.filter(p => p.activo).length
})

const inactiveBudgets = computed(() => {
  return props.presupuestos.filter(p => !p.activo).length
})

const totalBudgetAmount = computed(() => {
  return props.presupuestos
    .filter(p => p.activo)
    .reduce((sum, p) => sum + (p.monto || 0), 0)
})

const filteredBudgets = computed(() => {
  let filtered = [...props.presupuestos]

  // Filtrar por estado
  if (filters.value.status) {
    if (filters.value.status === 'activo') {
      filtered = filtered.filter(p => p.activo)
    } else if (filters.value.status === 'inactivo') {
      filtered = filtered.filter(p => !p.activo)
    }
  }

  // Filtrar por categoría
  if (filters.value.category) {
    filtered = filtered.filter(p => p.categoria === filters.value.category)
  }

  // Filtrar por período
  if (filters.value.period) {
    filtered = filtered.filter(p => p.periodo === filters.value.period)
  }

  // Filtrar por monto mínimo
  if (filters.value.minAmount) {
    filtered = filtered.filter(p => p.monto >= Number(filters.value.minAmount))
  }

  // Filtrar por monto máximo
  if (filters.value.maxAmount) {
    filtered = filtered.filter(p => p.monto <= Number(filters.value.maxAmount))
  }

  // Ordenar por fecha de inicio (más recientes primero)
  return filtered.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio))
})

// Funciones
const applyFilters = () => {
  // Los filtros se aplican automáticamente por el computed
}

const clearFilters = () => {
  filters.value = {
    status: '',
    category: '',
    period: '',
    minAmount: '',
    maxAmount: ''
  }
}

const selectBudget = (presupuesto) => {
  // Aquí podrías abrir un modal de detalles
  console.log('Presupuesto seleccionado:', presupuesto)
}

const editBudget = (presupuesto) => {
  const usage = Math.round(((presupuesto.gastado || 0) / presupuesto.monto) * 100)
  if (confirm(`¿Estás seguro de que quieres editar el presupuesto "${presupuesto.nombre}"?\n\nMonto: $${formatAmount(presupuesto.monto)}\nGastado: $${formatAmount(presupuesto.gastado || 0)}\nUso: ${usage}%\nCategoría: ${presupuesto.categoria}`)) {
    selectedItem.value = { ...presupuesto }
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedItem.value = null
}

const handleSaveEdit = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/budgets/${selectedItem.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      emit('refresh')
      closeEditModal()
      alert('Presupuesto actualizado correctamente')
    } else {
      const errorData = await response.json()
      alert(`Error al actualizar el presupuesto: ${errorData.message || 'Error desconocido'}`)
    }
  } catch (error) {
    console.error('Error updating budget:', error)
    alert('Error al actualizar el presupuesto')
  }
}

const deleteBudget = async (budgetId) => {
  const presupuesto = props.presupuestos.find(p => p._id === budgetId)
  if (presupuesto) {
    const usage = Math.round(((presupuesto.gastado || 0) / presupuesto.monto) * 100)
    const warningMessage = `⚠️ ADVERTENCIA ⚠️\n\n¿Estás seguro de que quieres ELIMINAR este presupuesto?\n\n📊 Nombre: ${presupuesto.nombre}\n💰 Monto: $${formatAmount(presupuesto.monto)}\n💸 Gastado: $${formatAmount(presupuesto.gastado || 0)}\n📈 Uso: ${usage}%\n🏷️ Categoría: ${presupuesto.categoria}\n📅 Período: ${presupuesto.periodo}\n📅 Fecha de inicio: ${formatDate(presupuesto.fechaInicio)}\n📊 Estado: ${presupuesto.activo ? 'Activo' : 'Inactivo'}\n\n❌ Esta acción NO se puede deshacer y eliminará permanentemente el registro.`
    
    if (confirm(warningMessage)) {
      try {
        const response = await fetch(`http://localhost:3000/api/budgets/${budgetId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          emit('refresh')
          alert('✅ Presupuesto eliminado correctamente')
        } else {
          const errorData = await response.json()
          alert(`❌ Error al eliminar el presupuesto: ${errorData.message || 'Error desconocido'}`)
        }
      } catch (error) {
        console.error('Error deleting budget:', error)
        alert('❌ Error al eliminar el presupuesto')
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