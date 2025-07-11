<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-10 sm:px-8 lg:px-16">
      <!-- Header -->
      <div class="mb-12 flex items-center gap-4 px-2 py-6 rounded-2xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 shadow">
        <span class="text-4xl bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full p-4 shadow">⚙️</span>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-300 text-base">Gestiona tus cuentas, categorías y reportes</p>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="navigateTo('/dashboard')" class="px-5 py-3 text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 border border-blue-200 dark:border-blue-800 transition flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span class="mr-2">←</span>
            Volver al Dashboard
          </button>
        </div>
      </div>
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-8">
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
      <!-- Contenido Principal -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Gestión de Cuentas -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col">
          <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <span class="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full p-2">🏦</span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Gestión de Cuentas</h2>
          </div>
          <div class="p-8 space-y-4 flex-1">
            <div v-if="accounts.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">No hay cuentas configuradas</p>
              <button @click="openAccountModal" class="px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow border border-blue-700 transition mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Crear Primera Cuenta
              </button>
            </div>
            <div v-else v-for="account in accounts" :key="account._id" class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p class="font-medium dark:text-white">{{ account.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ account.type }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-lg font-semibold" :class="account.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ currencySymbol }}{{ formatAmount(account.balance) }}
                </span>
                <button 
                  @click="deleteAccount(account)" 
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Eliminar cuenta"
                >
                  🗑️
                </button>
              </div>
            </div>
            <button @click="openAccountModal" class="px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow border border-blue-700 transition w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              Añadir Nueva Cuenta
            </button>
          </div>
        </div>
        <!-- Gestión de Categorías de Gastos -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col">
          <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <span class="text-2xl bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-full p-2">💸</span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Categorías de Gastos</h2>
          </div>
          <div class="p-8 space-y-4 flex-1">
            <div v-for="category in expenseCategories" :key="category.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="mb-2 flex justify-between items-center">
                <h3 class="font-semibold text-gray-900 dark:text-white text-lg">{{ category.name }}</h3>
                <div class="flex items-center space-x-2">
                  <button @click="addSubcategory(category)" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    + Subcategoría
                  </button>
                  <button @click="deleteCategory('expense', category)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    🗑️
                </button>
                </div>
              </div>
              <div v-if="category.subcategories?.length" class="space-y-2">
                <div v-for="sub in category.subcategories" :key="sub.id" class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pl-2 group">
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    <span v-if="!sub.isEditing">{{ sub.name }}</span>
                    <input 
                      v-else
                      v-model="sub.editName"
                      @keyup.enter="saveSubcategory(category, sub)"
                      @keyup.esc="cancelEditSubcategory(sub)"
                      class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-sm w-32"
                      ref="editInput"
                    />
                  </div>
                  <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      v-if="!sub.isEditing"
                      @click="editSubcategory(sub)" 
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      ✎
                    </button>
                    <button 
                      v-if="!sub.isEditing"
                      @click="deleteSubcategory(category, sub)" 
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      🗑️
                    </button>
                    <button 
                      v-if="sub.isEditing"
                      @click="saveSubcategory(category, sub)" 
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      ✓
                    </button>
                    <button 
                      v-if="sub.isEditing"
                      @click="cancelEditSubcategory(sub)" 
                      class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                Sin subcategorías
              </div>
            </div>
            <button @click="openCategoryModal('expense')" class="px-6 py-3 text-base font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow border border-red-700 transition w-full focus:outline-none focus:ring-2 focus:ring-red-500">
              Nueva Categoría de Gasto
            </button>
          </div>
        </div>
        <!-- Gestión de Categorías de Ingresos -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col">
          <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <span class="text-2xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full p-2">💰</span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Categorías de Ingresos</h2>
          </div>
          <div class="p-8 space-y-4 flex-1">
            <div v-for="category in incomeCategories" :key="category.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="mb-2 flex justify-between items-center">
                <h3 class="font-semibold text-gray-900 dark:text-white text-lg">{{ category.name }}</h3>
                <div class="flex items-center space-x-2">
                  <button @click="addSubcategory(category)" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    + Subcategoría
                  </button>
                  <button @click="deleteCategory('income', category)" class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    🗑️
                </button>
                </div>
              </div>
              <div v-if="category.subcategories?.length" class="space-y-2">
                <div v-for="sub in category.subcategories" :key="sub.id" class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pl-2 group">
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    <span v-if="!sub.isEditing">{{ sub.name }}</span>
                    <input 
                      v-else
                      v-model="sub.editName"
                      @keyup.enter="saveSubcategory(category, sub)"
                      @keyup.esc="cancelEditSubcategory(sub)"
                      class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-sm w-32"
                      ref="editInput"
                    />
                  </div>
                  <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      v-if="!sub.isEditing"
                      @click="editSubcategory(sub)" 
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      ✎
                    </button>
                    <button 
                      v-if="!sub.isEditing"
                      @click="deleteSubcategory(category, sub)" 
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      🗑️
                    </button>
                    <button 
                      v-if="sub.isEditing"
                      @click="saveSubcategory(category, sub)" 
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      ✓
                    </button>
                    <button 
                      v-if="sub.isEditing"
                      @click="cancelEditSubcategory(sub)" 
                      class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      ✗
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400 italic">
                Sin subcategorías
              </div>
            </div>
            <button @click="openCategoryModal('income')" class="px-6 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow border border-green-700 transition w-full focus:outline-none focus:ring-2 focus:ring-green-500">
              Nueva Categoría de Ingreso
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Cuenta -->
    <ClientOnly>
      <AccountForm
        v-if="showAccountModal"
        :is-open="showAccountModal"
        @close="closeAccountModal"
        @submit="handleAccountSubmit"
      />
    </ClientOnly>

    <!-- Modal de Subcategoría -->
    <ClientOnly>
      <SubcategoryModal
        v-if="showSubcategoryModal"
        :is-open="showSubcategoryModal"
        :category-name="selectedCategory?.name || ''"
        @close="closeSubcategoryModal"
        @submit="handleSubcategorySubmit"
      />
    </ClientOnly>

    <!-- Modal de Categoría -->
    <ClientOnly>
      <CategoryModal
        v-if="showCategoryModal"
        :is-open="showCategoryModal"
        :category-type="categoryType"
        @close="closeCategoryModal"
        @submit="handleCategorySubmit"
    />
    </ClientOnly>
  </div>
