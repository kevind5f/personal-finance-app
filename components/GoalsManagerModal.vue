<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-2xl bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-full p-2">🎯</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Gestor de Metas</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Administra tus metas de ahorro e inversión</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total metas:</span>
                  <span class="font-semibold text-yellow-600 dark:text-yellow-400">{{ metas.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Activas:</span>
                  <span class="font-semibold text-yellow-600 dark:text-yellow-400">{{ activeGoals }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Completadas:</span>
                  <span class="font-semibold text-green-600 dark:text-green-400">{{ completedGoals }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Progreso total:</span>
                  <span class="font-semibold text-yellow-600 dark:text-yellow-400">{{ goalsProgress }}%</span>
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
                  <option value="completada">Completadas</option>
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

              <!-- Rango de fechas -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha desde</label>
                <input v-model="filters.dateFrom" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha hasta</label>
                <input v-model="filters.dateTo" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <!-- Rango de monto objetivo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto objetivo mínimo</label>
                <input v-model="filters.minTarget" type="number" placeholder="0" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto objetivo máximo</label>
                <input v-model="filters.maxTarget" type="number" placeholder="999999" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              </div>

              <!-- Botones de filtro -->
              <div class="space-y-2">
                <button @click="applyFilters" class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                  Aplicar Filtros
                </button>
                <button @click="clearFilters" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de metas -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <!-- Header de la lista -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Metas ({{ filteredGoals.length }})
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {{ filteredGoals.length }} de {{ metas.length }} metas
                </p>
              </div>
            </div>

            <!-- Lista de metas -->
            <div v-if="filteredGoals.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-500 dark:text-gray-400 text-lg">No se encontraron metas</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm">Intenta ajustar los filtros o crear una nueva meta</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="meta in filteredGoals" :key="meta._id" 
                   class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                   @click="selectGoal(meta)">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                         :class="meta.montoActual >= meta.montoObjetivo ? 'bg-green-200 dark:bg-green-900' : 'bg-yellow-200 dark:bg-yellow-900'">
                      <span class="text-xl">
                        {{ meta.montoActual >= meta.montoObjetivo ? '🎉' : '🎯' }}
                      </span>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900 dark:text-white">{{ meta.nombre }}</h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ meta.categoria }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        Fecha objetivo: {{ formatDate(meta.fechaObjetivo) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      ${{ formatAmount(meta.montoActual) }} / ${{ formatAmount(meta.montoObjetivo) }}
                    </p>
                    <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div class="bg-yellow-500 h-2 rounded-full" 
                           :style="{ width: `${Math.min((meta.montoActual / meta.montoObjetivo) * 100, 100)}%` }"></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ Math.round((meta.montoActual / meta.montoObjetivo) * 100) }}% completado
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button @click.stop="editGoal(meta)" 
                              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        ✏️ Editar
                      </button>
                      <button @click.stop="deleteGoal(meta._id)" 
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
          :type="'goal'"
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
  metas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'refresh'])

// Estado de filtros
const filters = ref({
  status: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  minTarget: '',
  maxTarget: ''
})

// Estado del modal de edición
const showEditModal = ref(false)
const selectedItem = ref(null)

// Computed properties
const categories = computed(() => {
  const cats = new Set(props.metas.map(m => m.categoria))
  return Array.from(cats).sort()
})

const activeGoals = computed(() => {
  return props.metas.filter(m => m.montoActual < m.montoObjetivo).length
})

const completedGoals = computed(() => {
  return props.metas.filter(m => m.montoActual >= m.montoObjetivo).length
})

const goalsProgress = computed(() => {
  if (props.metas.length === 0) return 0
  const totalCurrent = props.metas.reduce((sum, m) => sum + (m.montoActual || 0), 0)
  const totalTarget = props.metas.reduce((sum, m) => sum + (m.montoObjetivo || 0), 0)
  return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
})

