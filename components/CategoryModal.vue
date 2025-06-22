<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Nueva Categoría de {{ categoryType === 'expense' ? 'Gasto' : 'Ingreso' }}
        </h3>
      </div>
      
      <div class="px-6 py-4">
        <div class="mb-4">
          <label for="categoryName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Categoría
          </label>
          <input
            id="categoryName"
            v-model="categoryName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Ej: Entretenimiento"
            @keyup.enter="addSubcategory"
          />
        </div>

        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subcategorías
            </label>
            <button
              @click="addSubcategory"
              class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              + Agregar Subcategoría
            </button>
          </div>
          
          <div v-if="subcategories.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic py-2">
            No hay subcategorías agregadas
          </div>
          
          <div v-else class="space-y-2">
            <div v-for="(sub, index) in subcategories" :key="index" class="flex items-center space-x-2">
              <input
                v-model="sub.name"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="Nombre de subcategoría"
              />
              <button
                @click="removeSubcategory(index)"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
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
          :disabled="!categoryName.trim()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear Categoría
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
  categoryType: {
    type: String,
    default: 'expense' // 'expense' or 'income'
  }
})

const emit = defineEmits(['close', 'submit'])

const categoryName = ref('')
const subcategories = ref([])

const addSubcategory = () => {
  subcategories.value.push({
    id: Date.now() + Math.random(),
    name: ''
  })
}

const removeSubcategory = (index) => {
  subcategories.value.splice(index, 1)
}

const handleSubmit = () => {
  if (categoryName.value.trim()) {
    const newCategory = {
      id: Date.now(),
      name: categoryName.value.trim(),
      subcategories: subcategories.value
        .filter(sub => sub.name.trim())
        .map((sub, index) => ({
          id: index + 1,
          name: sub.name.trim()
        }))
    }
    
    emit('submit', newCategory)
    resetForm()
  }
}

const resetForm = () => {
  categoryName.value = ''
  subcategories.value = []
}

// Enfocar el input cuando se abre el modal
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const input = document.getElementById('categoryName')
      if (input) {
        input.focus()
      }
    })
  } else {
    resetForm()
  }
})
</script> 