</template>

<script setup>
import ReportModal from '~/components/ReportModal.vue'
import AccountForm from '~/components/AccountForm.vue'
import SubcategoryModal from '~/components/SubcategoryModal.vue'
import CategoryModal from '~/components/CategoryModal.vue'
import { ref, onMounted, computed } from 'vue'

// Estado de carga y error
const isLoading = ref(true)
const error = ref(null)

// Estado para las cuentas (cargadas desde API)
const accounts = ref([])

// Función de utilidad para formatear montos
const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00'
  const num = Number(amount)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// Función para cargar las cuentas desde la API
const loadAccounts = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Cargar cuentas
    const accountsResponse = await fetch('http://localhost:3000/api/accounts')
    const accountsData = await accountsResponse.json()
    
    // Cargar transacciones para contar por cuenta
    const transactionsResponse = await fetch('http://localhost:3000/api/transactions')
    const transactionsData = await transactionsResponse.json()
    
    // Agregar conteo de transacciones a cada cuenta
    const accountsWithTransactionCount = Array.isArray(accountsData) ? accountsData.map(account => {
      const transactionCount = Array.isArray(transactionsData) 
        ? transactionsData.filter(t => t.accountId === account._id).length 
        : 0
      return {
        ...account,
        transactionCount
      }
    }) : []
    
    accounts.value = accountsWithTransactionCount
  } catch (err) {
    console.error('Error loading accounts:', err)
    error.value = err.message || 'Error al cargar las cuentas'
    accounts.value = []
  } finally {
    isLoading.value = false
  }
}

// Estado del modal de cuentas
const showAccountModal = ref(false)

