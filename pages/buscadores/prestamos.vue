<template>
  <div class="max-w-4xl mx-auto py-10">
    <h1 class="text-2xl font-bold mb-6">Buscar Préstamos</h1>
    <div class="flex flex-wrap gap-4 mb-6">
      <input v-model="filtroNombre" type="text" placeholder="Filtrar por nombre o motivo" class="border rounded px-3 py-2" />
      <input v-model="filtroFecha" type="date" class="border rounded px-3 py-2" />
      <button @click="buscar" class="px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700">Buscar</button>
      <button @click="limpiar" class="px-4 py-2 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300">Limpiar</button>
    </div>
    <div v-if="isLoading" class="py-8 text-center">Cargando...</div>
    <div v-else>
      <table class="w-full table-auto border rounded-lg bg-white shadow">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">Nombre</th>
            <th class="px-4 py-2">Monto</th>
            <th class="px-4 py-2">Motivo</th>
            <th class="px-4 py-2">Fecha Otorgamiento</th>
            <th class="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in prestamosFiltrados" :key="p._id">
            <td class="px-4 py-2">{{ p.nombre }}</td>
            <td class="px-4 py-2">${{ p.monto }}</td>
            <td class="px-4 py-2">{{ p.motivo }}</td>
            <td class="px-4 py-2">{{ p.fecha_otorgamiento }}</td>
            <td class="px-4 py-2">{{ p.estado }}</td>
          </tr>
          <tr v-if="prestamosFiltrados.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-500">No se encontraron préstamos.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const prestamos = ref([])
const isLoading = ref(false)
const filtroNombre = ref('')
const filtroFecha = ref('')

const buscar = async () => {
  isLoading.value = true
  let url = '/api/prestamos'
  const res = await fetch(url)
  prestamos.value = await res.json()
  isLoading.value = false
}

const limpiar = () => {
  filtroNombre.value = ''
  filtroFecha.value = ''
  buscar()
}

const prestamosFiltrados = computed(() => {
  let arr = prestamos.value
  if (filtroNombre.value) {
    arr = arr.filter(i => (i.nombre || '').toLowerCase().includes(filtroNombre.value.toLowerCase()) || (i.motivo || '').toLowerCase().includes(filtroNombre.value.toLowerCase()))
  }
  if (filtroFecha.value) {
    arr = arr.filter(i => i.fecha_otorgamiento && i.fecha_otorgamiento.startsWith(filtroFecha.value))
  }
  return arr
})

onMounted(buscar)
</script>

<style scoped>
.input { @apply border rounded px-3 py-2; }
.btn { @apply px-4 py-2 rounded font-medium; }
.btn-primary { @apply bg-blue-600 text-white hover:bg-blue-700; }
.btn-secondary { @apply bg-gray-200 text-gray-700 hover:bg-gray-300; }
</style> 