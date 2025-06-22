<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Nueva Meta de Ahorro</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label for="targetAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto Objetivo</label>
          <input
            id="targetAmount"
            v-model.number="form.targetAmount"
            type="number"
            step="0.01"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label for="currentAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto Actual</label>
          <input
            id="currentAmount"
            v-model.number="form.currentAmount"
            type="number"
            step="0.01"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label for="targetDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Objetivo</label>
          <input
            id="targetDate"
            v-model="form.targetDate"
            type="date"
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
            Crear Meta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

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
      description: ''
    })

    const handleSubmit = () => {
      emit('submit', { ...form.value })
      form.value = {
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetDate: '',
        description: ''
      }
    }

    return {
      form,
      handleSubmit
    }
  }
})
</script> 