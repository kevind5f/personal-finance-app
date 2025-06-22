<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {{ isIncome ? 'Nuevo Ingreso' : 'Nuevo Gasto' }}
      </h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto</label>
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <span v-if="amountError" class="text-xs text-red-500 mt-1 block">El monto debe ser positivo</span>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
          <select
            id="category"
            v-model="form.category"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <div v-if="subcategoriesForSelected.length">
          <label for="subcategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategoría</label>
          <select
            id="subcategory"
            v-model="form.subcategory"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Selecciona una subcategoría</option>
            <option v-for="sub in subcategoriesForSelected" :key="sub.id" :value="sub.name">{{ sub.name }}</option>
          </select>
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
          <input
            id="date"
            v-model="form.date"
            type="date"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label for="account" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta</label>
          <select
            id="account"
            v-model="form.accountId"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option v-for="account in accounts" :key="account._id" :value="account._id">
              {{ account.name }} ({{ account.type }})
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {{ isIncome ? 'Registrar Ingreso' : 'Registrar Gasto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'

interface Account {
  _id: string
  name: string
  type: string
}

// Estructura local de categorías y subcategorías (puedes centralizarla luego)
const expenseCategories = [
  { name: 'Alimentación', subcategories: [
    { id: 1, name: 'Supermercado' },
    { id: 2, name: 'Restaurantes' },
    { id: 3, name: 'Delivery' },
    { id: 4, name: 'Café y Snacks' }
  ]},
  { name: 'Transporte', subcategories: [
    { id: 5, name: 'Gasolina' },
    { id: 6, name: 'Mantenimiento' },
    { id: 7, name: 'Estacionamiento' },
    { id: 8, name: 'Transporte Público' }
  ]},
  { name: 'Entretenimiento', subcategories: [
    { id: 9, name: 'Cine y Teatro' },
    { id: 10, name: 'Videojuegos' },
    { id: 11, name: 'Deportes' },
    { id: 12, name: 'Hobbies' }
  ]},
  { name: 'Servicios', subcategories: [
    { id: 13, name: 'Electricidad' },
    { id: 14, name: 'Agua' },
    { id: 15, name: 'Internet' },
    { id: 16, name: 'Telefonía' }
  ]},
  { name: 'Vivienda', subcategories: [] },
  { name: 'Salud', subcategories: [] },
  { name: 'Educación', subcategories: [] },
  { name: 'Vestimenta', subcategories: [] },
  { name: 'Compras', subcategories: [] },
  { name: 'Deudas', subcategories: [] },
  { name: 'Regalos', subcategories: [] },
  { name: 'Otro', subcategories: [] }
]

const incomeCategories = [
  { name: 'Salario', subcategories: [
    { id: 1, name: 'Salario Base' },
    { id: 2, name: 'Bonificaciones' },
    { id: 3, name: 'Horas Extras' },
    { id: 4, name: 'Comisiones' }
  ]},
  { name: 'Inversiones', subcategories: [
    { id: 5, name: 'Dividendos' },
    { id: 6, name: 'Intereses' },
    { id: 7, name: 'Ganancias de Capital' },
    { id: 8, name: 'Rendimientos' }
  ]},
  { name: 'Negocios', subcategories: [
    { id: 9, name: 'Ventas' },
    { id: 10, name: 'Consultoría' },
    { id: 11, name: 'Freelance' },
    { id: 12, name: 'Alquileres' }
  ]},
  { name: 'Otros Ingresos', subcategories: [
    { id: 13, name: 'Regalos' },
    { id: 14, name: 'Reembolsos' },
    { id: 15, name: 'Premios' },
    { id: 16, name: 'Ventas Personales' }
  ]},
  { name: 'Otro', subcategories: [] }
]

export default defineComponent({
  name: 'TransactionForm',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    isIncome: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const accounts = ref<Account[]>([])
    const form = ref({
      amount: 0,
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0],
      accountId: '',
      type: props.isIncome ? 'income' : 'expense'
    })
    const amountError = ref(false)

    // Selección de categorías según tipo
    const categories = computed(() => props.isIncome ? incomeCategories : expenseCategories)

    // Subcategorías para la categoría seleccionada
    const subcategoriesForSelected = computed(() => {
      const cat = categories.value.find(c => c.name === form.value.category)
      return cat && cat.subcategories ? cat.subcategories : []
    })

    onMounted(async () => {
      try {
        const response = await fetch('http://localhost:3000/api/accounts')
        if (response.ok) {
          accounts.value = await response.json()
          if (accounts.value.length > 0) {
            form.value.accountId = accounts.value[0]._id
          }
        }
      } catch (error) {
        console.error('Error loading accounts:', error)
      }
    })

    // Validar monto positivo
    watch(() => form.value.amount, (val) => {
      amountError.value = val <= 0
    })

    const handleSubmit = () => {
      if (form.value.amount <= 0) {
        amountError.value = true
        return
      }
      // Si no hay subcategoría, no la envíes
      const dataToSend = { ...form.value }
      if (!subcategoriesForSelected.value.length) {
        if ("subcategory" in dataToSend) dataToSend.subcategory = ''
      }
      emit('submit', dataToSend)
      form.value = {
        amount: 0,
        category: '',
        subcategory: '',
        date: new Date().toISOString().split('T')[0],
        accountId: accounts.value.length > 0 ? accounts.value[0]._id : '',
        type: props.isIncome ? 'income' : 'expense'
      }
    }

    return {
      accounts,
      form,
      categories,
      subcategoriesForSelected,
      amountError,
      handleSubmit
    }
  }
})
</script> 