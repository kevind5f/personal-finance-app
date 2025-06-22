<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">Personal Finance</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink to="/" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Dashboard</NuxtLink>
              <NuxtLink to="/expenses" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Expenses</NuxtLink>
              <NuxtLink to="/income" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Income</NuxtLink>
              <NuxtLink to="/transactions" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Transactions</NuxtLink>
              <NuxtLink to="/debts" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Debts</NuxtLink>
              <NuxtLink to="/budget" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Budget</NuxtLink>
              <NuxtLink to="/accounts" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">Accounts</NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <span class="sr-only">Open user menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
.router-link-active {
  border-bottom-width: 2px;
  border-color: rgb(99, 102, 241);
  color: rgb(17, 24, 39);
}
</style> 