// Estado del modal de subcategorías
const showSubcategoryModal = ref(false)
const selectedCategory = ref(null)

// Estado del modal de categorías
const showCategoryModal = ref(false)
const categoryType = ref('expense')

// Estado para las categorías (mantenidas como antes)
const expenseCategories = ref([
  { 
    id: 1, 
    name: 'Alimentación',
    subcategories: [
      { id: 1, name: 'Supermercado' },
      { id: 2, name: 'Restaurantes' },
      { id: 3, name: 'Delivery' },
      { id: 4, name: 'Café y Snacks' }
    ]
  },
  { 
    id: 2, 
    name: 'Transporte',
    subcategories: [
      { id: 3, name: 'Gasolina' },
      { id: 4, name: 'Mantenimiento' },
      { id: 5, name: 'Estacionamiento' },
      { id: 6, name: 'Transporte Público' }
    ]
  },
  {
    id: 3,
    name: 'Entretenimiento',
    subcategories: [
      { id: 7, name: 'Cine y Teatro' },
      { id: 8, name: 'Videojuegos' },
      { id: 9, name: 'Deportes' },
      { id: 10, name: 'Hobbies' }
    ]
  },
  {
    id: 4,
    name: 'Servicios',
    subcategories: [
      { id: 11, name: 'Electricidad' },
      { id: 12, name: 'Agua' },
      { id: 13, name: 'Internet' },
      { id: 14, name: 'Telefonía' }
    ]
  }
])

const incomeCategories = ref([
  { 
    id: 1, 
    name: 'Salario',
    subcategories: [
      { id: 1, name: 'Salario Base' },
      { id: 2, name: 'Bonificaciones' },
      { id: 3, name: 'Horas Extras' },
      { id: 4, name: 'Comisiones' }
    ]
  },
  { 
    id: 2, 
    name: 'Inversiones',
    subcategories: [
      { id: 5, name: 'Dividendos' },
      { id: 6, name: 'Intereses' },
      { id: 7, name: 'Ganancias de Capital' },
      { id: 8, name: 'Rendimientos' }
    ]
  },
  {
    id: 3,
    name: 'Negocios',
    subcategories: [
      { id: 9, name: 'Ventas' },
      { id: 10, name: 'Consultoría' },
      { id: 11, name: 'Freelance' },
      { id: 12, name: 'Alquileres' }
    ]
  },
  {
    id: 4,
    name: 'Otros Ingresos',
    subcategories: [
      { id: 13, name: 'Regalos' },
      { id: 14, name: 'Reembolsos' },
      { id: 15, name: 'Premios' },
      { id: 16, name: 'Ventas Personales' }
    ]
  }
])

// Estado del modal de reportes
const showReportModal = ref(false)

// Funciones para manejar las cuentas
const openAccountModal = () => {
  showAccountModal.value = true
}

