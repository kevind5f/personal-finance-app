<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[80vh] border border-gray-200 dark:border-gray-800 flex flex-col">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-2xl bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-full p-2">📊</span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nuevo Presupuesto</h2>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6 overflow-y-auto flex-1">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
          <select
            id="category"
            v-model="form.category"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
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
          <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Presupuesto</label>
          <select
            id="type"
            v-model="form.type"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          >
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
            <option value="ahorro">Ahorro</option>
            <option value="inversion">Inversión</option>
          </select>
        </div>
        <div>
          <label for="paymentMethod" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Forma de Pago</label>
          <select
            id="paymentMethod"
            v-model="form.paymentMethod"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="credito">Crédito</option>
            <option value="debito">Débito</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label for="frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Periodicidad</label>
          <select
            id="frequency"
            v-model="form.frequency"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          >
            <option value="unico">Único</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </select>
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monto</label>
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
        </div>
        <div>
          <label for="month" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mes</label>
          <input
            id="month"
            v-model="form.month"
            type="month"
            required
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          />
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base"
          ></textarea>
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
            class="px-6 py-3 text-base font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow border border-yellow-700 transition"
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
      type: '',
      paymentMethod: '',
      frequency: '',
      amount: 0,
      month: new Date().toISOString().slice(0, 7),
      description: '',
      spent: 0
    })

    const handleSubmit = () => {
      emit('submit', { 
        ...form.value,
        totalBudget: form.value.amount,
        spentAmount: 0,
        type: form.value.type,
        paymentMethod: form.value.paymentMethod,
        frequency: form.value.frequency,
        initialBudget: form.value.amount
      })
      form.value = {
        category: '',
        type: '',
        paymentMethod: '',
        frequency: '',
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