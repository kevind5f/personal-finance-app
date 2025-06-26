<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[80vh] border border-gray-200 dark:border-gray-800 flex flex-col">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-2xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full p-2">🎯</span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nueva Meta de Ahorro</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6 overflow-y-auto flex-1">
        <div v-if="error" class="bg-red-100 text-red-700 rounded-md p-3 mb-2 text-sm">{{ error }}</div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
        </div>
        <div>
          <label for="targetAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto Objetivo</label>
          <input
            id="targetAmount"
            v-model.number="form.targetAmount"
            type="number"
            step="0.01"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
        </div>
        <div>
          <label for="currentAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto Actual</label>
          <input
            id="currentAmount"
            v-model.number="form.currentAmount"
            type="number"
            step="0.01"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
        </div>
        <div>
          <label for="targetDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha Objetivo</label>
          <input
            id="targetDate"
            v-model="form.targetDate"
            type="date"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          ></textarea>
        </div>
        <div>
          <label for="accountId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cuenta de Ahorro</label>
          <select
            id="accountId"
            v-model="form.accountId"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          >
            <option disabled value="">Selecciona una cuenta</option>
            <option v-for="account in accounts" :key="account._id" :value="account._id">
              {{ account.name }}
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-6 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow border border-green-700 transition"
          >
            Crear Meta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'GoalForm',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const form = ref({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      description: '',
      accountId: ''
    })
    
    const accounts = ref<any[]>([])
    const error = ref('')

    const loadAccounts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/accounts')
        if (response.ok) {
          const data = await response.json()
          accounts.value = Array.isArray(data) ? data : []
        } else {
          accounts.value = []
        }
      } catch (error) {
        console.error('Error loading accounts:', error)
        accounts.value = []
      }
    }

    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        console.log('GoalForm modal is open, loading accounts...');
        loadAccounts()
      }
    }, { immediate: true })

    const handleSubmit = () => {
      error.value = ''
      if (!form.value.name.trim()) {
        error.value = 'El nombre de la meta es obligatorio.'
        return
      }
      if (isNaN(form.value.targetAmount) || form.value.targetAmount <= 0) {
        error.value = 'El monto objetivo debe ser mayor a 0.'
        return
      }
      if (isNaN(form.value.currentAmount) || form.value.currentAmount < 0) {
        error.value = 'El monto actual no puede ser negativo.'
        return
      }
      if (!form.value.targetDate) {
        error.value = 'Selecciona una fecha objetivo.'
        return
      }
      if (new Date(form.value.targetDate) < new Date()) {
        error.value = 'La fecha objetivo debe ser futura.'
        return
      }
      if (!form.value.accountId) {
        error.value = 'Selecciona una cuenta de ahorro.'
        return
      }
      emit('submit', { ...form.value })
      form.value = {
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: '',
        description: '',
        accountId: ''
      }
    }

    return {
      form,
      accounts,
      error,
      handleSubmit
    }
  }
})
</script> 