<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div class="container mx-auto px-4 py-8">
        <!-- Header -->
          <div class="flex justify-between items-center mb-8">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Financiero</h1>
              <div class="flex space-x-4">
              <button
                  @click="openAccountForm"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                  Nueva Cuenta
              </button>
              <button
                  @click="openTransactionForm('income')"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                  Añadir Ingreso
              </button>
              <button
                  @click="openTransactionForm('expense')"
                  class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                  Añadir Gasto
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
          <template v-else>
              <!-- Financial Summary -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Balance Total</h3>
                      <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatCurrency(totalBalance) }}</p>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ingresos Mensuales</h3>
                      <p class="text-2xl font-bold text-green-600">${{ formatCurrency(monthlyIncome) }}</p>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gastos Mensuales</h3>
                      <p class="text-2xl font-bold text-red-600">${{ formatCurrency(monthlyExpenses) }}</p>
                  </div>
              </div>

              <!-- Main Content -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Accounts Section -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Cuentas</h2>
                      <div class="space-y-4">
                          <div v-for="account in safeAccounts" :key="account?._id || Math.random()" class="flex justify-between items-center">
                              <div>
                                  <h3 class="font-medium text-gray-900 dark:text-white">{{ account?.nombre || 'Sin nombre' }}</h3>
                                  <p class="text-gray-600 dark:text-gray-400">{{ account?.tipo || 'Sin tipo' }}</p>
                              </div>
                              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                                  ${{ formatCurrency(account?.saldo) }}
                              </span>
                          </div>
                      </div>
                  </div>

                  <!-- Recent Transactions -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Transacciones Recientes</h2>
                      <div class="space-y-4">
                          <div v-for="transaction in safeTransactions" :key="transaction?._id || Math.random()" class="flex justify-between items-center">
                              <div>
                                  <h3 class="font-medium text-gray-900 dark:text-white">{{ transaction?.descripcion || 'Sin descripción' }}</h3>
                                  <p class="text-gray-600 dark:text-gray-400">{{ transaction?.categoria || 'Sin categoría' }}</p>
                              </div>
                              <span :class="[
                                  'text-lg font-semibold',
                                  transaction?.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                              ]">
                                  {{ transaction?.tipo === 'ingreso' ? '+' : '-' }}${{ formatCurrency(transaction?.monto) }}
                              </span>
                          </div>
                      </div>
                  </div>

                  <!-- Savings Goals -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div class="flex justify-between items-center mb-4">
                          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Metas de Ahorro</h2>
                          <button
                              @click="openGoalForm"
                              class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                              Nueva Meta
                          </button>
                      </div>
                      <div class="space-y-4">
                          <div v-for="goal in safeGoals" :key="goal?._id || Math.random()" class="space-y-2">
                              <div class="flex justify-between items-center">
                                  <h3 class="font-medium text-gray-900 dark:text-white">{{ goal?.nombre || 'Sin nombre' }}</h3>
                                  <span class="text-sm text-gray-600 dark:text-gray-400">
                                      {{ formatPercentage(calculatePercentage(goal?.montoActual, goal?.montoObjetivo)) }}%
                                  </span>
                              </div>
                              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div
                                      class="bg-purple-600 h-2.5 rounded-full"
                                      :style="{ width: `${calculatePercentage(goal?.montoActual, goal?.montoObjetivo)}%` }"
                                  ></div>
                              </div>
                              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                  <span>${{ formatCurrency(goal?.montoActual) }}</span>
                                  <span>${{ formatCurrency(goal?.montoObjetivo) }}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- Budgets -->
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <div class="flex justify-between items-center mb-4">
                          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Presupuestos</h2>
                          <button
                              @click="openBudgetForm"
                              class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                          >
                              Nuevo Presupuesto
                          </button>
                      </div>
                      <div class="space-y-4">
                          <div v-for="budget in safeBudgets" :key="budget?._id || Math.random()" class="space-y-2">
                              <div class="flex justify-between items-center">
                                  <h3 class="font-medium text-gray-900 dark:text-white">{{ budget?.categoria || 'Sin categoría' }}</h3>
                                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ budget?.mes || 'Sin mes' }}</span>
                              </div>
                              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div
                                      class="bg-yellow-600 h-2.5 rounded-full"
                                      :style="{ width: `${calculatePercentage(budget?.gastado, budget?.monto)}%` }"
                                  ></div>
                              </div>
                              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                  <span>${{ formatCurrency(budget?.gastado) }}</span>
                                  <span>${{ formatCurrency(budget?.monto) }}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </template>
        </div>

        <!-- Forms -->
        <AccountForm
            v-if="showAccountForm"
            :is-open="showAccountForm"
            @close="closeAccountForm"
            @submit="handleAccountSubmit"
        />

        <TransactionForm
            v-if="showTransactionForm"
            :is-open="showTransactionForm"
            :is-income="isIncome"
            @close="closeTransactionForm"
            @submit="handleTransactionSubmit"
        />

        <GoalForm
            v-if="showGoalForm"
            :is-open="showGoalForm"
            @close="closeGoalForm"
            @submit="handleGoalSubmit"
        />

        <BudgetForm
            v-if="showBudgetForm"
            :is-open="showBudgetForm"
            @close="closeBudgetForm"
            @submit="handleBudgetSubmit"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFetch } from '#app'
