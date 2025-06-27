<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-2xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full p-2">💸</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Gestor de Transacciones</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Administra tus ingresos, gastos y transferencias</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <span class="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                  <span class="font-semibold">{{ transactions.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Ingresos:</span>
                  <span class="font-semibold text-green-600 dark:text-green-400">{{ incomeCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Gastos:</span>
                  <span class="font-semibold text-red-600 dark:text-red-400">{{ expenseCount }}</span>
                </div>
              </div>
            </div>

            <!-- Filtros -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900 dark:text-white">Filtros</h4>
              
              <!-- Tipo de transacción -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
                <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Todos</option>
                  <option value="ingreso">Ingresos</option>
                  <option value="gasto">Gastos</option>
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
                <button @click="applyFilters" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Aplicar Filtros
                </button>
                <button @click="clearFilters" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de transacciones -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <!-- Header de la lista -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Transacciones ({{ filteredTransactions.length }})
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {{ filteredTransactions.length }} de {{ transactions.length }} transacciones
                </p>
              </div>
            </div>

            <!-- Lista de transacciones -->
            <div v-if="filteredTransactions.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-gray-500 dark:text-gray-400 text-lg">No se encontraron transacciones</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm">Intenta ajustar los filtros o crear una nueva transacción</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="transaction in filteredTransactions" :key="transaction._id" 
                   class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                   @click="selectTransaction(transaction)">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                         :class="transaction.tipo === 'ingreso' ? 'bg-green-200 dark:bg-green-900' : 'bg-red-200 dark:bg-red-900'">
                      <span class="text-xl">
                        {{ transaction.tipo === 'ingreso' ? '💰' : '💸' }}
                      </span>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900 dark:text-white">{{ transaction.descripcion }}</h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ transaction.categoria }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(transaction.fecha) }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold" 
                       :class="transaction.tipo === 'ingreso' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ transaction.tipo === 'ingreso' ? '+' : '-' }}${{ formatAmount(transaction.monto) }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <button @click.stop="editTransaction(transaction)" 
                              class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        ✏️ Editar
                      </button>
                      <button @click.stop="deleteTransaction(transaction._id)" 
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
          :type="'transaction'"
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
  transactions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'refresh'])

// Estado de filtros
const filters = ref({
  type: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: ''
})

// Estado del modal de edición
const showEditModal = ref(false)
const selectedItem = ref(null)

// Computed properties
const categories = computed(() => {
  const cats = new Set(props.transactions.map(t => t.categoria))
  return Array.from(cats).sort()
})

const incomeCount = computed(() => {
  return props.transactions.filter(t => t.tipo === 'ingreso').length
})

const expenseCount = computed(() => {
  return props.transactions.filter(t => t.tipo === 'gasto').length
})

const filteredTransactions = computed(() => {
  let filtered = [...props.transactions]

  // Filtrar por tipo
  if (filters.value.type) {
    filtered = filtered.filter(t => t.tipo === filters.value.type)
  }

  // Filtrar por categoría
  if (filters.value.category) {
    filtered = filtered.filter(t => t.categoria === filters.value.category)
  }

  // Filtrar por fecha desde
  if (filters.value.dateFrom) {
    filtered = filtered.filter(t => t.fecha >= filters.value.dateFrom)
  }

  // Filtrar por fecha hasta
  if (filters.value.dateTo) {
    filtered = filtered.filter(t => t.fecha <= filters.value.dateTo)
  }

  // Filtrar por monto mínimo
  if (filters.value.minAmount) {
    filtered = filtered.filter(t => t.monto >= Number(filters.value.minAmount))
  }

  // Filtrar por monto máximo
  if (filters.value.maxAmount) {
    filtered = filtered.filter(t => t.monto <= Number(filters.value.maxAmount))
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
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  }
}

const selectTransaction = (transaction) => {
  // Aquí podrías abrir un modal de detalles
  console.log('Transacción seleccionada:', transaction)
}

const editTransaction = (transaction) => {
  if (confirm(`¿Estás seguro de que quieres editar la transacción "${transaction.descripcion}"?\n\nMonto: $${formatAmount(transaction.monto)}\nTipo: ${transaction.tipo}\nCategoría: ${transaction.categoria}`)) {
    selectedItem.value = { ...transaction }
    showEditModal.value = true
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedItem.value = null
}

const handleSaveEdit = async (updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/transactions/${selectedItem.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })

    if (response.ok) {
      emit('refresh')
      closeEditModal()
      alert('Transacción actualizada correctamente')
    } else {
      const errorData = await response.json()
      alert(`Error al actualizar la transacción: ${errorData.message || 'Error desconocido'}`)
    }
  } catch (error) {
    console.error('Error updating transaction:', error)
    alert('Error al actualizar la transacción')
  }
}

const deleteTransaction = async (transactionId) => {
  const transaction = props.transactions.find(t => t._id === transactionId)
  if (transaction) {
    const warningMessage = `⚠️ ADVERTENCIA ⚠️\n\n¿Estás seguro de que quieres ELIMINAR esta transacción?\n\n📝 Descripción: ${transaction.descripcion}\n💰 Monto: $${formatAmount(transaction.monto)}\n📊 Tipo: ${transaction.tipo}\n🏷️ Categoría: ${transaction.categoria}\n📅 Fecha: ${formatDate(transaction.fecha)}\n\n❌ Esta acción NO se puede deshacer y eliminará permanentemente el registro.`
    
    if (confirm(warningMessage)) {
      try {
        const response = await fetch(`http://localhost:3000/api/transactions/${transactionId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          emit('refresh')
          alert('✅ Transacción eliminada correctamente')
        } else {
          const errorData = await response.json()
          alert(`❌ Error al eliminar la transacción: ${errorData.message || 'Error desconocido'}`)
        }
      } catch (error) {
        console.error('Error deleting transaction:', error)
        alert('❌ Error al eliminar la transacción')
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