const filteredGoals = computed(() => {
  let filtered = [...props.metas]

  // Filtrar por estado
  if (filters.value.status) {
    if (filters.value.status === 'activa') {
      filtered = filtered.filter(m => m.montoActual < m.montoObjetivo)
    } else if (filters.value.status === 'completada') {
      filtered = filtered.filter(m => m.montoActual >= m.montoObjetivo)
    }
  }

  // Filtrar por categoría
  if (filters.value.category) {
    filtered = filtered.filter(m => m.categoria === filters.value.category)
  }

  // Filtrar por fecha desde
  if (filters.value.dateFrom) {
    filtered = filtered.filter(m => m.fechaObjetivo >= filters.value.dateFrom)
  }

  // Filtrar por fecha hasta
  if (filters.value.dateTo) {
    filtered = filtered.filter(m => m.fechaObjetivo <= filters.value.dateTo)
  }

  // Filtrar por monto objetivo mínimo
  if (filters.value.minTarget) {
    filtered = filtered.filter(m => m.montoObjetivo >= Number(filters.value.minTarget))
  }

  // Filtrar por monto objetivo máximo
  if (filters.value.maxTarget) {
    filtered = filtered.filter(m => m.montoObjetivo <= Number(filters.value.maxTarget))
  }

  // Ordenar por fecha objetivo (más próximas primero)
  return filtered.sort((a, b) => new Date(a.fechaObjetivo) - new Date(b.fechaObjetivo))
})

// Funciones
const applyFilters = () => {
  // Los filtros se aplican automáticamente por el computed
}

const clearFilters = () => {
  filters.value = {
    status: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    minTarget: '',
    maxTarget: ''
  }
}

const selectGoal = (meta) => {
  // Aquí podrías abrir un modal de detalles
  console.log('Meta seleccionada:', meta)
}

const editGoal = (meta) => {
  const progress = Math.round((meta.montoActual / meta.montoObjetivo) * 100)
  if (confirm(`¿Estás seguro de que quieres editar la meta "${meta.nombre}"?\n\nObjetivo: $${formatAmount(meta.montoObjetivo)}\nActual: $${formatAmount(meta.montoActual)}\nProgreso: ${progress}%\nCategoría: ${meta.categoria}`)) {
    selectedItem.value = { ...meta }
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedItem.value = null
}

const handleSaveEdit = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/goals/${selectedItem.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      emit('refresh')
      closeEditModal()
      alert('Meta actualizada correctamente')
    } else {
      const errorData = await response.json()
      alert(`Error al actualizar la meta: ${errorData.message || 'Error desconocido'}`)
    }
  } catch (error) {
    console.error('Error updating goal:', error)
    alert('Error al actualizar la meta')
  }
}

const deleteGoal = async (goalId) => {
  const meta = props.metas.find(m => m._id === goalId)
  if (meta) {
    const progress = Math.round((meta.montoActual / meta.montoObjetivo) * 100)
    const warningMessage = `⚠️ ADVERTENCIA ⚠️\n\n¿Estás seguro de que quieres ELIMINAR esta meta?\n\n🎯 Nombre: ${meta.nombre}\n💰 Objetivo: $${formatAmount(meta.montoObjetivo)}\n💵 Actual: $${formatAmount(meta.montoActual)}\n📊 Progreso: ${progress}%\n🏷️ Categoría: ${meta.categoria}\n📅 Fecha objetivo: ${formatDate(meta.fechaObjetivo)}\n📝 Descripción: ${meta.descripcion || 'Sin descripción'}\n\n❌ Esta acción NO se puede deshacer y eliminará permanentemente el registro.`
    
    if (confirm(warningMessage)) {
      try {
        const response = await fetch(`http://localhost:3000/api/goals/${goalId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          emit('refresh')
          alert('✅ Meta eliminada correctamente')
        } else {
          const errorData = await response.json()
          alert(`❌ Error al eliminar la meta: ${errorData.message || 'Error desconocido'}`)
        }
      } catch (error) {
        console.error('Error deleting goal:', error)
        alert('❌ Error al eliminar la meta')
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