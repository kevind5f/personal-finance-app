<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800">
        <!-- Modal Header -->
        <div class="flex items-center gap-3 px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <span
            class="text-2xl rounded-full p-2"
            :class="itemType === 'deuda' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'"
          >
            {{ itemType === 'deuda' ? '💸' : '💵' }}
          </span>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white flex-1">
            Detalle de {{ itemType === 'deuda' ? 'Deuda' : 'Préstamo' }}
          </h3>
          <button @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2"
            :class="itemType === 'deuda' ? 'focus:ring-red-500' : 'focus:ring-green-500'"
          >
            ✕
          </button>
        </div>
        <div class="p-6 space-y-6 overflow-y-auto">
          <!-- Item Details -->
          <div v-if="item" class="space-y-4">
            <div class="text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.motivo }}</p>
              <h4 class="font-bold text-3xl text-gray-800 dark:text-white">{{ item.nombre }}</h4>
            </div>

            <div class="grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div class="text-center">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Monto Total</p>
                <p class="font-bold text-2xl" :class="itemType === 'deuda' ? 'text-red-500' : 'text-green-500'">${{ formatAmount(item.monto) }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Restante</p>
                <p class="font-bold text-2xl text-gray-800 dark:text-gray-200">${{ formatAmount(remainingBalance) }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-1">
              <div class="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                  <span>Progreso</span>
                  <span>{{ progressPercentage.toFixed(0) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div class="h-2.5 rounded-full" :class="itemType === 'deuda' ? 'bg-red-500' : 'bg-green-500'" :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>

            <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div class="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                    <dt class="font-medium text-gray-500 dark:text-gray-400">Tasa de Interés:</dt>
                    <dd class="text-gray-800 dark:text-gray-200">{{ item.tasa_interes }}%</dd>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                    <dt class="font-medium text-gray-500 dark:text-gray-400">Pago Mensual:</dt>
                    <dd class="text-gray-800 dark:text-gray-200">${{ formatAmount(item.valor_cuota) }}</dd>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                    <dt class="font-medium text-gray-500 dark:text-gray-400">Fecha de Otorgamiento:</dt>
                    <dd class="text-gray-800 dark:text-gray-200">{{ formatDate(item.fecha_otorgamiento || item.fecha_adquisicion) }}</dd>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                    <dt class="font-medium text-gray-500 dark:text-gray-400">Plazo:</dt>
                    <dd class="text-gray-800 dark:text-gray-200">{{ item.plazo_total }}</dd>
                </div>
            </dl>
          </div>

          <!-- Payment Form -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Registrar un Pago</h4>
            <form @submit.prevent="handlePaymentSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div class="md:col-span-1">
                <label for="paymentAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto</label>
                <input v-model.number="paymentForm.amount" type="number" id="paymentAmount" step="0.01" required placeholder="0.00" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div class="md:col-span-1">
                <label for="paymentDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                <input v-model="paymentForm.date" type="date" id="paymentDate" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <button type="submit" class="btn-primary w-full md:col-span-1 h-10">Registrar Pago</button>
            </form>
          </div>

          <!-- Payment History -->
          <div>
            <h4 class="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Historial de Pagos</h4>
            <div v-if="!item || !item.payments || item.payments.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <p>Aún no se han registrado pagos.</p>
            </div>
            <ul v-else class="space-y-2 max-h-48 overflow-y-auto pr-2 -mr-2">
              <li v-for="(payment, index) in item.payments" :key="index" class="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="bg-green-100 dark:bg-green-800/50 p-2 rounded-full">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">Pago Recibido</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(payment.date) }}</p>
                  </div>
                </div>
                <p class="font-bold text-lg text-green-600 dark:text-green-400">${{ formatAmount(payment.amount) }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  item: Object,
  itemType: String // 'deuda' or 'prestamo'
});

const emit = defineEmits(['close', 'submit-payment']);

const paymentForm = ref({
  amount: null,
  date: new Date().toISOString().substr(0, 10),
});

const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0.00';
  return Number(amount).toFixed(2);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Asegurarse que la fecha no tenga problemas de zona horaria
  const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return utcDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const totalPaid = computed(() => {
  if (!props.item?.payments) return 0;
  return props.item.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
});

const remainingBalance = computed(() => {
    if (!props.item) return 0;
    return props.item.monto - totalPaid.value;
});

const progressPercentage = computed(() => {
    if (!props.item || !props.item.monto) return 0;
    const percentage = (totalPaid.value / props.item.monto) * 100;
    return Math.min(percentage, 100);
});

const handlePaymentSubmit = () => {
  if (paymentForm.value.amount > 0) {
    emit('submit-payment', { ...paymentForm.value, itemId: props.item._id });
    paymentForm.value.amount = null;
    paymentForm.value.date = new Date().toISOString().substr(0, 10);
  }
};
</script>

<style>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style> 