<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {{ isLoan ? 'Nuevo Préstamo' : 'Nueva Deuda' }}
      </h2>
      <div class="mb-4 flex justify-end">
        <button type="button" @click="setDefaultInformal" class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">Default informal</button>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 2. Datos del Préstamo o Deuda -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <!-- 3. Condiciones del Pago -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <!-- 4. Interés -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <!-- 5. Detalles de las Cuotas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option v-for="cuenta in cuentas" :key="cuenta._id" :value="cuenta.nombre">{{ cuenta.nombre }}</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancelar</button>
          <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">{{ isLoan ? 'Registrar Préstamo' : 'Registrar Deuda' }}</button>
        </div>
      </form>
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

    onMounted(async () => {
      try {
        const response = await fetch('http://localhost:3000/api/accounts')
        if (response.ok) {
          cuentas.value = await response.json()
          if (cuentas.value.length > 0) {
            form.value.cuenta_destino = cuentas.value[0].nombre
          }
        }
      } catch (error) {
        console.error('Error loading accounts:', error)
      }
    })

    watch(() => form.value.monto, (val) => {
      amountError.value = val <= 0
    })

    const handleSubmit = () => {
      if (form.value.monto <= 0) {
        amountError.value = true
        return
      }
      emit('submit', { ...form.value })
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
        cuenta_destino: cuentas.value.length > 0 ? cuentas.value[0].nombre : ''
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