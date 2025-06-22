<template>
    <div>
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Bienvenido a tu panel de control financiero</p>
            </div>
            <div class="flex items-center space-x-4">
                <button 
                @click="toggleTheme" 
                class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                :title="isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
                >
                <span v-if="isDarkMode" class="text-2xl">☀️</span>
                <span v-else class="text-2xl">🌙</span>
                </button>
            <button @click="openReportModal" class="btn-secondary flex items-center">
              <span class="mr-2">📊</span>
              Reportes
            </button>
                <button @click="navigateTo('/settings')" class="btn-secondary flex items-center">
                <span class="mr-2">⚙️</span>
                Configuración
                </button>
                <button
                @click="handleLogout"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                Cerrar sesión
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
        <div v-else>
            <!-- Resumen de Cuentas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Balance Total</h3>
              <p class="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">${{ formatAmount(dashboardSummary.total_balance) }}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Balance actual de todas las cuentas</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Ingresos Mensuales</h3>
              <p class="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">${{ formatAmount(dashboardSummary.monthly_income) }}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Ingresos del mes actual</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Gastos Mensuales</h3>
              <p class="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">${{ formatAmount(dashboardSummary.monthly_expenses) }}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gastos del mes actual</p>
            </div>
            </div>

            <!-- Cuentas -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Mis Cuentas</h2>
            </div>
            <div class="p-6">
              <div v-if="accounts.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No hay cuentas disponibles</p>
                <button @click="openAccountModal" class="btn-primary mt-4">
                  Crear Primera Cuenta
                </button>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="account in accounts" :key="account._id" 
                    class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col">
                    <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ account.name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ account.type }}</p>
                    </div>
                    <button @click="showAccountOperations(account)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      📊 Operaciones
                    </button>
                    </div>
                    <div class="mt-4">
                    <p class="text-2xl font-bold" :class="account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      ${{ formatAmount(account.balance) }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ account.balance >= 0 ? 'Disponible' : 'Deuda' }}
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <!-- Acciones Rápidas -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Acciones Rápidas</h2>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <button @click="openTransactionModal('income')" class="btn-primary flex items-center justify-center">
                <span class="mr-2">💰</span>
                Añadir Ingreso
                </button>
                <button @click="openTransactionModal('expense')" class="btn-primary flex items-center justify-center">
                <span class="mr-2">💸</span>
                Añadir Gasto
                </button>
                <button @click="openLoanModal(true)" class="btn-primary flex items-center justify-center">
                <span class="mr-2">🏦</span>
                Nuevo Préstamo
                </button>
                <button @click="openLoanModal(false)" class="btn-primary flex items-center justify-center">
                <span class="mr-2">📝</span>
                Nueva Deuda
                </button>
            </div>
            </div>

            <!-- Manejo de Deudas -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Mis Deudas</h2>
              </div>
              <div class="p-6">
                <div v-if="deudas.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">No tienes deudas registradas</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="deuda in deudas" :key="deuda._id" class="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-white">{{ deuda.nombre }}</h3>
                      <p class="text-gray-600 dark:text-gray-400">{{ deuda.motivo }}</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500">Adquirida: {{ formatDate(deuda.fecha_adquisicion) }} | Cuotas: {{ deuda.numero_cuotas }} | Tasa: {{ deuda.tasa_interes }}%</p>
                    </div>
                    <span class="text-lg font-semibold text-red-600 dark:text-red-400 mt-2 md:mt-0">${{ formatAmount(deuda.monto) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Manejo de Préstamos -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Mis Préstamos</h2>
              </div>
              <div class="p-6">
                <div v-if="prestamos.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">No tienes préstamos registrados</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="prestamo in prestamos" :key="prestamo._id" class="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-white">{{ prestamo.nombre }}</h3>
                      <p class="text-gray-600 dark:text-gray-400">{{ prestamo.motivo }}</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500">Otorgado: {{ formatDate(prestamo.fecha_otorgamiento) }} | Cuotas: {{ prestamo.numero_cuotas }} | Tasa: {{ prestamo.tasa_interes }}%</p>
                    </div>
                    <span class="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2 md:mt-0">${{ formatAmount(prestamo.monto) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gestión de Ahorros y Metas -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Ahorros y Metas</h2>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Metas de Ahorro</h3>
                <div v-if="savingsGoals.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">No hay metas de ahorro configuradas</p>
                </div>
                <div v-else class="space-y-2">
                  <div v-for="goal in savingsGoals" :key="goal._id" class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600 dark:text-gray-400">{{ goal.name }}</span>
                      <span class="text-green-600 dark:text-green-400">${{ formatAmount(goal.currentAmount) }} / ${{ formatAmount(goal.targetAmount) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-green-600 h-2 rounded-full" :style="`width: ${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`"></div>
                    </div>
                    </div>
                </div>
                <button @click="openGoalModal" class="btn-secondary w-full">
                    Establecer Nueva Meta
                </button>
                </div>
                <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Presupuesto Mensual</h3>
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">Gastos Totales</span>
                    <span class="text-red-600 dark:text-red-400">${{ formatAmount(dashboardSummary.monthly_expenses) }} / ${{ formatAmount(monthlyBudget) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-red-600 h-2 rounded-full" :style="`width: ${Math.min((dashboardSummary.monthly_expenses / monthlyBudget) * 100, 100)}%`"></div>
                    </div>
                </div>
                <button @click="openBudgetModal" class="btn-secondary w-full">
                    Crear Presupuesto
                </button>
                </div>
            </div>
            </div>

            <!-- Últimas Transacciones -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Ultimos Movimientos</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="transaction in safeTransactions" :key="transaction._id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(transaction.date) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ transaction.description }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ transaction.category }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm" :class="transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ transaction.type === 'income' ? '+' : '-' }}${{ formatAmount(transaction.amount) }}
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
            </div>
        </div>
        </div>

        <!-- Modales -->
    <ClientOnly>
        <TransactionForm 
        v-if="showTransactionModal"
        :is-open="showTransactionModal"
        :is-income="transactionType === 'income'"
        @close="closeTransactionModal"
        @submit="handleTransactionSubmit"
        />

        <LoanForm 
        v-if="showLoanModal"
        :is-open="showLoanModal"
        :is-loan="loanType === 'loan'"
        @close="closeLoanModal"
        @submit="handleLoanSubmit"
        />

        <GoalForm
        v-if="showGoalModal"
        :is-open="showGoalModal"
        @close="closeGoalModal"
        @submit="handleGoalSubmit"
        />

        <BudgetForm
        v-if="showBudgetModal"
        :is-open="showBudgetModal"
        @close="closeBudgetModal"
        @submit="handleBudgetSubmit"
        />

        <ReportModal
        v-if="showReportModal"
        :is-open="showReportModal"
        @close="closeReportModal"
      />

      <AccountForm
        v-if="showAccountModal"
        :is-open="showAccountModal"
        @close="closeAccountModal"
        @submit="handleAccountSubmit"
      />

      <AccountOperationsModal
        v-if="showAccountOperationsModal"
        :is-open="showAccountOperationsModal"
        :account="selectedAccount"
        @close="closeAccountOperationsModal"
      />
    </ClientOnly>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import TransactionForm from '~/components/TransactionForm.vue'
import LoanForm from '~/components/LoanForm.vue'
import GoalForm from '~/components/GoalForm.vue'
import BudgetForm from '~/components/BudgetForm.vue'
import ReportModal from '~/components/ReportModal.vue'
import AccountForm from '~/components/AccountForm.vue'
import AccountOperationsModal from '~/components/AccountOperationsModal.vue'

// Estado de los modales
const showTransactionModal = ref(false)
const showLoanModal = ref(false)
const showGoalModal = ref(false)
const showBudgetModal = ref(false)
const showReportModal = ref(false)
const showAccountModal = ref(false)
const showAccountOperationsModal = ref(false)
const selectedAccount = ref(null)
const transactionType = ref('')
const loanType = ref('')

// Estado del tema
const isDarkMode = ref(false)

// Estado de carga
const isLoading = ref(true)
const error = ref(null)

// Estado para los datos
const dashboardSummary = ref({
  total_balance: 0,
  monthly_income: 0,
  monthly_expenses: 0
})
const accounts = ref([])
const transactions = ref([])
const savingsGoals = ref([])
const budget = ref(null)

// NUEVO: Estado para deudas y préstamos
const deudas = ref([])
const prestamos = ref([])

// Presupuesto mensual estimado
const monthlyBudget = ref(5000)

// Computed property para transacciones seguras
const safeTransactions = computed(() => {
  return Array.isArray(transactions.value) ? transactions.value.slice(0, 10) : []
})

// Función para cargar los datos del dashboard
const loadDashboardData = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Inicializar arrays vacíos
    accounts.value = []
    transactions.value = []
    savingsGoals.value = []
    budget.value = null
    deudas.value = []
    prestamos.value = []

    // Cargar resumen
    const summaryResponse = await fetch('http://localhost:3000/api/dashboard/summary')
    const summaryData = await summaryResponse.json()
    dashboardSummary.value = {
      total_balance: Number(summaryData.total_balance) || 0,
      monthly_income: Number(summaryData.monthly_income) || 0,
      monthly_expenses: Number(summaryData.monthly_expenses) || 0
    }

    // Cargar cuentas
    const accountsResponse = await fetch('http://localhost:3000/api/accounts')
    const accountsData = await accountsResponse.json()
    accounts.value = Array.isArray(accountsData) ? accountsData : []

    // Cargar deudas (ahora desde endpoint real)
    try {
      const deudasResponse = await fetch('http://localhost:3000/api/deudas')
      if (deudasResponse.ok) {
        const deudasData = await deudasResponse.json()
        deudas.value = Array.isArray(deudasData) ? deudasData : []
      }
    } catch (e) {
      deudas.value = []
    }

    // Cargar transacciones
    const transactionsResponse = await fetch('http://localhost:3000/api/transactions')
    const transactionsData = await transactionsResponse.json()
    transactions.value = Array.isArray(transactionsData) ? transactionsData : []

    // Cargar metas de ahorro
    const goalsResponse = await fetch('http://localhost:3000/api/goals')
    const goalsData = await goalsResponse.json()
    savingsGoals.value = Array.isArray(goalsData) ? goalsData : []

    // Cargar presupuesto
    const budgetResponse = await fetch('http://localhost:3000/api/budgets')
    const budgetData = await budgetResponse.json()
    budget.value = budgetData || null

    // Calcular presupuesto mensual total
    if (Array.isArray(budgetData)) {
      monthlyBudget.value = budgetData.reduce((total, b) => total + (Number(b.monto) || 0), 0)
    }

    // Cargar préstamos (ahora desde endpoint real)
    try {
      const prestamosResponse = await fetch('http://localhost:3000/api/prestamos')
      if (prestamosResponse.ok) {
        const prestamosData = await prestamosResponse.json()
        prestamos.value = Array.isArray(prestamosData) ? prestamosData : []
      }
    } catch (e) {
      prestamos.value = []
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    error.value = error.message || 'Error al cargar los datos'
    // Asegurarse de que los arrays estén inicializados como vacíos en caso de error
    accounts.value = []
    transactions.value = []
    savingsGoals.value = []
    budget.value = null
    deudas.value = []
    prestamos.value = []
  } finally {
    isLoading.value = false
  }
}

// Funciones para manejar los modales
const openTransactionModal = (type) => {
    transactionType.value = type
    showTransactionModal.value = true
}

const closeTransactionModal = () => {
    showTransactionModal.value = false
    transactionType.value = ''
}

const openLoanModal = (isLoan) => {
    loanType.value = isLoan ? 'loan' : 'debt'
    showLoanModal.value = true
}

const closeLoanModal = () => {
    showLoanModal.value = false
    loanType.value = ''
}

const openGoalModal = () => {
    showGoalModal.value = true
}

const closeGoalModal = () => {
    showGoalModal.value = false
}

const openBudgetModal = () => {
    showBudgetModal.value = true
}

const closeBudgetModal = () => {
    showBudgetModal.value = false
}

const openAccountModal = () => {
  showAccountModal.value = true
}

const closeAccountModal = () => {
  showAccountModal.value = false
}

const openAccountOperations = (account) => {
  selectedAccount.value = account
  showAccountOperationsModal.value = true
}

const closeAccountOperationsModal = () => {
  showAccountOperationsModal.value = false
}

// Funciones para manejar los formularios
const handleTransactionSubmit = async (transaction) => {
  try {
    const response = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    })
    
    if (response.ok) {
      const newTransaction = await response.json()
      transactions.value.unshift(newTransaction)
      await loadDashboardData() // Recargar datos para actualizar balances
      closeTransactionModal()
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
  }
}

const handleLoanSubmit = async (loan) => {
  try {
    // Crear una nueva cuenta para el préstamo/deuda
    const accountResponse = await fetch('http://localhost:3000/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: loan.name,
        type: loanType.value === 'loan' ? 'Préstamo' : 'Deuda',
        balance: loanType.value === 'loan' ? -loan.amount : loan.amount
      })
    })

    if (accountResponse.ok) {
      const newAccount = await accountResponse.json()
      accounts.value.push(newAccount)
      await loadDashboardData() // Recargar datos para actualizar balances
      closeLoanModal()
    }
  } catch (error) {
    console.error('Error creating loan/debt:', error)
  }
}

const handleGoalSubmit = async (goal) => {
  try {
    const response = await fetch('http://localhost:3000/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount || 0,
        deadline: goal.deadline
      })
    })

    if (response.ok) {
      const newGoal = await response.json()
      savingsGoals.value.push(newGoal)
      closeGoalModal()
    }
  } catch (error) {
    console.error('Error creating goal:', error)
  }
}

