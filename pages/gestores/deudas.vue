<template>
  <div class="max-w-4xl mx-auto py-10">
    <h1 class="text-2xl font-bold mb-6">Gestor de Deudas</h1>
    <div class="flex flex-wrap gap-4 mb-6">
      <input v-model="filtroNombre" type="text" placeholder="Filtrar por nombre o motivo" class="border rounded px-3 py-2" />
      <select v-model="filtroEstado" class="border rounded px-3 py-2">
        <option value="">Todos los estados</option>
        <option value="activa">Activa</option>
        <option value="finalizada">Finalizada</option>
      </select>
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
            <th class="px-4 py-2">Fecha Adquisición</th>
            <th class="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in deudasFiltradas" :key="d._id">
            <td class="px-4 py-2">{{ d.nombre }}</td>
            <td class="px-4 py-2">${{ d.monto }}</td>
            <td class="px-4 py-2">{{ d.motivo }}</td>
            <td class="px-4 py-2">{{ d.fecha_adquisicion }}</td>
            <td class="px-4 py-2">{{ d.estado }}</td>
          </tr>
          <tr v-if="deudasFiltradas.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-500">No se encontraron deudas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const deudas = ref([])
const isLoading = ref(false)
const filtroNombre = ref('')
const filtroEstado = ref('')

const buscar = async () => {
  isLoading.value = true
  let url = '/api/deudas'
  const res = await fetch(url)
  deudas.value = await res.json()
  isLoading.value = false
}

const limpiar = () => {
  filtroNombre.value = ''
  filtroEstado.value = ''
  buscar()
}

const deudasFiltradas = computed(() => {
  let arr = deudas.value
  if (filtroNombre.value) {
    arr = arr.filter(i => (i.nombre || '').toLowerCase().includes(filtroNombre.value.toLowerCase()) || (i.motivo || '').toLowerCase().includes(filtroNombre.value.toLowerCase()))
  }
  if (filtroEstado.value) {
    arr = arr.filter(i => i.estado === filtroEstado.value)
  }
  return arr
})

onMounted(buscar)
</script> 