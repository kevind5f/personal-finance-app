<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-800 flex flex-col">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full p-2">🏦</span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nueva Cuenta</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
          <select
            id="type"
            v-model="form.type"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          >
            <option value="checking">Cuenta Corriente</option>
            <option value="savings">Cuenta de Ahorros</option>
            <option value="credit">Tarjeta de Crédito</option>
            <option value="investment">Inversión</option>
          </select>
        </div>
        <div>
          <label for="balance" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Balance Inicial</label>
          <input
            id="balance"
            v-model.number="form.balance"
            type="number"
            step="0.01"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
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
            class="px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow border border-blue-700 transition"
          >
            Crear Cuenta
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AccountForm',
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
      type: 'checking',
      balance: 0
    })

    const handleSubmit = () => {
      emit('submit', { ...form.value })
      form.value = {
        name: '',
        type: 'checking',
        balance: 0
      }
    }

    return {
      form,
      handleSubmit
    }
  }
})
</script> 