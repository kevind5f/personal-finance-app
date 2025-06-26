<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Financiero</h1>
        <div class="flex space-x-4">
          <button
            @click="showAccountForm = true"
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

      <!-- Financial Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Balance Total</h3>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalBalance.toFixed(2) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ingresos Mensuales</h3>
          <p class="text-2xl font-bold text-green-600">${{ monthlyIncome.toFixed(2) }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gastos Mensuales</h3>
          <p class="text-2xl font-bold text-red-600">${{ monthlyExpenses.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Accounts Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Cuentas</h2>
          <div class="space-y-4">
            <div v-for="account in accounts" :key="account._id" class="flex justify-between items-center">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ account.name }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ account.type }}</p>
              </div>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                ${{ account.balance.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Transacciones Recientes</h2>
          <div class="space-y-4">
            <div v-for="transaction in recentTransactions" :key="transaction._id"
              class="flex items-center gap-4 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 bg-gradient-to-r"
              :class="transaction.tipo === 'ingreso' ? 'from-green-50 to-green-100 dark:from-green-900 dark:to-gray-800' : 'from-red-50 to-red-100 dark:from-red-900 dark:to-gray-800'"
              style="transition: box-shadow 0.2s;"
            >
              <div class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="transaction.tipo === 'ingreso' ? 'bg-green-200 dark:bg-green-900' : 'bg-red-200 dark:bg-red-900'">
                <span class="text-2xl">
                  {{ transaction.tipo === 'ingreso' ? '💰' : '💸' }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ transaction.descripcion }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ transaction.categoria }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold" :class="transaction.tipo === 'ingreso' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ transaction.tipo === 'ingreso' ? '+' : '-' }}${{ Number(transaction.monto).toFixed(2) }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ transaction.fecha ? (new Date(transaction.fecha)).toLocaleDateString('es-ES') : '' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Savings Goals -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Metas de Ahorro</h2>
            <button
              @click="showGoalForm = true"
              class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Nueva Meta
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="goal in goals" :key="goal._id" class="space-y-2">
              <div class="flex justify-between items-center">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ goal.name }}</h3>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ (goal.currentAmount / goal.targetAmount * 100).toFixed(1) }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  class="bg-purple-600 h-2.5 rounded-full"
                  :style="{ width: `${(goal.currentAmount / goal.targetAmount * 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>${{ goal.currentAmount.toFixed(2) }}</span>
                <span>${{ goal.targetAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Budgets -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Presupuestos</h2>
            <button
              @click="showBudgetForm = true"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Nuevo Presupuesto
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="budget in budgets" :key="budget._id" class="space-y-2">
              <div class="flex justify-between items-center">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ budget.category }}</h3>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ budget.month }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  class="bg-yellow-600 h-2.5 rounded-full"
                  :style="{ width: `${(budget.spent / budget.amount * 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>${{ budget.spent.toFixed(2) }}</span>
                <span>${{ budget.amount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loans and Debts -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Préstamos y Deudas</h2>
            <div class="space-x-2">
              <button
                @click="openLoanForm('loan')"
                class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Nuevo Préstamo
              </button>
              <button
                @click="openLoanForm('debt')"
                class="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Nueva Deuda
              </button>
            </div>
          </div>
          <div class="space-y-4">
            <div v-for="loan in loans" :key="loan._id" class="flex justify-between items-center">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ loan.name }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ loan.dueDate }}</p>
              </div>
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                ${{ loan.amount.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forms -->
    <AccountForm
      v-if="showAccountForm"
      :is-open="showAccountForm"
      @close="showAccountForm = false"
      @submit="handleAccountSubmit"
    />

    <TransactionForm
      v-if="showTransactionForm"
      :is-open="showTransactionForm"
      :is-income="isIncome"
      @close="showTransactionForm = false"
      @submit="handleTransactionSubmit"
    />

    <GoalForm
      v-if="showGoalForm"
      :is-open="showGoalForm"
      @close="showGoalForm = false"
      @submit="handleGoalSubmit"
    />

    <BudgetForm
      v-if="showBudgetForm"
      :is-open="showBudgetForm"
      @close="showBudgetForm = false"
      @submit="handleBudgetSubmit"
    />

    <LoanForm
      v-if="showLoanForm || showDebtForm"
      :is-open="showLoanForm || showDebtForm"
      :is-loan="showLoanForm"
      @close="closeLoanForm"
      @submit="handleLoanSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AccountForm from '../components/AccountForm.vue'
import TransactionForm from '../components/TransactionForm.vue'
import GoalForm from '../components/GoalForm.vue'
import BudgetForm from '../components/BudgetForm.vue'
import LoanForm from '../components/LoanForm.vue'
import { useRouter } from 'vue-router'

interface Account {
  _id: string
  name: string
  type: string
  balance: number
}

interface Transaction {
  _id: string
  descripcion: string
  monto: number
  tipo: 'ingreso' | 'gasto'
  categoria: string
  fecha: string
  accountId: string
}

interface Goal {
  _id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  description: string
}

interface Budget {
  _id: string
  category: string
  amount: number
  spent: number
  month: string
  description: string
}

interface Loan {
  _id: string
  name: string
  amount: number
  dueDate: string
  interestRate: number
  description: string
  type: 'loan' | 'debt'
}

// Estado de los formularios
const showAccountForm = ref(false)
const showTransactionForm = ref(false)
const showGoalForm = ref(false)
const showBudgetForm = ref(false)
const showLoanForm = ref(false)
const showDebtForm = ref(false)
const isIncome = ref(false)

// Datos
const accounts = ref<Account[]>([])
const recentTransactions = ref<Transaction[]>([])
const goals = ref<Goal[]>([])
const budgets = ref<Budget[]>([])
const loans = ref<Loan[]>([])

// Cálculos financieros
const totalBalance = computed(() => {
  return accounts.value?.reduce((total, account) => total + (account.balance || 0), 0) || 0
})

const monthlyIncome = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  return recentTransactions.value
    ?.filter(t => t.tipo === 'ingreso' && t.fecha.startsWith(currentMonth))
    .reduce((total, t) => total + (t.monto || 0), 0) || 0
})

