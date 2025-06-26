<template>
  <div class="max-w-4xl mx-auto py-10">
    <h1 class="text-2xl font-bold mb-6">Buscar Presupuestos</h1>
    <div class="flex flex-wrap gap-4 mb-6">
      <input v-model="filtroNombre" type="text" placeholder="Filtrar por categoría o descripción" class="border rounded px-3 py-2" />
      <input v-model="filtroFecha" type="month" class="border rounded px-3 py-2" />
      <button @click="buscar" class="px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700">Buscar</button>
      <button @click="limpiar" class="px-4 py-2 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300">Limpiar</button>
    </div>
    <div v-if="isLoading" class="py-8 text-center">Cargando...</div>
    <div v-else>
      <table class="w-full table-auto border rounded-lg bg-white shadow">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">Categoría</th>
            <th class="px-4 py-2">Monto</th>
            <th class="px-4 py-2">Gastado</th>
            <th class="px-4 py-2">Mes</th>
            <th class="px-4 py-2">Descripción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in presupuestosFiltrados" :key="b._id">
            <td class="px-4 py-2">{{ b.categoria || b.category }}</td>
            <td class="px-4 py-2">${{ b.monto || b.amount }}</td>
            <td class="px-4 py-2">${{ b.gastado || b.spent }}</td>
            <td class="px-4 py-2">{{ b.mes || b.month }}</td>
            <td class="px-4 py-2">{{ b.descripcion || b.description }}</td>
          </tr>
          <tr v-if="presupuestosFiltrados.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-500">No se encontraron presupuestos.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const presupuestos = ref([])
const isLoading = ref(false)
const filtroNombre = ref('')
const filtroFecha = ref('')

const buscar = async () => {
  isLoading.value = true
  let url = '/api/budgets'
  const params = []
  if (filtroNombre.value) params.push(`q=${encodeURIComponent(filtroNombre.value)}`)
  if (filtroFecha.value) params.push(`mes=${filtroFecha.value}`)
  if (params.length) url += '?' + params.join('&')
  const res = await fetch(url)
  presupuestos.value = await res.json()
  isLoading.value = false
}

const limpiar = () => {
  filtroNombre.value = ''
  filtroFecha.value = ''
  buscar()
}

const presupuestosFiltrados = computed(() => {
  let arr = presupuestos.value
  if (filtroNombre.value) {
    arr = arr.filter(i => (i.categoria || i.category || '').toLowerCase().includes(filtroNombre.value.toLowerCase()) || (i.descripcion || i.description || '').toLowerCase().includes(filtroNombre.value.toLowerCase()))
  }
  if (filtroFecha.value) {
    arr = arr.filter(i => (i.mes || i.month || '').startsWith(filtroFecha.value))
  }
  return arr
})

onMounted(buscar)
</script> 