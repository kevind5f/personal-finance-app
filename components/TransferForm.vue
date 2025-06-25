<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Nueva Transferencia</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="fromAccount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta Origen</label>
          <select id="fromAccount" v-model="form.fromAccountId" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="" disabled>Selecciona cuenta origen</option>
            <option v-for="account in accounts" :key="account._id" :value="account._id">{{ account.name }} ({{ account.type }})</option>
          </select>
        </div>
        <div>
          <label for="toAccount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta Destino</label>
          <select id="toAccount" v-model="form.toAccountId" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="" disabled>Selecciona cuenta destino</option>
            <option v-for="account in accounts" :key="account._id" :value="account._id" :disabled="account._id === form.fromAccountId">{{ account.name }} ({{ account.type }})</option>
          </select>
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto</label>
          <input id="amount" v-model.number="form.amount" type="number" min="0.01" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
          <input id="description" v-model="form.description" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
          <input id="date" v-model="form.date" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancelar</button>
          <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Transferir</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

interface Account {
  _id: string
  name: string
  type: string
}

const props = defineProps<{
  isOpen: boolean
  accounts: Account[]
}>()
const emit = defineEmits(['close', 'submit'])

const today = new Date().toISOString().split('T')[0]
const form = ref({
  fromAccountId: '',
  toAccountId: '',
  amount: 0,
  description: '',
  date: today
})

watch(() => props.isOpen, (val) => {
  if (val) {
    form.value = {
      fromAccountId: '',
      toAccountId: '',
      amount: 0,
      description: '',
      date: today
    }
  }
})

function handleSubmit() {
  if (form.value.fromAccountId === form.value.toAccountId) return
  emit('submit', { ...form.value })
}
</script> 