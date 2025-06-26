<template>
    <div>
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-12 flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1 flex items-center gap-2">
                <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg px-3 py-1 text-2xl">💰</span>
                Dashboard
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-400">Bienvenido a tu panel de control financiero</p>
            </div>
            <div class="flex flex-wrap items-center gap-2 justify-end">
                <button 
                @click="toggleTheme" 
                class="p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xl"
                :title="isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
                >
                <span v-if="isDarkMode">☀️</span>
                <span v-else>🌙</span>
                </button>
            <button @click="openReportModal" class="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
              <span>📊</span> Reportes
            </button>
                <button @click="navigateTo('/settings')" class="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
                <span>⚙️</span> Configuración
                </button>
                <button
                @click="handleLogout"
                class="px-4 py-2 rounded-md border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 font-semibold transition"
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
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="rounded-xl shadow-sm p-6 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-gray-800 flex items-center gap-4">
                <div class="text-3xl text-green-800 dark:text-green-200 bg-green-400 dark:bg-green-700 bg-opacity-90 dark:bg-opacity-90 rounded-full p-3 flex items-center justify-center" style="min-width:3.5rem; min-height:3.5rem;">💵</div>
                <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Balance Total</h3>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatAmount(dashboardSummary.total_balance) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Balance actual de todas las cuentas</p>
                </div>
            </div>
            <div class="rounded-xl shadow-sm p-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-gray-800 flex items-center gap-4">
                <div class="text-3xl text-blue-800 dark:text-blue-200 bg-blue-400 dark:bg-blue-700 bg-opacity-90 dark:bg-opacity-90 rounded-full p-3 flex items-center justify-center" style="min-width:3.5rem; min-height:3.5rem;">⬆️</div>
                <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Ingresos Mensuales</h3>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatAmount(dashboardSummary.monthly_income) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Ingresos del mes actual</p>
                </div>
            </div>
            <div class="rounded-xl shadow-sm p-6 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900 dark:to-gray-800 flex items-center gap-4">
                <div class="text-3xl text-red-800 dark:text-red-200 bg-red-400 dark:bg-red-700 bg-opacity-90 dark:bg-opacity-90 rounded-full p-3 flex items-center justify-center" style="min-width:3.5rem; min-height:3.5rem;">⬇️</div>
                <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Gastos Mensuales</h3>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatAmount(dashboardSummary.monthly_expenses) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Gastos del mes actual</p>
                </div>
            </div>
            </div>

            <!-- Cuentas -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-gray-700">
            <div class="px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span class="text-xl">🏦</span>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Mis Cuentas</h2>
            </div>
            <div class="p-8">
              <div v-if="availableAccounts.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">No hay cuentas disponibles</p>
                <button @click="openAccountModal" class="px-5 py-2 rounded-md border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 font-medium transition mt-4">
                  Crear Primera Cuenta
                </button>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="account in availableAccounts" :key="account._id" 
                    class="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 flex flex-col shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 transition cursor-pointer">
                    <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span class="inline-block text-lg">💳</span> {{ account.name }}
                        </h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ account.type }}</p>
                    </div>
                    <button @click.stop="showAccountOperations(account)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium px-2 py-1 rounded transition border border-transparent hover:border-blue-300 dark:hover:border-blue-300 bg-transparent">
                      📊 Operaciones
                    </button>
                    </div>
                    <div class="mt-4">
                    <p class="text-xl font-bold text-green-700 dark:text-green-300">
                      ${{ formatAmount(account.balance) }}
                    </p>
                    <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Disponible
                    </span>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <!-- Acciones Rápidas -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-gray-700">
            <div class="px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span class="text-xl">⚡</span>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Acciones Rápidas</h2>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                <button @click="openTransactionModal('income')" class="flex flex-col items-center justify-center gap-2 py-5 text-base rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
                <span class="text-2xl">💰</span>
                Añadir Ingreso
                </button>
                <button @click="openTransactionModal('expense')" class="flex flex-col items-center justify-center gap-2 py-5 text-base rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
                <span class="text-2xl">💸</span>
                Añadir Gasto
                </button>
                <button @click="openLoanModal(true)" class="flex flex-col items-center justify-center gap-2 py-5 text-base rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
                <span class="text-2xl">🏦</span>
                Nuevo Préstamo
                </button>
                <button @click="openLoanModal(false)" class="flex flex-col items-center justify-center gap-2 py-5 text-base rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
                <span class="text-2xl">📝</span>
                Nueva Deuda
                </button>
                <button @click="openTransferModal" class="flex flex-col items-center justify-center gap-2 py-5 text-base rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition">
                <span class="text-2xl">🔄</span>
                Nueva Transferencia
                </button>
            </div>
            </div>

            <!-- Manejo de Deudas -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-gray-700"
                 :style="`min-height: 180px; height: auto; max-height: ${Math.max(320, 80 * deudas.filter(d => d.estado !== 'finalizada').length)}px; overflow-y: auto;`">
              <div class="px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span class="text-xl">📝</span>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Mis Deudas</h2>
              </div>
              <div class="p-8">
                <div v-if="deudas.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">No tienes deudas registradas</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="deuda in deudas" :key="deuda._id" @click="openDetailModal(deuda, 'deuda')" class="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700 pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
                       v-show="deuda.estado !== 'finalizada'">
                    <div class="flex-grow">
                      <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">💳 {{ deuda.nombre }}</h3>
                      <p class="text-gray-600 dark:text-gray-400">{{ deuda.motivo }}</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500">Adquirida: {{ formatDate(deuda.fecha_adquisicion) }} | Cuotas: {{ deuda.numero_cuotas }} | Tasa: {{ deuda.tasa_interes }}%</p>
                    </div>
                    <span class="text-base font-semibold text-red-700 dark:text-red-300 mt-2 md:mt-0">${{ formatAmount(deuda.monto) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Manejo de Préstamos -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-gray-700"
                 :style="`min-height: 180px; height: auto; max-height: ${Math.max(320, 80 * prestamos.filter(p => p.estado !== 'finalizado').length)}px; overflow-y: auto;`">
              <div class="px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span class="text-xl">🏦</span>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Mis Préstamos</h2>
              </div>
              <div class="p-8">
                <div v-if="prestamos.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">No tienes préstamos registrados</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="prestamo in prestamos" :key="prestamo._id" @click="openDetailModal(prestamo, 'prestamo')" class="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700 pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
                       v-show="prestamo.estado !== 'finalizado'">
                    <div class="flex-grow">
                      <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">💳 {{ prestamo.nombre }}</h3>
                      <p class="text-gray-600 dark:text-gray-400">{{ prestamo.motivo }}</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500">Otorgado: {{ formatDate(prestamo.fecha_otorgamiento) }} | Cuotas: {{ prestamo.numero_cuotas }} | Tasa: {{ prestamo.tasa_interes }}%</p>
                    </div>
                    <span class="text-base font-semibold text-blue-700 dark:text-blue-300 mt-2 md:mt-0">${{ formatAmount(prestamo.monto) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gestión de Ahorros y Metas -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-gray-700">
            <div class="px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span class="text-xl">🎯</span>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Ahorros y Metas</h2>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">Metas de Ahorro</h3>
                <div class="flex justify-end mb-2">
                  <button @click="openGoalModal" class="px-4 py-2 rounded-md border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800 font-medium transition">
                    <span class="mr-2">➕</span>Nueva Meta
                  </button>
                </div>
                <div v-if="Array.isArray(savingsGoals) && savingsGoals.length > 0" class="space-y-4">
                  <div v-for="goal in savingsGoals" :key="goal._id" class="space-y-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow transition">
                    <div class="flex justify-between items-center">
                      <h3 class="font-medium text-gray-900 dark:text-white">{{ goal.name || goal.nombre }}</h3>
                      <span class="text-xs text-gray-600 dark:text-gray-400">{{ goal.targetDate || goal.fechaObjetivo }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                      <div
                        class="bg-green-600 h-2.5 rounded-full"
                        :style="{ width: ((goal.currentAmount || goal.montoActual || 0) / (goal.targetAmount || goal.montoObjetivo || 1) * 100) + '%' }"
                      ></div>
                    </div>
                    <div class="flex justify-between text-xs mt-1">
                      <span class="text-green-700 dark:text-green-300">${{ formatAmount(goal.currentAmount || goal.montoActual || 0) }}</span>
                      <span class="text-gray-500 dark:text-gray-400">Meta: ${{ formatAmount(goal.targetAmount || goal.montoObjetivo || 0) }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400">No tienes metas de ahorro registradas</div>
                </div>
                <div class="space-y-4">
                <h3 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">Presupuestos</h3>
                <div class="flex justify-end mb-2">
                  <button @click="openBudgetModal" class="px-4 py-2 rounded-md border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-800 font-medium transition">
                    <span class="mr-2">➕</span>Nuevo Presupuesto
                  </button>
                </div>
                <div v-if="Array.isArray(budgets) && budgets.length > 0" class="space-y-4">
                  <div v-for="budget in budgets" :key="budget._id" class="space-y-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div class="flex justify-between items-center">
                      <h3 class="font-medium text-gray-900 dark:text-white">{{ budget.category }}</h3>
                      <div class="flex items-center space-x-2">
                        <span class="text-xs px-2 py-1 rounded-full" 
                              :class="{
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': budget.type === 'gasto',
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': budget.type === 'ingreso',
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': budget.type === 'ahorro',
                                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': budget.type === 'inversion'
                              }">
                          {{ budget.type }}
                        </span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ budget.month }}</span>
                      </div>
                    </div>
                    
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ budget.paymentMethod }}</span>
                      <span>{{ budget.frequency }}</span>
                    </div>
                    
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        class="bg-yellow-600 h-2.5 rounded-full"
                        :style="{ width: `${Math.min((budget.spentAmount / budget.totalBudget * 100), 100)}%` }"
                      ></div>
                    </div>
                    
                    <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Gastado: ${{ formatAmount(budget.spentAmount) }}</span>
                      <span>Presupuesto: ${{ formatAmount(budget.totalBudget) }}</span>
                    </div>
                    
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ budget.description }}</div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500 dark:text-gray-400 py-4">
                  No hay presupuestos registrados.
                </div>
                </div>
            </div>
            </div>

            <!-- Últimas Transacciones -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-gray-700">
              <div class="px-8 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span class="text-xl">💸</span>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Últimos Movimientos</h2>
              </div>
              <div class="p-8">
                <div v-if="safeTransactions.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
                  No hay movimientos recientes.
                </div>
                <div v-else class="space-y-4">
                  <div v-for="transaction in safeTransactions" :key="transaction._id"
                    class="flex items-center gap-4 p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700 bg-gradient-to-r"
                    :class="transaction.tipo === 'ingreso' ? 'from-green-50 to-green-100 dark:from-green-900 dark:to-gray-800' : 'from-red-50 to-red-100 dark:from-red-900 dark:to-gray-800'"
                    style="transition: box-shadow 0.2s;"
                  >
                    <div class="flex-shrink-0">
                      <span class="text-3xl rounded-full p-3"
                        :class="transaction.tipo === 'ingreso' ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200'"
                      >
                        {{ transaction.tipo === 'ingreso' ? '💰' : '💸' }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ transaction.descripcion || 'Sin descripción' }}</span>
                        <span class="text-xl font-bold"
                          :class="transaction.tipo === 'ingreso' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                        >
                          {{ transaction.tipo === 'ingreso' ? '+' : '-' }}${{ formatAmount(transaction.monto) }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center mt-1 text-sm">
                        <span class="text-gray-500 dark:text-gray-400">{{ formatDate(transaction.fecha) }}</span>
                        <span class="px-3 py-1 rounded-full text-xs font-medium"
                          :class="transaction.tipo === 'ingreso' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'"
                        >
                          {{ transaction.categoria }}
                        </span>
                      </div>
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
        :all-transactions="transactions"
        @close="closeAccountOperationsModal"
      />

      <DebtLoanDetailModal
        v-if="showDetailModal"
        :is-open="showDetailModal"
        :item="selectedItem"
        :item-type="selectedItemType"
        @close="closeDetailModal"
        @submit-payment="handlePayment"
      />

      <TransferForm
        v-if="showTransferModal"
        :is-open="showTransferModal"
        :accounts="accounts"
        @close="closeTransferModal"
        @submit="handleTransferSubmit"
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
import DebtLoanDetailModal from '~/components/DebtLoanDetailModal.vue'
import TransferForm from '~/components/TransferForm.vue'
import { useRouter } from 'vue-router'

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
const budgets = ref([])

// NUEVO: Estado para deudas y préstamos
const deudas = ref([])
const prestamos = ref([])

// Presupuesto mensual estimado
const monthlyBudget = ref(5000)

// NUEVO: Estado para el modal de detalles de deuda/préstamo
const showDetailModal = ref(false)
const selectedItem = ref(null)
const selectedItemType = ref('') // 'deuda' or 'prestamo'

// Computed property para transacciones seguras
const safeTransactions = computed(() => {
  return Array.isArray(transactions.value) ? transactions.value.slice(0, 10) : []
})

// Computed property para cuentas disponibles (excluye deudas y cuentas con saldo negativo)
const availableAccounts = computed(() => {
  return accounts.value.filter(account => {
    // Incluir solo cuentas con saldo positivo o cuentas de tipo corriente/ahorro/efectivo/inversión
    const positiveBalance = account.balance >= 0
    const validAccountType = ['corriente', 'ahorro', 'efectivo', 'inversion'].includes(account.type)
    return positiveBalance && validAccountType
  })
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
    budgets.value = []
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
    budgets.value = Array.isArray(budgetData) ? budgetData : []

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
    budgets.value = []
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
        category: budgetData.category,
        totalBudget: budgetData.amount,
        spentAmount: 0,
        month: budgetData.month,
        description: budgetData.description
      })
    })

    if (response.ok) {
      await loadDashboardData() // Recargar todos los datos, incluyendo presupuestos
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

  const router = useRouter()
  router.replace('/login')
})

