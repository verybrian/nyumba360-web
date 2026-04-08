<template>
  <div class="transactions">
    <div class="header header-desktop">
      <div class="header-left">
        <div class="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input type="text" placeholder="Search transactions..." v-model="transactionSearch" />
        </div>
      </div>

      <div class="header-right">
        <div class="filters-wrapper" @click.outside="filtersOpen = false">
          <button class="filter-btn" @click="filtersOpen = !filtersOpen">
            Filters
            <svg width="14" height="14" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div v-if="filtersOpen" class="filters-dropdown">
            <label>
              Status
              <select v-model="transactionStatus">
                <option value="">All</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </label>
          </div>
        </div>

        <button class="download-btn" title="Download">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span class="btn-text">Download</span>
        </button>
      </div>
    </div>

    <!-- MOBILE HEADER -->
    <div class="header header-mobile">
      <div class="header-mobile-actions">
        <div class="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search transactions..." v-model="transactionSearch" />
        </div>

        <div class="filters-wrapper" @click.outside="filtersOpen = false">
          <button class="filter-btn" @click="filtersOpen = !filtersOpen">
            Filters
            <svg width="14" height="14" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div v-if="filtersOpen" class="filters-dropdown">
            <label>
              Status
              <select v-model="transactionStatus">
                <option value="active">Active</option>
                <option value="inactive">Moved Out</option>
                <option value="all">All</option>
              </select>
            </label>

            <label>
              Property
              <select v-model="propertyFilter">
                <option>Zion Hostels</option>
                <option>Hebron Hostels</option>
                <option>Mizani 3bdrm</option>
              </select>
            </label>
          </div>
        </div>

        <button class="download-btn" title="Download">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span class="btn-text">Download</span>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Transaction Code</th>
            <th>Phone Number</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="empty-cell">Loading…</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="7" class="error-cell">
              {{ error }} <button @click="fetchTransactions">Retry</button>
            </td>
          </tr>
          <tr v-else-if="paginatedTransactions.length === 0">
            <td colspan="9" class="empty-cell">
              <div class="empty-state">
                <div class="empty-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 12h-6a2 2 0 0 0 0 4h6v-4Z" />
                    <path d="M2 14V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H6a4 4 0 0 0-4 4Z" />
                  </svg>
                </div>
                <p class="empty-title">
                  {{
                    transactionSearch || transactionStatus || propertyFilter
                      ? 'No results found'
                      : 'No transactions yet'
                  }}
                </p>
                <button
                  v-if="transactionSearch || transactionStatus || propertyFilter"
                  class="empty-action"
                  @click="
                    () => {
                      transactionSearch = ''
                      transactionStatus = ''
                      propertyFilter = ''
                    }
                  "
                >
                  Clear filters
                </button>
              </div>
            </td>
          </tr>
          <tr v-else v-for="transaction in paginatedTransactions" :key="transaction.id">
            <td>
              {{
                transaction.payment_ref ||
                transaction.payment_id?.toString().slice(0, 8).toUpperCase() ||
                '—'
              }}
            </td>
            <td>{{ transaction.mpesa_code || '—' }}</td>
            <td>{{ transaction.phone_number || '—' }}</td>
            <td>Ksh {{ formatAmount(transaction.amount) }}</td>
            <td>{{ formatDate(transaction.transaction_date) }}</td>
            <td>
              <span class="status-badge" :class="transaction.status">
                {{ statusLabel(transaction.status) }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="actions-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer">
        <div class="results-info">
          Results: {{ filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }} -
          {{ Math.min(currentPage * pageSize, filteredTransactions.length) }} of
          {{ filteredTransactions.length }}
        </div>
        <div class="pagination">
          <button class="pagination-button" :disabled="currentPage === 1" @click="currentPage--">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination-number"
            :class="{ active: page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiFetch } from '@/utils/api'

const transactions = ref([])
const loading = ref(true)
const error = ref('')

const transactionSearch = ref('')
const transactionStatus = ref('')
const filtersOpen = ref(false)

const currentPage = ref(1)
const pageSize = 20

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/transactions/')
    if (!res.ok) {
      error.value = `Failed to load transactions (${res.status}).`
      return
    }
    const data = await res.json()
    transactions.value = Array.isArray(data) ? data : (data.results ?? [])
  } catch {
    error.value = 'Something went wrong. Could not load transactions.'
  } finally {
    loading.value = false
  }
}

const filteredTransactions = computed(() => {
  let list = transactions.value

  if (transactionStatus.value) list = list.filter((t) => t.status === transactionStatus.value)

  const q = transactionSearch.value.toLowerCase().trim()
  if (q)
    list = list.filter(
      (t) =>
        (t.mpesa_code && t.mpesa_code.toLowerCase().includes(q)) ||
        (t.phone_number && t.phone_number.includes(q)) ||
        (t.payment_ref && t.payment_ref.toLowerCase().includes(q)),
    )

  return list
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize)),
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTransactions.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages
})

watch([transactionSearch, transactionStatus], () => {
  currentPage.value = 1
})

const formatDate = (val) => {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatAmount = (val) =>
  Number(val).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const statusLabel = (s) =>
  ({ success: 'Success', pending: 'Pending', failed: 'Failed' })[s] || s || '—'

onMounted(fetchTransactions)
</script>

<style scoped src="../../../styles/pages/finances/transactions.css"></style>
