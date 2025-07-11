<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto border border-gray-200 dark:border-gray-800 flex flex-col">
      <!-- Encabezado con icono -->
      <div class="flex items-center gap-3 px-10 py-8 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
        <span class="text-4xl bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full p-4 shadow">📊</span>
        <div class="flex-1">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Reportes Financieros</h3>
          <p class="text-base text-gray-600 dark:text-gray-300 mt-1">Análisis completo de tus finanzas personales</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >✕</button>
      </div>
      <div class="px-10 py-8 flex-1 overflow-y-auto space-y-10">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
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
        <!-- Content -->
        <div v-else class="space-y-10">
          <!-- Resumen General -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white flex flex-col items-start shadow-lg">
              <span class="text-3xl bg-white/30 dark:bg-white/10 rounded-full p-2 mb-2">💰</span>
              <h4 class="text-base font-medium opacity-90">Ingresos Totales</h4>
              <p class="text-3xl font-bold mt-1">{{ currencySymbol }} {{ formatAmount(reportData.totalIncome) }}</p>
              <p class="text-xs opacity-75 mt-1">{{ reportData.totalTransactions }} transacciones</p>
            </div>
            <div class="bg-gradient-to-r from-red-400 to-red-600 rounded-2xl p-6 text-white flex flex-col items-start shadow-lg">
              <span class="text-3xl bg-white/30 dark:bg-white/10 rounded-full p-2 mb-2">💸</span>
              <h4 class="text-base font-medium opacity-90">Gastos Totales</h4>
              <p class="text-3xl font-bold mt-1">{{ currencySymbol }} {{ formatAmount(reportData.totalExpenses) }}</p>
              <p class="text-xs opacity-75 mt-1">{{ reportData.totalTransactions }} transacciones</p>
            </div>
            <div class="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-6 text-white flex flex-col items-start shadow-lg">
              <span class="text-3xl bg-white/30 dark:bg-white/10 rounded-full p-2 mb-2">💼</span>
              <h4 class="text-base font-medium opacity-90">Balance Neto</h4>
              <p class="text-3xl font-bold mt-1">{{ currencySymbol }} {{ formatAmount(reportData.netBalance) }}</p>
              <p class="text-xs opacity-75 mt-1">Diferencia total</p>
            </div>
            <div class="bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl p-6 text-white flex flex-col items-start shadow-lg">
              <span class="text-3xl bg-white/30 dark:bg-white/10 rounded-full p-2 mb-2">🏦</span>
              <h4 class="text-base font-medium opacity-90">Cuentas Activas</h4>
              <p class="text-3xl font-bold mt-1">{{ reportData.activeAccounts }}</p>
              <p class="text-xs opacity-75 mt-1">Incluyendo deudas</p>
            </div>
          </div>

          <!-- Gráficos de Ingresos y Gastos por Mes -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Ingresos por Mes -->
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ingresos por Mes</h4>
              <div class="space-y-3">
                <div v-for="(amount, month) in reportData.incomeByMonth" :key="month" class="flex items-center">
                  <div class="w-20 text-sm text-gray-600 dark:text-gray-400">{{ month }}</div>
                  <div class="flex-1 mx-3">
                    <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        class="bg-green-500 h-3 rounded-full transition-all duration-300"
                        :style="`width: ${getPercentage(amount, reportData.maxIncome)}%`"
                      ></div>
                    </div>
                  </div>
                  <div class="w-20 text-right text-sm font-medium text-green-600 dark:text-green-400">
                    {{ currencySymbol }} {{ formatAmount(amount) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Gastos por Mes -->
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gastos por Mes</h4>
              <div class="space-y-3">
                <div v-for="(amount, month) in reportData.expensesByMonth" :key="month" class="flex items-center">
                  <div class="w-20 text-sm text-gray-600 dark:text-gray-400">{{ month }}</div>
                  <div class="flex-1 mx-3">
                    <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        class="bg-red-500 h-3 rounded-full transition-all duration-300"
                        :style="`width: ${getPercentage(amount, reportData.maxExpenses)}%`"
                      ></div>
                    </div>
                  </div>
                  <div class="w-20 text-right text-sm font-medium text-red-600 dark:text-red-400">
                    {{ currencySymbol }} {{ formatAmount(amount) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráficos por Categoría -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Ingresos por Categoría -->
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ingresos por Categoría</h4>
              <div class="space-y-3">
                <div v-for="(amount, category) in reportData.incomeByCategory" :key="category" class="flex items-center">
                  <div class="w-32 text-sm text-gray-600 dark:text-gray-400 truncate">{{ category }}</div>
                  <div class="flex-1 mx-3">
                    <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        class="bg-green-500 h-3 rounded-full transition-all duration-300"
                        :style="`width: ${getPercentage(amount, reportData.maxIncomeCategory)}%`"
                      ></div>
                    </div>
                  </div>
                  <div class="w-20 text-right text-sm font-medium text-green-600 dark:text-green-400">
                    {{ currencySymbol }} {{ formatAmount(amount) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Gastos por Categoría -->
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gastos por Categoría</h4>
              <div class="space-y-3">
                <div v-for="(amount, category) in reportData.expensesByCategory" :key="category" class="flex items-center">
                  <div class="w-32 text-sm text-gray-600 dark:text-gray-400 truncate">{{ category }}</div>
                  <div class="flex-1 mx-3">
                    <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        class="bg-red-500 h-3 rounded-full transition-all duration-300"
                        :style="`width: ${getPercentage(amount, reportData.maxExpenseCategory)}%`"
                      ></div>
                    </div>
                  </div>
                  <div class="w-20 text-right text-sm font-medium text-red-600 dark:text-red-400">
                    {{ currencySymbol }} {{ formatAmount(amount) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Promedios y Estadísticas -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio Ingresos</h5>
              <div class="mt-2 space-y-1">
                <p class="text-lg font-semibold text-green-600 dark:text-green-400">{{ currencySymbol }} {{ formatAmount(reportData.averageIncome.monthly) }}/mes</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ currencySymbol }} {{ formatAmount(reportData.averageIncome.daily) }}/día</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ currencySymbol }} {{ formatAmount(reportData.averageIncome.yearly) }}/año</p>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio Gastos</h5>
              <div class="mt-2 space-y-1">
                <p class="text-lg font-semibold text-red-600 dark:text-red-400">{{ currencySymbol }} {{ formatAmount(reportData.averageExpenses.monthly) }}/mes</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ currencySymbol }} {{ formatAmount(reportData.averageExpenses.daily) }}/día</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ currencySymbol }} {{ formatAmount(reportData.averageExpenses.yearly) }}/año</p>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400">Mayor Deuda</h5>
              <div class="mt-2 space-y-1">
                <p class="text-lg font-semibold text-red-600 dark:text-red-400">{{ currencySymbol }} {{ formatAmount(reportData.largestDebt.amount) }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ reportData.largestDebt.account }}</p>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h5 class="text-sm font-medium text-gray-600 dark:text-gray-400">Mayor Préstamo</h5>
              <div class="mt-2 space-y-1">
                <p class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ currencySymbol }} {{ formatAmount(reportData.largestLoan.amount) }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ reportData.largestLoan.account }}</p>
              </div>
            </div>
          </div>

          <!-- Análisis de Cuentas -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Análisis de Cuentas</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="account in reportData.accountAnalysis" :key="account._id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ account.name }}</h5>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ account.type }}</span>
                </div>
                <p class="text-xl font-bold" :class="account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ currencySymbol }} {{ formatAmount(account.balance) }}
                </p>
                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>{{ account.transactionCount }} transacciones</p>
                  <p>Última: {{ formatDate(account.lastTransaction) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tendencias -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tendencias</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 class="font-medium text-gray-900 dark:text-white mb-2">Tendencia de Ingresos</h5>
                <div class="flex items-center">
                  <span class="text-2xl mr-2">{{ reportData.incomeTrend.icon }}</span>
                  <div>
                    <p class="font-semibold" :class="reportData.incomeTrend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ reportData.incomeTrend.percentage }}%
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ reportData.incomeTrend.description }}</p>
                  </div>
                </div>
              </div>
              <div>
                <h5 class="font-medium text-gray-900 dark:text-white mb-2">Tendencia de Gastos</h5>
                <div class="flex items-center">
                  <span class="text-2xl mr-2">{{ reportData.expenseTrend.icon }}</span>
                  <div>
                    <p class="font-semibold" :class="reportData.expenseTrend.direction === 'up' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                      {{ reportData.expenseTrend.percentage }}%
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ reportData.expenseTrend.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted, computed } from 'vue'

