<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800">
      
      <!-- Modal Header -->
      <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center gap-3">
        <span
          class="text-2xl rounded-full p-2"
          :class="isLoan ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'"
        >
          {{ isLoan ? '💵' : '💸' }}
        </span>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isLoan ? 'Nuevo Préstamo' : 'Nueva Deuda' }}
        </h2>
        <button
          type="button"
          @click="$emit('close')"
          class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl rounded-full px-2 py-1 focus:outline-none focus:ring-2"
          :class="isLoan ? 'focus:ring-green-500' : 'focus:ring-red-500'"
        >✕</button>
      </div>

      <!-- Form Content (Scrollable) -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8 overflow-y-auto">
        <div v-if="error" class="bg-red-100 text-red-700 rounded-md p-3 mb-2 text-sm">{{ error }}</div>
        <div class="mb-4 flex justify-end">
          <button type="button" @click="setDefaultInformal" class="px-4 py-2 text-base bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">Default informal</button>
        </div>
        
        <!-- Field Groups -->
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Datos del Préstamo</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div class="md:col-span-2">
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
            <input v-model="form.titulo" type="text" required maxlength="60" placeholder="Ej: Préstamo a Juan, Deuda Tarjeta Visa, etc." class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Monto total prestado (capital)</label>
            <input v-model.number="form.monto" type="number" min="0.01" step="0.01" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
            <span v-if="amountError" class="text-xs text-red-500 mt-1 block">El monto debe ser mayor a cero</span>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Moneda</label>
            <select v-model="form.moneda" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
              <option value="COP">COP</option>
              <option value="ARS">ARS</option>
              <option value="BRL">BRL</option>
              <option value="CLP">CLP</option>
              <option value="PEN">PEN</option>
              <option value="">Otra</option>
            </select>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha en que se otorga el préstamo</label>
            <input v-model="form.fecha_otorgamiento" type="date" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Motivo o descripción de la deuda (opcional)</label>
            <input v-model="form.motivo" type="text" class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Condiciones del Pago</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Plazo total</label>
            <input v-model="form.plazo_total" type="text" placeholder="Ej: 12 meses, 2 años" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Frecuencia de pago</label>
            <select v-model="form.frecuencia_pago" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option value="mensual">Mensual</option>
              <option value="quincenal">Quincenal</option>
              <option value="semanal">Semanal</option>
              <option value="única">Única</option>
            </select>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Número de cuotas</label>
            <input v-model.number="form.numero_cuotas" type="number" min="1" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de primer pago</label>
            <input v-model="form.fecha_primer_pago" type="date" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Fecha de último pago (estimada)</label>
            <input v-model="form.fecha_ultimo_pago" type="date" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Intereses</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Tasa de interés (%)</label>
            <input v-model.number="form.tasa_interes" type="number" min="0" step="0.01" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de interés</label>
            <select v-model="form.tipo_interes" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option value="fijo">Fijo</option>
              <option value="variable">Variable</option>
            </select>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Cálculo del interés</label>
            <select v-model="form.calculo_interes" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option value="saldo">Sobre saldo</option>
              <option value="monto original">Sobre monto original</option>
            </select>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Interés moratorio (%)</label>
            <input v-model.number="form.interes_moratorio" type="number" min="0" step="0.01" class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Detalles de Cuotas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Valor estimado de la cuota</label>
            <input v-model.number="form.valor_cuota" type="number" min="0" step="0.01" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base" />
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Incluye intereses?</label>
            <select v-model="form.incluye_intereses" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">¿Permite adelantos?</label>
            <select v-model="form.permite_adelantos" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Forma de pago</label>
            <select v-model="form.forma_pago" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="cheque">Cheque</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label class="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Cuenta destino / datos de cobro</label>
            <select v-model="form.cuenta_destino" required class="block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white px-4 py-3 text-base">
              <option v-for="cuenta in cuentas" :key="cuenta._id" :value="cuenta.name">{{ cuenta.name }}</option>
            </select>
          </div>
        </div>
      </form>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-4 mt-8">
        <button type="button" @click="$emit('close')" class="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 transition">Cancelar</button>
        <button @click="handleSubmit"
          class="px-6 py-3 text-base font-semibold text-white rounded-lg shadow border transition"
          :class="isLoan ? 'bg-green-600 hover:bg-green-700 border-green-700' : 'bg-red-600 hover:bg-red-700 border-red-700'"
        >{{ isLoan ? 'Registrar Préstamo' : 'Registrar Deuda' }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'

export default defineComponent({
  name: 'LoanForm',
  props: {
    isOpen: { type: Boolean, required: true },
    isLoan: { type: Boolean, required: true }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const cuentas = ref<any[]>([])
    const form = ref({
      titulo: '',
      nombre: '',
      monto: 0,
      moneda: 'USD',
      fecha_otorgamiento: '',
      motivo: '',
      plazo_total: '',
      frecuencia_pago: 'mensual',
      numero_cuotas: 1,
      fecha_primer_pago: '',
      fecha_ultimo_pago: '',
      tasa_interes: 0,
      tipo_interes: 'fijo',
      calculo_interes: 'saldo',
      interes_moratorio: 0,
      valor_cuota: 0,
      incluye_intereses: true,
      permite_adelantos: false,
      forma_pago: 'efectivo',
      cuenta_destino: ''
    })
    const amountError = ref(false)
    const error = ref('')

    const loadAccounts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/accounts')
        if (response.ok) {
          const data = await response.json()
          cuentas.value = Array.isArray(data) ? data : []
          if (cuentas.value.length > 0) {
            form.value.cuenta_destino = cuentas.value[0].name
          }
        } else {
          cuentas.value = []
        }
      } catch (error) {
        console.error('Error loading accounts:', error)
        cuentas.value = []
      }
    }

    watch(() => props.isOpen, (newValue) => {
      if (newValue) {
        console.log('Modal is open, loading accounts...');
        loadAccounts()
      }
    }, { immediate: true })

    watch(() => form.value.monto, (val) => {
      amountError.value = val <= 0
    })

    const handleSubmit = () => {
      error.value = ''
      if (isNaN(form.value.monto) || form.value.monto <= 0) {
        error.value = 'El monto debe ser mayor a 0.'
        return
      }
      if (!form.value.nombre || !form.value.nombre.trim()) {
        error.value = 'El nombre es obligatorio.'
        return
      }
      if (!form.value.fecha_otorgamiento) {
        error.value = 'Selecciona la fecha de otorgamiento.'
        return
      }
      if (!form.value.fecha_primer_pago) {
        error.value = 'Selecciona la fecha de primer pago.'
        return
      }
      if (!form.value.fecha_ultimo_pago) {
        error.value = 'Selecciona la fecha de último pago.'
        return
      }
      if (!form.value.plazo_total) {
        error.value = 'El plazo total es obligatorio.'
        return
      }
      if (!form.value.frecuencia_pago) {
        error.value = 'Selecciona la frecuencia de pago.'
        return
      }
      if (isNaN(form.value.numero_cuotas) || form.value.numero_cuotas < 1) {
        error.value = 'El número de cuotas debe ser mayor a 0.'
        return
      }
      if (isNaN(form.value.tasa_interes) || form.value.tasa_interes < 0) {
        error.value = 'La tasa de interés no puede ser negativa.'
        return
      }
      if (!form.value.cuenta_destino) {
        error.value = 'Selecciona la cuenta destino.'
        return
      }
      emit('submit', { ...form.value })
      form.value = {
        titulo: '',
        nombre: '',
        monto: 0,
        moneda: 'USD',
        fecha_otorgamiento: '',
        motivo: '',
        plazo_total: '',
        frecuencia_pago: 'mensual',
        numero_cuotas: 1,
        fecha_primer_pago: '',
        fecha_ultimo_pago: '',
        tasa_interes: 0,
        tipo_interes: 'fijo',
        calculo_interes: 'saldo',
        interes_moratorio: 0,
        valor_cuota: 0,
        incluye_intereses: true,
        permite_adelantos: false,
        forma_pago: 'efectivo',
        cuenta_destino: ''
      }
    }

    // Botón para valores por defecto informales
    const setDefaultInformal = () => {
      form.value.moneda = 'PEN'
      form.value.plazo_total = 'indefinido'
      form.value.frecuencia_pago = 'indefinido'
      form.value.fecha_ultimo_pago = ''
      form.value.tipo_interes = 'fijo'
      form.value.calculo_interes = 'saldo'
      form.value.permite_adelantos = false
    }

    return {
      form,
      cuentas,
      amountError,
      error,
      handleSubmit,
      setDefaultInformal
    }
  }
})
</script> 