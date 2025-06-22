<template>
  <div>
    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-semibold text-gray-900">Expenses</h1>
                <button
                    @click="showAddExpenseModal = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >Add Expense
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <!-- Filters -->
        <div class="mt-8 bg-white shadow rounded-lg p-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
                <label for="date-range" class="block text-sm font-medium text-gray-700">Date Range</label>
                <select
                id="date-range"
                v-model="dateRange"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
                </select>
            </div>

            <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <select
                id="category"
                v-model="selectedCategory"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                </option>
                </select>
            </div>

            <div>
                <label for="account" class="block text-sm font-medium text-gray-700">Account</label>
                <select
                id="account"
                v-model="selectedAccount"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                <option value="">All Accounts</option>
                <option v-for="account in accounts" :key="account.id" :value="account.id">
                    {{ account.name }}
                </option>
                </select>
            </div>
            </div>
        </div>

        <!-- Expenses Table -->
        <div class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Account</th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Actions</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-if="expenses.length === 0">
                        <td colspan="6" class="px-3 py-4 text-sm text-gray-500 text-center">No expenses found</td>
                    </tr>
                    <tr v-for="expense in expenses" :key="expense.id" class="hover:bg-gray-50">
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {{ formatDate(expense.date) }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${{ expense.amount.toFixed(2) }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ expense.category }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ expense.description }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ expense.account }}
                        </td>
                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                            @click="editExpense(expense)"
                            class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                            Edit
                        </button>
                        <button
                            @click="deleteExpense(expense.id)"
                            class="text-red-600 hover:text-red-900"
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Expense Modal -->
    <div v-if="showAddExpenseModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleSubmit">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="space-y-4">
                <div>
                  <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    v-model="form.amount"
                    step="0.01"
                    min="0"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    id="description"
                    v-model="form.description"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label for="account" class="block text-sm font-medium text-gray-700">Account</label>
                  <select
                    id="account"
                    v-model="form.account"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option v-for="account in accounts" :key="account.id" :value="account.id">
                      {{ account.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    id="date"
                    v-model="form.date"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                @click="showAddExpenseModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { format } from 'date-fns';

interface Account {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  account: string;
}

// State
const showAddExpenseModal = ref(false);
const dateRange = ref('month');
const selectedCategory = ref('');
const selectedAccount = ref('');
const expenses = ref<Expense[]>([]);
const categories = ref(['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Other']);
const accounts = ref<Account[]>([]);

const form = reactive({
  amount: '',
  category: '',
  description: '',
  account: '',
  date: format(new Date(), 'yyyy-MM-dd')
});

// Methods
function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy');
}

function editExpense(expense: Expense) {
  Object.assign(form, expense);
  showAddExpenseModal.value = true;
}

async function deleteExpense(id: string) {
  if (confirm('Are you sure you want to delete this expense?')) {
    // Add delete logic here
  }
}

async function handleSubmit() {
  // Add submit logic here
  showAddExpenseModal.value = false;
}

// Fetch data
async function fetchExpenses() {
  // Add fetch logic here
}

async function fetchAccounts() {
  // Add fetch logic here
}

// Initialize
fetchExpenses();
fetchAccounts();
</script> 