import AccountForm from './AccountForm.vue'
import TransactionForm from './TransactionForm.vue'
import GoalForm from './GoalForm.vue'
import BudgetForm from './BudgetForm.vue'

// Estado de carga y error
const isLoading = ref(true)
const error = ref(null)

// Funciones de utilidad para formateo de números
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

const formatPercentage = (value) => {
  if (value === undefined || value === null) return '0.0'
  const num = Number(value)
  return isNaN(num) ? '0.0' : num.toFixed(1)
}

const calculatePercentage = (current, total) => {
  if (current === undefined || total === undefined || total === 0) return 0
  const currentNum = Number(current) || 0
  const totalNum = Number(total) || 1
  const percentage = (currentNum / totalNum) * 100
  return Math.min(Math.max(0, percentage), 100)
}

// Estado de los formularios
const showAccountForm = ref(false)
const showTransactionForm = ref(false)
const showGoalForm = ref(false)
const showBudgetForm = ref(false)
const isIncome = ref(false)

// Datos con valores iniciales
const accounts = ref([])
const recentTransactions = ref([])
const goals = ref([])
const budgets = ref([])

// Computed properties para datos filtrados y seguros
const safeAccounts = computed(() => Array.isArray(accounts.value) ? accounts.value : [])
const safeTransactions = computed(() => Array.isArray(recentTransactions.value) ? recentTransactions.value : [])
const safeGoals = computed(() => Array.isArray(goals.value) ? goals.value : [])
const safeBudgets = computed(() => Array.isArray(budgets.value) ? budgets.value : [])

// Cálculos financieros con valores por defecto
const totalBalance = computed(() => {
  return safeAccounts.value.reduce((total, account) => {
    const saldo = Number(account?.saldo) || 0
    return total + saldo
  }, 0)
})

const monthlyIncome = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  return safeTransactions.value
    .filter(t => t?.tipo === 'ingreso' && t?.fecha?.startsWith(currentMonth))
    .reduce((total, t) => {
      const monto = Number(t?.monto) || 0
      return total + monto
    }, 0)
})

const monthlyExpenses = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  return safeTransactions.value
    .filter(t => t?.tipo === 'gasto' && t?.fecha?.startsWith(currentMonth))
    .reduce((total, t) => {
      const monto = Number(t?.monto) || 0
      return total + monto
    }, 0)
})

// Funciones para abrir formularios
const openAccountForm = () => {
  showAccountForm.value = true
}