const closeAccountModal = () => {
  showAccountModal.value = false
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

const deleteAccount = async (account) => {
  // Verificar si la cuenta tiene transacciones asociadas
  const hasTransactions = account.transactionCount > 0
  
  let confirmMessage = `¿Estás seguro de que quieres eliminar la cuenta "${account.name}"?`
  if (hasTransactions) {
    confirmMessage += `\n\n⚠️ Esta cuenta tiene ${account.transactionCount} transacciones asociadas. Eliminarla también eliminará todas las transacciones relacionadas.`
  }
  
  if (confirm(confirmMessage)) {
    try {
      // Primero eliminar las transacciones asociadas si las hay
      if (hasTransactions) {
        const transactionsResponse = await fetch(`http://localhost:3000/api/transactions?accountId=${account._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!transactionsResponse.ok) {
          console.error('Error al eliminar transacciones asociadas')
        }
      }
      
      // Luego eliminar la cuenta
      const response = await fetch(`http://localhost:3000/api/accounts?id=${account._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Remover la cuenta de la lista local
        const index = accounts.value.findIndex(a => a._id === account._id)
        if (index > -1) {
          accounts.value.splice(index, 1)
        }
        
        // Mostrar mensaje de éxito
        const successMessage = hasTransactions 
          ? `Cuenta "${account.name}" eliminada exitosamente junto con ${account.transactionCount} transacciones asociadas.`
          : `Cuenta "${account.name}" eliminada exitosamente.`
        
        alert(successMessage)
        console.log('Cuenta eliminada exitosamente')
      } else {
        console.error('Error al eliminar la cuenta')
        alert('Error al eliminar la cuenta. Inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error al eliminar la cuenta. Inténtalo de nuevo.')
    }
  }
}

const editAccount = (account) => {
  // Implementar lógica para editar cuenta
  console.log('Editar cuenta:', account)
}

const openCategoryModal = (type) => {
  categoryType.value = type
  showCategoryModal.value = true
}

const editCategory = (category) => {
  // Implementar lógica para editar categoría
  console.log('Editar categoría:', category)
}

// Funciones para manejar subcategorías
const addSubcategory = (category) => {
  selectedCategory.value = category
  showSubcategoryModal.value = true
}

const closeSubcategoryModal = () => {
  showSubcategoryModal.value = false
  selectedCategory.value = null
}

const handleSubcategorySubmit = (subcategoryName) => {
  if (selectedCategory.value) {
    const newId = Math.max(...selectedCategory.value.subcategories.map(sub => sub.id), 0) + 1
    const newSubcategory = {
      id: newId,
      name: subcategoryName
    }
    selectedCategory.value.subcategories.push(newSubcategory)
    closeSubcategoryModal()
  }
}

const editSubcategory = (subcategory) => {
  subcategory.isEditing = true
  subcategory.editName = subcategory.name
  
  // Enfocar el input después de que se renderice
  nextTick(() => {
    const inputs = document.querySelectorAll('input[ref="editInput"]')
    const input = Array.from(inputs).find(input => input.value === subcategory.editName)
    if (input) {
      input.focus()
      input.select()
    }
  })
}

const saveSubcategory = (category, subcategory) => {
  if (subcategory.editName && subcategory.editName.trim()) {
    subcategory.name = subcategory.editName.trim()
    subcategory.isEditing = false
    delete subcategory.editName
  }
}

const cancelEditSubcategory = (subcategory) => {
  subcategory.isEditing = false
  delete subcategory.editName
}

const deleteSubcategory = (category, subcategory) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la subcategoría "${subcategory.name}"?`)) {
    const index = category.subcategories.findIndex(sub => sub.id === subcategory.id)
    if (index > -1) {
      category.subcategories.splice(index, 1)
    }
  }
}

// Funciones para manejar categorías
const handleCategorySubmit = (categoryData) => {
  if (categoryType.value === 'expense') {
    expenseCategories.value.push(categoryData)
  } else {
    incomeCategories.value.push(categoryData)
  }
  closeCategoryModal()
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
}

const deleteCategory = (type, category) => {
  const categoryType = type === 'expense' ? 'Gasto' : 'Ingreso'
  if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}" y todas sus subcategorías?`)) {
    if (type === 'expense') {
      const index = expenseCategories.value.findIndex(cat => cat.id === category.id)
      if (index > -1) {
        expenseCategories.value.splice(index, 1)
      }
    } else {
      const index = incomeCategories.value.findIndex(cat => cat.id === category.id)
      if (index > -1) {
        incomeCategories.value.splice(index, 1)
      }
    }
  }
}

// Funciones para el modal de reportes
const openReportModal = () => {
  showReportModal.value = true
}

const closeReportModal = () => {
  showReportModal.value = false
}

const handleReportGenerate = (reportConfig) => {
  console.log('Generando reporte con configuración:', reportConfig)
  closeReportModal()
}

// Cargar datos al montar el componente
onMounted(async () => {
  await loadAccounts()
  const currencyCode = ref('PEN')
  const currencySymbol = computed(() => {
    switch (currencyCode.value) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'PEN': default: return 'S/';
    }
  })
  try {
    const res = await fetch('/api/clientes')
    const data = await res.json()
    currencyCode.value = data?.configuraciones?.moneda_principal || 'PEN'
  } catch {}
})
</script> 