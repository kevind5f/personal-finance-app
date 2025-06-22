<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isLoan ? 'Nuevo Préstamo' : 'Nueva Deuda' }}
        </h2>
      </div>

      <!-- Form Content (Scrollable) -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6 overflow-y-auto">
        <div class="mb-4 flex justify-end">
          <button type="button" @click="setDefaultInformal" class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">Default informal</button>
        </div>
        
        <!-- Field Groups -->
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Datos del Préstamo</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Monto total prestado (capital)</label>
            <input v-model.number="form.monto" type="number" min="0.01" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <span v-if="amountError" class="text-xs text-red-500 mt-1 block">El monto debe ser mayor a cero</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Moneda</label>
            <select v-model="form.moneda" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha en que se otorga el préstamo</label>
            <input v-model="form.fecha_otorgamiento" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Motivo o descripción de la deuda (opcional)</label>
            <input v-model="form.motivo" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Condiciones del Pago</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Plazo total</label>
            <input v-model="form.plazo_total" type="text" placeholder="Ej: 12 meses, 2 años" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Frecuencia de pago</label>
            <select v-model="form.frecuencia_pago" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="mensual">Mensual</option>
              <option value="quincenal">Quincenal</option>
              <option value="semanal">Semanal</option>
              <option value="única">Única</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de cuotas</label>
            <input v-model.number="form.numero_cuotas" type="number" min="1" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de primer pago</label>
            <input v-model="form.fecha_primer_pago" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de último pago (estimada)</label>
            <input v-model="form.fecha_ultimo_pago" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Intereses</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tasa de interés (%)</label>
            <input v-model.number="form.tasa_interes" type="number" min="0" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de interés</label>
            <select v-model="form.tipo_interes" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="fijo">Fijo</option>
              <option value="variable">Variable</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cálculo del interés</label>
            <select v-model="form.calculo_interes" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="saldo">Sobre saldo</option>
              <option value="monto original">Sobre monto original</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Interés moratorio (%)</label>
            <input v-model.number="form.interes_moratorio" type="number" min="0" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">Detalles de Cuotas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor estimado de la cuota</label>
            <input v-model.number="form.valor_cuota" type="number" min="0" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Incluye intereses?</label>
            <select v-model="form.incluye_intereses" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">¿Permite adelantos?</label>
            <select v-model="form.permite_adelantos" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Forma de pago</label>
            <select v-model="form.forma_pago" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="cheque">Cheque</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta destino / datos de cobro</label>
            <select v-model="form.cuenta_destino" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option v-for="cuenta in cuentas" :key="cuenta._id" :value="cuenta.name">{{ cuenta.name }}</option>
            </select>
          </div>
        </div>
      </form>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancelar</button>
        <button @click="handleSubmit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">{{ isLoan ? 'Registrar Préstamo' : 'Registrar Deuda' }}</button>
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
      if (form.value.monto <= 0) {
        amountError.value = true
        return
      }
      // Emit submit before resetting form to ensure the modal closes with data
      emit('submit', { ...form.value })
      
      // Reset form
      form.value = {
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
        cuenta_destino: cuentas.value.length > 0 ? cuentas.value[0].name : ''
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
      handleSubmit,
      setDefaultInformal
    }
  }
})
</script> 