const openTransactionForm = (type) => {
  isIncome.value = type === 'income'
  showTransactionForm.value = true
}

const openGoalForm = () => {
  showGoalForm.value = true
}

const openBudgetForm = () => {
  showBudgetForm.value = true
}

// Funciones para cerrar formularios
const closeAccountForm = () => {
  showAccountForm.value = false
}

const closeTransactionForm = () => {
  showTransactionForm.value = false
}

const closeGoalForm = () => {
  showGoalForm.value = false
}

const closeBudgetForm = () => {
  showBudgetForm.value = false
}

// Funciones para manejar envíos de formularios
const handleAccountSubmit = async (accountData) => {
  try {
    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: accountData.name,
        tipo: accountData.type,
        saldo: accountData.balance
      })
    })
    if (response.ok) {
      const newAccount = await response.json()
      accounts.value.push(newAccount)
      closeAccountForm()
    }
  } catch (error) {
    console.error('Error creating account:', error)
  }
}

const handleTransactionSubmit = async (transactionData) => {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        descripcion: transactionData.description,
        monto: transactionData.amount,
        tipo: transactionData.type === 'income' ? 'ingreso' : 'gasto',
        categoria: transactionData.category,
        fecha: transactionData.date,
        cuentaId: transactionData.accountId
      })
    })
    if (response.ok) {
      const newTransaction = await response.json()
      recentTransactions.value.unshift(newTransaction)
      closeTransactionForm()
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
  }
}

const handleGoalSubmit = async (goalData) => {
  try {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: goalData.name,
        montoObjetivo: goalData.targetAmount,
        montoActual: goalData.currentAmount,
        fechaObjetivo: goalData.targetDate,
        descripcion: goalData.description
      })
    })
    if (response.ok) {
      const newGoal = await response.json()
      goals.value.push(newGoal)
      closeGoalForm()
    }
  } catch (error) {
    console.error('Error creating goal:', error)
  }
}

const handleBudgetSubmit = async (budgetData) => {
  try {
    const response = await fetch('/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categoria: budgetData.category,
        monto: budgetData.amount,
        mes: budgetData.month,
        descripcion: budgetData.description,
        gastado: 0
      })
    })
    if (response.ok) {
      const newBudget = await response.json()
      budgets.value.push(newBudget)
      closeBudgetForm()
    }
  } catch (error) {
    console.error('Error creating budget:', error)
  }
}

// Cargar datos iniciales
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null

    // Inicializar arrays vacíos
    accounts.value = []
    recentTransactions.value = []
    goals.value = []
    budgets.value = []

    const [accountsData, transactionsData, goalsData, budgetsData] = await Promise.all([
      useFetch('/api/accounts'),
      useFetch('/api/transactions'),
      useFetch('/api/goals'),
      useFetch('/api/budgets')
    ])

    // Verificar errores y asignar datos
    if (accountsData.error.value) throw new Error('Error loading accounts')
    if (transactionsData.error.value) throw new Error('Error loading transactions')
    if (goalsData.error.value) throw new Error('Error loading goals')
    if (budgetsData.error.value) throw new Error('Error loading budgets')

    // Asignar datos con verificación de tipo
    accounts.value = Array.isArray(accountsData.data.value) ? accountsData.data.value : []
    recentTransactions.value = Array.isArray(transactionsData.data.value) ? transactionsData.data.value : []
    goals.value = Array.isArray(goalsData.data.value) ? goalsData.data.value : []
    budgets.value = Array.isArray(budgetsData.data.value) ? budgetsData.data.value : []

  } catch (err) {
    console.error('Error loading dashboard data:', err)
    error.value = err.message
    // Asegurarse de que los arrays estén inicializados como vacíos en caso de error
    accounts.value = []
    recentTransactions.value = []
    goals.value = []
    budgets.value = []
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
/* No additional styles needed */
</style> 