const handleBudgetSubmit = async (budgetData) => {
  try {
    const response = await fetch('http://localhost:3000/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        totalBudget: budgetData.totalBudget,
        spentAmount: budgetData.spentAmount || 0
      })
    })

    if (response.ok) {
      const newBudget = await response.json()
      budget.value = newBudget
      closeBudgetModal()
    }
  } catch (error) {
    console.error('Error creating budget:', error)
  }
}

const handleAccountSubmit = async (accountData) => {
  try {
    const response = await fetch('http://localhost:3000/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: accountData.name,
        type: accountData.type,
        balance: accountData.balance
      })
    })

    if (response.ok) {
      const newAccount = await response.json()
      accounts.value.push(newAccount)
      closeAccountModal()
    }
  } catch (error) {
    console.error('Error creating account:', error)
  }
}

// Función para editar cuenta
const editAccount = async (account) => {
  try {
    const response = await fetch(`http://localhost:3000/api/accounts/${account._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    })

    if (response.ok) {
      const updatedAccount = await response.json()
      const index = accounts.value.findIndex(a => a._id === account._id)
      if (index !== -1) {
        accounts.value[index] = updatedAccount
      }
      await loadDashboardData() // Recargar datos para actualizar balances
    }
  } catch (error) {
    console.error('Error updating account:', error)
  }
}

// Cargar datos al montar el componente
onMounted(async () => {
  await loadDashboardData()
  // Inicializar tema
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

// Limpiar al desmontar
onBeforeUnmount(() => {
  // Limpiar cualquier suscripción o temporizador si es necesario
  accounts.value = []
  transactions.value = []
  savingsGoals.value = []
  budget.value = null
  deudas.value = []
  prestamos.value = []
})

// Función para cambiar el tema
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  navigateTo('/login')
}

// Funciones para el modal de reportes
const openReportModal = () => {
  showReportModal.value = true
}

const closeReportModal = () => {
  showReportModal.value = false
}

const showAccountOperations = (account) => {
  openAccountOperations(account)
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
</script> 