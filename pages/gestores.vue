<template>
  <div>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-12 flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1 flex items-center gap-2">
              <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg px-3 py-1 text-2xl">⚙️</span>
              Gestores
            </h1>
            <p class="text-base text-gray-600 dark:text-gray-400">Herramientas de gestión financiera</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 justify-end">
            <button @click="navigateTo('/dashboard')" class="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
              <span>🏠</span> Dashboard
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- Content -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Gestor de Transacciones -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">💸</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Gestor de Transacciones</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Administra ingresos, gastos y transferencias</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Total transacciones:</span>
                <span class="font-semibold text-green-600 dark:text-green-400">{{ transactions.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Este mes:</span>
                <span class="font-semibold text-green-600 dark:text-green-400">{{ monthlyTransactions }}</span>
              </div>
            </div>
            <button @click="openTransactionsModal" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Gestionar Transacciones
            </button>
          </div>

          <!-- Gestor de Deudas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">📝</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Gestor de Deudas</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Administra tus deudas y pagos pendientes</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Deudas activas:</span>
                <span class="font-semibold text-red-600 dark:text-red-400">{{ activeDebts }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Total deuda:</span>
                <span class="font-semibold text-red-600 dark:text-red-400">${{ formatAmount(totalDebt) }}</span>
              </div>
            </div>
            <button @click="openDebtsModal" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Gestionar Deudas
            </button>
          </div>

          <!-- Gestor de Préstamos -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">🏦</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Gestor de Préstamos</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Administra préstamos otorgados y recibidos</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Préstamos activos:</span>
                <span class="font-semibold text-purple-600 dark:text-purple-400">{{ activeLoans }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Total préstamos:</span>
                <span class="font-semibold text-purple-600 dark:text-purple-400">${{ formatAmount(totalLoans) }}</span>
              </div>
            </div>
            <button @click="openLoansModal" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Gestionar Préstamos
            </button>
          </div>

          <!-- Gestor de Metas -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">🎯</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Gestor de Metas</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Administra tus metas de ahorro e inversión</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Metas activas:</span>
                <span class="font-semibold text-yellow-600 dark:text-yellow-400">{{ activeGoals }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Progreso total:</span>
                <span class="font-semibold text-yellow-600 dark:text-yellow-400">{{ goalsProgress }}%</span>
              </div>
            </div>
            <button @click="openGoalsModal" class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              Gestionar Metas
            </button>
          </div>

          <!-- Gestor de Presupuestos -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl">📊</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Gestor de Presupuestos</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Administra presupuestos por categoría</p>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Presupuestos activos:</span>
                <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ activeBudgets }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500 dark:text-gray-400">Total presupuesto:</span>
                <span class="font-semibold text-indigo-600 dark:text-indigo-400">${{ formatAmount(totalBudget) }}</span>
              </div>
            </div>
            <button @click="openBudgetsModal" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Gestionar Presupuestos
            </button>
          </div>
        </div>

        <!-- Modales -->
        <ClientOnly>
          <!-- Modal de Transacciones -->
          <TransactionsManagerModal
            v-if="showTransactionsModal"
            :is-open="showTransactionsModal"
            :transactions="transactionsMapped"
            @close="closeTransactionsModal"
            @refresh="loadData"
          />

          <!-- Modal de Deudas -->
          <DebtsManagerModal
            v-if="showDebtsModal"
            :is-open="showDebtsModal"
            :deudas="deudas"
            @close="closeDebtsModal"
            @refresh="loadData"
          />

          <!-- Modal de Préstamos -->
          <LoansManagerModal
            v-if="showLoansModal"
            :is-open="showLoansModal"
            :prestamos="prestamos"
            @close="closeLoansModal"
            @refresh="loadData"
          />

          <!-- Modal de Metas -->
          <GoalsManagerModal
            v-if="showGoalsModal"
            :is-open="showGoalsModal"
            :metas="savingsGoals"
            @close="closeGoalsModal"
            @refresh="loadData"
          />

          <!-- Modal de Presupuestos -->
          <BudgetsManagerModal
            v-if="showBudgetsModal"
            :is-open="showBudgetsModal"
            :presupuestos="budgets"
            @close="closeBudgetsModal"
            @refresh="loadData"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Estado de carga
const isLoading = ref(true)
const error = ref(null)

// Estado para los datos
const accounts = ref([])
const transactions = ref([])
const deudas = ref([])
const prestamos = ref([])
const savingsGoals = ref([])
const budgets = ref([])

// Estado de los modales
const showTransactionsModal = ref(false)
const showDebtsModal = ref(false)
const showLoansModal = ref(false)
const showGoalsModal = ref(false)
const showBudgetsModal = ref(false)

// Computed properties
const monthlyTransactions = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  return transactions.value.filter(t => t.fecha?.startsWith(currentMonth)).length
})

const activeDebts = computed(() => {
  return deudas.value.filter(d => d.estado === 'activa').length
})

const totalDebt = computed(() => {
  return deudas.value
    .filter(d => d.estado === 'activa')
    .reduce((sum, d) => sum + (d.monto || 0), 0)
})

const activeLoans = computed(() => {
  return prestamos.value.filter(p => p.estado === 'activo').length
})

const totalLoans = computed(() => {
  return prestamos.value
    .filter(p => p.estado === 'activo')
    .reduce((sum, p) => sum + (p.monto || 0), 0)
})

const activeGoals = computed(() => {
  return savingsGoals.value.filter(g => g.currentAmount < g.targetAmount).length
})

const goalsProgress = computed(() => {
  if (savingsGoals.value.length === 0) return 0
  const totalCurrent = savingsGoals.value.reduce((sum, g) => sum + (g.currentAmount || 0), 0)
  const totalTarget = savingsGoals.value.reduce((sum, g) => sum + (g.targetAmount || 0), 0)
  return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
})

const activeBudgets = computed(() => {
  return budgets.value.filter(b => b.activo).length
})

const totalBudget = computed(() => {
  return budgets.value
    .filter(b => b.activo)
    .reduce((sum, b) => sum + (b.monto || 0), 0)
})

// Mapeo para asegurar campos correctos en español
const transactionsMapped = computed(() => {
  return transactions.value.map(t => ({
    _id: t._id,
    descripcion: t.descripcion || t.description || 'Sin descripción',
    monto: t.monto !== undefined ? t.monto : (t.amount !== undefined ? t.amount : 0),
    categoria: t.categoria || t.category || 'Sin categoría',
    fecha: t.fecha || t.date || '',
    tipo: t.tipo || t.type || 'gasto',
    cuentaId: t.cuentaId || t.accountId || ''
  }))
})

// Funciones para manejar los modales
const openTransactionsModal = () => {
  showTransactionsModal.value = true
}

const closeTransactionsModal = () => {
  showTransactionsModal.value = false
}

const openDebtsModal = () => {
  showDebtsModal.value = true
}

const closeDebtsModal = () => {
  showDebtsModal.value = false
}

const openLoansModal = () => {
  showLoansModal.value = true
}

const closeLoansModal = () => {
  showLoansModal.value = false
}

const openGoalsModal = () => {
  showGoalsModal.value = true
}

const closeGoalsModal = () => {
  showGoalsModal.value = false
}

const openBudgetsModal = () => {
  showBudgetsModal.value = true
}

const closeBudgetsModal = () => {
  showBudgetsModal.value = false
}

// Función para cargar los datos
const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Cargar todos los datos
    const [accountsRes, transactionsRes, deudasRes, prestamosRes, goalsRes, budgetsRes] = await Promise.all([
      fetch('http://localhost:3000/api/accounts'),
      fetch('http://localhost:3000/api/transactions'),
      fetch('http://localhost:3000/api/deudas'),
      fetch('http://localhost:3000/api/prestamos'),
      fetch('http://localhost:3000/api/goals'),
      fetch('http://localhost:3000/api/budgets')
    ])

    accounts.value = await accountsRes.json()
    transactions.value = await transactionsRes.json()
    deudas.value = await deudasRes.json()
    prestamos.value = await prestamosRes.json()
    savingsGoals.value = await goalsRes.json()
    budgets.value = await budgetsRes.json()

  } catch (err) {
    console.error('Error loading data:', err)
    error.value = 'Error al cargar los datos'
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

// Cargar datos al montar el componente
onMounted(() => {
  loadData()
})
</script> 