<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-800 flex flex-col">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full p-2">🔄</span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nueva Transferencia</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="fromAccount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cuenta Origen</label>
          <select id="fromAccount" v-model="form.fromAccountId" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
            <option value="" disabled>Selecciona cuenta origen</option>
            <option v-for="account in accounts" :key="account._id" :value="account._id">{{ account.name }} ({{ account.type }})</option>
          </select>
        </div>
        <div>
          <label for="toAccount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cuenta Destino</label>
          <select id="toAccount" v-model="form.toAccountId" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
            <option value="" disabled>Selecciona cuenta destino</option>
            <option v-for="account in accounts" :key="account._id" :value="account._id" :disabled="account._id === form.fromAccountId">{{ account.name }} ({{ account.type }})</option>
          </select>
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto</label>
          <input id="amount" v-model.number="form.amount" type="number" min="0.01" step="0.01" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
          <input id="description" v-model="form.description" type="text" class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
        </div>
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha</label>
          <input id="date" v-model="form.date" type="date" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
        </div>
        <div class="flex justify-end space-x-4 mt-8">
          <button type="button" @click="$emit('close')" class="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 transition">Cancelar</button>
          <button type="submit" class="px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow border border-blue-700 transition">Transferir</button>
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