console.log('ReportModal montado');

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currencyCode: { type: String, default: 'PEN' }
})

const emit = defineEmits(['close'])

const isLoading = ref(false)
const error = ref(null)
const reportData = ref({
  totalIncome: 0,
  totalExpenses: 0,
  netBalance: 0,
  totalTransactions: 0,
  activeAccounts: 0,
  incomeByMonth: {},
  expensesByMonth: {},
  incomeByCategory: {},
  expensesByCategory: {},
  maxIncome: 0,
  maxExpenses: 0,
  maxIncomeCategory: 0,
  maxExpenseCategory: 0,
  averageIncome: { daily: 0, monthly: 0, yearly: 0 },
  averageExpenses: { daily: 0, monthly: 0, yearly: 0 },
  largestDebt: { amount: 0, account: '' },
  largestLoan: { amount: 0, account: '' },
  accountAnalysis: [],
  incomeTrend: { icon: '📈', direction: 'up', percentage: 0, description: '' },
  expenseTrend: { icon: '📉', direction: 'down', percentage: 0, description: '' }
})

const currencySymbol = computed(() => {
  switch (props.currencyCode) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'PEN': default: return 'S/';
  }
})

// Función de utilidad para formatear montos
const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00'
  const num = Number(amount)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Función para calcular porcentajes
