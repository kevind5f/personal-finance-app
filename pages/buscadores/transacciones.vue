<template>
  <div class="max-w-4xl mx-auto py-10">
    <h1 class="text-2xl font-bold mb-6">Buscar Transacciones</h1>
    <div class="flex flex-wrap gap-4 mb-6">
      <input v-model="filtroNombre" type="text" placeholder="Filtrar por nombre/descripción" class="border rounded px-3 py-2" />
      <input v-model="filtroFecha" type="date" class="border rounded px-3 py-2" />
      <button @click="buscar" class="px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700">Buscar</button>
      <button @click="limpiar" class="px-4 py-2 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300">Limpiar</button>
    </div>
    <div v-if="isLoading" class="py-8 text-center">Cargando...</div>
    <div v-else>
      <table class="w-full table-auto border rounded-lg bg-white shadow">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">Descripción</th>
            <th class="px-4 py-2">Monto</th>
            <th class="px-4 py-2">Tipo</th>
            <th class="px-4 py-2">Categoría</th>
            <th class="px-4 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transaccionesFiltradas" :key="t._id">
            <td class="px-4 py-2">{{ t.descripcion || t.title || t.titulo }}</td>
            <td class="px-4 py-2">${{ t.monto || t.amount }}</td>
            <td class="px-4 py-2">{{ t.tipo || t.type }}</td>
            <td class="px-4 py-2">{{ t.categoria || t.category }}</td>
            <td class="px-4 py-2">{{ t.fecha || t.date }}</td>
          </tr>
          <tr v-if="transaccionesFiltradas.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-500">No se encontraron transacciones.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const transacciones = ref([])
const isLoading = ref(false)
const filtroNombre = ref('')
const filtroFecha = ref('')

const buscar = async () => {
  isLoading.value = true
  let url = '/api/transactions'
  const params = []
  if (filtroNombre.value) params.push(`q=${encodeURIComponent(filtroNombre.value)}`)
  if (filtroFecha.value) params.push(`fecha=${filtroFecha.value}`)
  if (params.length) url += '?' + params.join('&')
  const res = await fetch(url)
  transacciones.value = await res.json()
  isLoading.value = false
}

const limpiar = () => {
  filtroNombre.value = ''
  filtroFecha.value = ''
  buscar()
}

const transaccionesFiltradas = computed(() => {
  let arr = transacciones.value
  if (filtroNombre.value) {
    arr = arr.filter(i => (i.descripcion || i.title || '').toLowerCase().includes(filtroNombre.value.toLowerCase()))
  }
  if (filtroFecha.value) {
    arr = arr.filter(i => (i.fecha || i.date || '').startsWith(filtroFecha.value))
  }
  return arr
})

onMounted(buscar)
</script> 