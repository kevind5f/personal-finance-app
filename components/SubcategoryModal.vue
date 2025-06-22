<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Agregar Subcategoría
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Categoría: {{ categoryName }}
        </p>
      </div>
      
      <div class="px-6 py-4">
        <div class="mb-4">
          <label for="subcategoryName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Subcategoría
          </label>
          <input
            id="subcategoryName"
            v-model="subcategoryName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Ej: Supermercado"
            @keyup.enter="handleSubmit"
            ref="nameInput"
          />
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="!subcategoryName.trim()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  categoryName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'submit'])

const subcategoryName = ref('')

const handleSubmit = () => {
  if (subcategoryName.value.trim()) {
    emit('submit', subcategoryName.value.trim())
    subcategoryName.value = ''
  }
}

// Enfocar el input cuando se abre el modal
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const input = document.getElementById('subcategoryName')
      if (input) {
        input.focus()
      }
    })
  }
})
</script> 