const getPercentage = (value, max) => {
  if (max === 0) return 0
  return Math.min((value / max) * 100, 100)
}

// Función para cargar datos del reporte
const loadReportData = async () => {
  console.log('Ejecutando loadReportData');
  try {
    isLoading.value = true
    error.value = null

    // Usar el nuevo endpoint de reportes
    const response = await fetch('http://localhost:3000/api/reports')
    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    // Mapear los datos del endpoint a la estructura esperada por el componente
    reportData.value = {
      totalIncome: data.total_income || 0,
      totalExpenses: data.total_expenses || 0,
      netBalance: data.net_balance || 0,
      totalTransactions: data.total_transactions || 0,
      activeAccounts: data.active_accounts || 0,
      incomeByMonth: data.income_by_month || {},
      expensesByMonth: data.expenses_by_month || {},
      incomeByCategory: data.income_by_category || {},
      expensesByCategory: data.expenses_by_category || {},
      maxIncome: data.max_income || 0,
      maxExpenses: data.max_expenses || 0,
      maxIncomeCategory: data.max_income_category || 0,
      maxExpenseCategory: data.max_expense_category || 0,
      averageIncome: {
        daily: data.average_income?.diario || 0,
        monthly: data.average_income?.mensual || 0,
        yearly: data.average_income?.anual || 0
      },
      averageExpenses: {
        daily: data.average_expenses?.diario || 0,
        monthly: data.average_expenses?.mensual || 0,
        yearly: data.average_expenses?.anual || 0
      },
      largestDebt: {
        amount: data.largest_debt?.monto || 0,
        account: data.largest_debt?.cuenta || ''
      },
      largestLoan: {
        amount: data.largest_loan?.monto || 0,
        account: data.largest_loan?.cuenta || ''
      },
      accountAnalysis: data.account_analysis?.map(account => ({
        _id: account._id,
        name: account.nombre,
        type: account.tipo,
        balance: account.saldo,
        transactionCount: account.transaccionesCount,
        lastTransaction: account.ultimaTransaccion
      })) || [],
      incomeTrend: {
        icon: data.income_trend?.icono || '📈',
        direction: data.income_trend?.direccion || 'up',
        percentage: data.income_trend?.porcentaje || 0,
        description: data.income_trend?.descripcion || 'Sin datos suficientes'
      },
      expenseTrend: {
        icon: data.expense_trend?.icono || '📉',
        direction: data.expense_trend?.direccion || 'down',
        percentage: data.expense_trend?.porcentaje || 0,
        description: data.expense_trend?.descripcion || 'Sin datos suficientes'
      }
    }

  } catch (err) {
    console.error('Error loading report data:', err)
    error.value = err.message || 'Error al cargar los datos del reporte'
  } finally {
    isLoading.value = false
  }
}

// Cargar datos cuando se abre el modal
watch(() => props.isOpen, (newValue) => {
  console.log('isOpen cambió:', newValue)
  if (newValue) {
    loadReportData()
  }
})

// Si el modal ya está abierto al montar, carga los datos
onMounted(() => {
  if (props.isOpen) {
    loadReportData()
  }
})

const openReportModal = () => {
  showReportModal.value = false; // fuerza desmontaje
  setTimeout(() => {
    showReportModal.value = true;
  }, 10);
}
</script> 