const monthlyExpenses = computed(() => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  return recentTransactions.value
    ?.filter(t => t.tipo === 'gasto' && t.fecha.startsWith(currentMonth))
    .reduce((total, t) => total + (t.monto || 0), 0) || 0
})

// Funciones para abrir formularios
const openTransactionForm = (type: 'income' | 'expense' | 'ingreso' | 'gasto') => {
  isIncome.value = type === 'income' || type === 'ingreso'
  showTransactionForm.value = true
}

const openLoanForm = (type: 'loan' | 'debt') => {
  showLoanForm.value = type === 'loan'
  showDebtForm.value = type === 'debt'
}

const closeLoanForm = () => {
  showLoanForm.value = false
  showDebtForm.value = false
}

// Funciones para manejar envíos de formularios
const handleAccountSubmit = async (accountData: Omit<Account, '_id'>) => {
  try {
    const response = await fetch('http://localhost:3000/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(accountData)
    })
    if (response.ok) {
      const newAccount = await response.json()
      accounts.value.push(newAccount)
      showAccountForm.value = false
    }
  } catch (error) {
    console.error('Error creating account:', error)
  }
}

const handleTransactionSubmit = async (transactionData: Omit<Transaction, '_id'>) => {
  try {
    const response = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transactionData)
    })
    if (response.ok) {
      const newTransaction = await response.json()
      recentTransactions.value.unshift(newTransaction)
      showTransactionForm.value = false
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
  }
}

const handleGoalSubmit = async (goalData: Omit<Goal, '_id'>) => {
  try {
    const response = await fetch('http://localhost:3000/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(goalData)
    })
    if (response.ok) {
      const newGoal = await response.json()
      goals.value.push(newGoal)
      showGoalForm.value = false
    }
  } catch (error) {
    console.error('Error creating goal:', error)
  }
}

const handleBudgetSubmit = async (budgetData: Omit<Budget, '_id'>) => {
  try {
    const response = await fetch('http://localhost:3000/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(budgetData)
    })
    if (response.ok) {
      const newBudget = await response.json()
      budgets.value.push(newBudget)
      showBudgetForm.value = false
    }
  } catch (error) {
    console.error('Error creating budget:', error)
  }
}

const handleLoanSubmit = async (loanData: Omit<Loan, '_id'>) => {
  try {
    const response = await fetch('http://localhost:3000/api/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loanData)
    })
    if (response.ok) {
      const newLoan = await response.json()
      loans.value.push(newLoan)
      closeLoanForm()
    }
  } catch (error) {
    console.error('Error creating loan:', error)
  }
}

// Cargar datos iniciales
onMounted(async () => {
  try {
    const [accountsRes, transactionsRes, goalsRes, budgetsRes, loansRes] = await Promise.all([
      fetch('http://localhost:3000/api/accounts'),
      fetch('http://localhost:3000/api/transactions'),
      fetch('http://localhost:3000/api/goals'),
      fetch('http://localhost:3000/api/budgets'),
      fetch('http://localhost:3000/api/loans')
    ])

    if (accountsRes.ok) accounts.value = await accountsRes.json()
    if (transactionsRes.ok) recentTransactions.value = await transactionsRes.json()
    if (goalsRes.ok) goals.value = await goalsRes.json()
    if (budgetsRes.ok) budgets.value = await budgetsRes.json()
    if (loansRes.ok) loans.value = await loansRes.json()
  } catch (error) {
    console.error('Error loading data:', error)
  }

  const router = useRouter()
  const token = localStorage.getItem('auth_token')
  if (!token) {
    router.replace('/login')
  } else {
    router.replace('/dashboard')
  }
})
</script> 