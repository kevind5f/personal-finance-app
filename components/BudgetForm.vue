<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Nuevo Presupuesto</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
          <select
            id="category"
            v-model="form.category"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="food">Alimentación</option>
            <option value="transport">Transporte</option>
            <option value="housing">Vivienda</option>
            <option value="utilities">Servicios</option>
            <option value="entertainment">Entretenimiento</option>
            <option value="health">Salud</option>
            <option value="education">Educación</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto</label>
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label for="month" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mes</label>
          <input
            id="month"
            v-model="form.month"
            type="month"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
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
            Crear Presupuesto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'BudgetForm',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const form = ref({
      category: '',
      amount: 0,
      month: new Date().toISOString().slice(0, 7),
      description: '',
      spent: 0
    })

    const handleSubmit = () => {
      emit('submit', { ...form.value })
      form.value = {
        category: '',
        amount: 0,
        month: new Date().toISOString().slice(0, 7),
        description: '',
        spent: 0
      }
    }

    return {
      form,
      handleSubmit
    }
  }
})
</script> 