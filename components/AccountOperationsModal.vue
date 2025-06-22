<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Últimas Operaciones
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ account?.name }} - {{ account?.type }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div class="px-6 py-4">
        <!-- Información de la cuenta -->
        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex justify-between items-center">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">{{ account?.name }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ account?.type }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold" :class="account?.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                ${{ formatAmount(account?.balance) }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ account?.balance >= 0 ? 'Disponible' : 'Deuda' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="mb-4 flex flex-wrap gap-2">
          <button
            @click="filterType = 'all'"
            :class="filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
            class="px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
          >
            Todas
          </button>
          <button
            @click="filterType = 'income'"
            :class="filterType === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
            class="px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600 hover:text-white transition-colors"
          >
            Ingresos
          </button>
          <button
            @click="filterType = 'expense'"
            :class="filterType === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
            class="px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
          >
            Gastos
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Transacciones -->
        <div v-else>
          <div v-if="filteredTransactions.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">
              {{ filterType === 'all' ? 'No hay operaciones en esta cuenta' : `No hay ${filterType === 'income' ? 'ingresos' : 'gastos'} en esta cuenta` }}
            </p>
          </div>
          
          <div v-else class="space-y-3">
            <div v-for="transaction in filteredTransactions" :key="transaction._id" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                     :class="transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'">
                  <span class="text-lg">
                    {{ transaction.type === 'income' ? '💰' : '💸' }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ transaction.description }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ transaction.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold" :class="transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ transaction.type === 'income' ? '+' : '-' }}${{ formatAmount(transaction.amount) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(transaction.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  account: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const isLoading = ref(false)
const error = ref(null)
const transactions = ref([])
const filterType = ref('all')

// Función de utilidad para formatear montos
const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00'
  const num = Number(amount)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Filtrar transacciones
const filteredTransactions = computed(() => {
  if (filterType.value === 'all') {
    return transactions.value
  }
  return transactions.value.filter(transaction => transaction.type === filterType.value)
})

// Cargar transacciones de la cuenta
const loadAccountTransactions = async () => {
  if (!props.account?._id) return
  
  try {
    isLoading.value = true
    error.value = null
    
    const response = await fetch(`http://localhost:3000/api/transactions?accountId=${props.account._id}&limit=20`)
    const data = await response.json()
    
    if (response.ok) {
      transactions.value = Array.isArray(data) ? data : []
    } else {
      throw new Error(data.message || 'Error al cargar las transacciones')
    }
  } catch (err) {
    console.error('Error loading account transactions:', err)
    error.value = err.message || 'Error al cargar las transacciones'
    transactions.value = []
  } finally {
    isLoading.value = false
  }
}

// Cargar transacciones cuando se abre el modal
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.account) {
    loadAccountTransactions()
  }
})

// Resetear filtro cuando cambia la cuenta
watch(() => props.account, () => {
  filterType.value = 'all'
})
</script> 