// Limpiar al desmontar
onBeforeUnmount(() => {
  // Limpiar cualquier suscripción o temporizador si es necesario
  accounts.value = []
  transactions.value = []
  savingsGoals.value = []
  budget.value = null
  budgets.value = []
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

// Funciones para el modal de detalles
const openDetailModal = (item, type) => {
  selectedItem.value = item
  selectedItemType.value = type
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
  selectedItemType.value = ''
}

const handlePayment = (payment) => {
  const list = selectedItemType.value === 'deuda' ? deudas.value : prestamos.value
  const item = list.find(i => i._id === payment.itemId)
  if (item) {
    if (!item.payments) {
      item.payments = []
    }
    // Agregamos el pago al principio del array para que aparezca primero
    item.payments.unshift({ amount: payment.amount, date: payment.date })
  }
  // En una aplicación real, aquí llamarías a un endpoint para guardar el pago:
  // await fetch(`/api/${selectedItemType.value}s/${payment.itemId}/payments`, { ... })
  console.log('Pago registrado (solo en frontend):', payment)
}

const showTransferModal = ref(false)

const openTransferModal = () => {
  showTransferModal.value = true
}

const closeTransferModal = () => {
  showTransferModal.value = false
}

const handleTransferSubmit = async (transfer) => {
  try {
    // 1. Registrar transacción de salida en cuenta origen
    await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: transfer.amount,
        category: 'Transferencia interna',
        description: transfer.description,
        date: transfer.date,
        accountId: transfer.fromAccountId,
        type: 'expense'
      })
    })
    // 2. Registrar transacción de entrada en cuenta destino
    await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: transfer.amount,
        category: 'Transferencia interna',
        description: transfer.description,
        date: transfer.date,
        accountId: transfer.toAccountId,
        type: 'income'
      })
    })
    await loadDashboardData()
    closeTransferModal()
  } catch (error) {
    console.error('Error creando transferencia interna:', error)
  }
}
</script> 