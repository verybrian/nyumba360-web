<template>
  <div class="expenses">
    <div class="header">
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
          <input type="text" placeholder="Search expenses..." v-model="expenseSearch" />
        </div>

        <div class="filter-group">
          <button
            v-for="opt in categoryOpts"
            :key="opt.value"
            class="filter-chip"
            :class="{ active: categoryFilter === opt.value }"
            @click="categoryFilter = opt.value"
          >
            {{ opt.label }}<span class="chip-count">{{ opt.count }}</span>
          </button>

          <div class="filter-divider"></div>

          <select v-if="propertyOptions.length > 1" v-model="propertyFilter" class="filter-select">
            <option value="">All properties</option>
            <option v-for="name in propertyOptions" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
      </div>

      <div class="header-right">
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span class="btn-text">Download</span>
        </button>

        <button @click="$emit('open-drawer', 'New Expense')" class="add-expense-button">
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New expense</span>
        </button>

        <button
          v-if="selectedExpenses.length > 0"
          @click="deleteSelected"
          class="delete-expense-button"
        >
          Delete ({{ selectedExpenses.length }})
        </button>
      </div>
    </div>

    <div class="summary-strip">
      <div class="summary-card">
        <div class="summary-label">Total spent</div>
        <div class="summary-value">Ksh {{ formatAmount(totalSpent) }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">This month</div>
        <div class="summary-value">Ksh {{ formatAmount(thisMonthSpent) }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Records</div>
        <div class="summary-value">{{ filteredExpenses.length }}</div>
      </div>
    </div>

    <div v-if="loading" class="card-list">
      <div v-for="n in 5" :key="'sk-' + n" class="exp-card skeleton-card">
        <div class="card-top">
          <div class="card-name-block">
            <div class="skeleton cat-icon-skel"></div>
            <div>
              <div class="skeleton sk-line sk-long"></div>
              <div class="skeleton sk-line sk-med" style="margin-top: 6px"></div>
            </div>
          </div>
          <div class="skeleton sk-line sk-long"></div>
        </div>
        <div class="card-meta">
          <div class="skeleton sk-pill"></div>
          <div class="skeleton sk-pill"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="error-cell">
      {{ error }} <button @click="fetchExpenses">Retry</button>
    </div>

    <div v-else-if="paginatedExpenses.length === 0" class="empty-state">
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
          expenseSearch || categoryFilter || propertyFilter ? 'No results found' : 'No expenses yet'
        }}
      </p>
      <p v-if="!expenseSearch && !categoryFilter && !propertyFilter" class="empty-sub">
        Record your first expense to start tracking costs.
      </p>
      <button
        v-if="expenseSearch || categoryFilter || propertyFilter"
        class="empty-action"
        @click="
          () => {
            expenseSearch = ''
            categoryFilter = ''
            propertyFilter = ''
          }
        "
      >
        Clear filters
      </button>
      <button v-else class="empty-action" @click="$emit('open-drawer', 'New Expense')">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add expense
      </button>
    </div>

    <div v-else class="card-list">
      <div
        v-for="expense in paginatedExpenses"
        :key="expense.id"
        class="exp-card"
        :class="{ expanded: expandedId === expense.id }"
        @click="toggleExpand(expense.id)"
      >
        <div class="card-top">
          <div class="card-name-block">
            <div class="cat-icon" :class="expense.category || 'other'">
              <svg
                v-if="expense.category === 'repair'"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                />
              </svg>
              <svg
                v-else-if="expense.category === 'maintenance'"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
              </svg>
              <svg
                v-else-if="expense.category === 'utility'"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <svg
                v-else-if="expense.category === 'security'"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <svg
                v-else-if="expense.category === 'cleaning'"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m3 3 3 9" />
                <path d="M6 12a9 9 0 1 0 9-9" />
              </svg>
              <svg
                v-else
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <div class="card-name">
                {{ expense.description || categoryLabel(expense.category) }}
              </div>
              <div class="card-sub">
                {{ expense.property_name || '—' }} &middot; {{ formatDate(expense.date_incurred) }}
              </div>
            </div>
          </div>
          <div class="card-amount">Ksh {{ formatAmount(expense.amount) }}</div>
        </div>

        <div class="card-meta">
          <span class="cat-pill" :class="expense.category || 'other'">{{
            categoryLabel(expense.category)
          }}</span>
          <a
            v-if="expense.attachment"
            :href="expense.attachment"
            target="_blank"
            class="pill pill-link"
            @click.stop
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
              />
            </svg>
            Attachment
          </a>
        </div>

        <div v-if="expandedId === expense.id" class="detail-panel" @click.stop>
          <div class="detail-section-title">Details</div>
          <div class="detail-grid">
            <div>
              <div class="detail-key">Property</div>
              <div class="detail-val">{{ expense.property_name || '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Category</div>
              <div class="detail-val">
                <span class="cat-pill" :class="expense.category || 'other'">{{
                  categoryLabel(expense.category)
                }}</span>
              </div>
            </div>
            <div>
              <div class="detail-key">Amount</div>
              <div class="detail-val">Ksh {{ formatAmount(expense.amount) }}</div>
            </div>
            <div>
              <div class="detail-key">Date incurred</div>
              <div class="detail-val">{{ formatDate(expense.date_incurred) }}</div>
            </div>
          </div>

          <template v-if="expense.description">
            <div class="detail-section-title">Description</div>
            <div class="notes-box">{{ expense.description }}</div>
          </template>

          <template v-if="expense.attachment">
            <div class="detail-section-title">Attachment</div>
            <a :href="expense.attachment" target="_blank" class="attachment-row" @click.stop>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                />
              </svg>
              View attachment
            </a>
          </template>

          <div class="action-row">
            <button class="act-btn" @click.stop="editExpense(expense)">Edit</button>
            <button class="act-btn danger" @click.stop="confirmDelete(expense)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-footer" v-if="!loading && !error">
      <div class="results-info">
        Results: {{ filteredExpenses.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }} –
        {{ Math.min(currentPage * pageSize, filteredExpenses.length) }} of
        {{ filteredExpenses.length }}
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

    <Teleport to="body">
      <Transition name="backdrop">
        <div v-if="expenseToDelete" class="dialog-backdrop" @click="expenseToDelete = null" />
      </Transition>
      <Transition name="dialog">
        <div v-if="expenseToDelete" class="dialog" role="alertdialog">
          <div class="dialog-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 class="dialog-title">Delete expense?</h3>
          <p class="dialog-body">This record will be permanently deleted.</p>
          <div v-if="deleteError" class="dialog-error">{{ deleteError }}</div>
          <div class="dialog-actions">
            <button class="btn-cancel" @click="expenseToDelete = null" :disabled="isDeleting">
              Cancel
            </button>
            <button class="btn-danger" @click="executeDelete" :disabled="isDeleting">
              <span v-if="isDeleting" class="btn-bubbles"
                ><span></span><span></span><span></span
              ></span>
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiFetch } from '@/utils/api'

const props = defineProps({
  lastSubmit: { type: Number, default: 0 },
})

const emit = defineEmits(['open-drawer'])

watch(
  () => props.lastSubmit,
  (val) => {
    if (val) fetchExpenses()
  },
)

const expenses = ref([])
const loading = ref(true)
const error = ref('')

const expenseSearch = ref('')
const categoryFilter = ref('')
const propertyFilter = ref('')

const selectedExpenses = ref([])

const currentPage = ref(1)
const pageSize = 20

const expandedId = ref(null)
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const fetchExpenses = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/expenses/')
    if (!res.ok) {
      error.value = `Failed to load expenses (${res.status}).`
      return
    }
    const data = await res.json()
    expenses.value = Array.isArray(data) ? data : (data.results ?? [])
  } catch {
    error.value = 'Something went wrong. Could not load expenses.'
  } finally {
    loading.value = false
  }
}

const CATEGORIES = ['repair', 'maintenance', 'utility', 'security', 'cleaning', 'other']

const categoryOpts = computed(() => [
  { value: '', label: 'All', count: expenses.value.length },
  ...CATEGORIES.map((c) => ({
    value: c,
    label: categoryLabel(c),
    count: expenses.value.filter((e) => e.category === c).length,
  })).filter((opt) => opt.count > 0),
])

const totalSpent = computed(() =>
  filteredExpenses.value.reduce((s, e) => s + Number(e.amount || 0), 0),
)

const thisMonthSpent = computed(() => {
  const now = new Date()
  return expenses.value
    .filter((e) => {
      const d = new Date(e.date_incurred)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
    .reduce((s, e) => s + Number(e.amount || 0), 0)
})

const filteredExpenses = computed(() => {
  let list = expenses.value
  if (categoryFilter.value) list = list.filter((e) => e.category === categoryFilter.value)
  if (propertyFilter.value) list = list.filter((e) => e.property_name === propertyFilter.value)
  const q = expenseSearch.value.toLowerCase().trim()
  if (q)
    list = list.filter(
      (e) =>
        (e.property_name && e.property_name.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q)),
    )
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredExpenses.value.length / pageSize)))

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredExpenses.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total])
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.add(i)
  return [...pages].sort((a, b) => a - b)
})

const propertyOptions = computed(() => [
  ...new Set(expenses.value.map((e) => e.property_name).filter(Boolean)),
])

watch([expenseSearch, categoryFilter, propertyFilter], () => {
  currentPage.value = 1
  expandedId.value = null
})

const editExpense = (expense) => {
  emit('open-drawer', 'Edit Expense', {
    id: expense.id,
    property: expense.property,
    category: expense.category,
    description: expense.description,
    amount: expense.amount,
    date_incurred: expense.date_incurred,
    report: expense.report ?? '',
  })
}

const expenseToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const confirmDelete = (expense) => {
  deleteError.value = ''
  expenseToDelete.value = expense
}

const executeDelete = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    const res = await apiFetch(`/api/expenses/${expenseToDelete.value.id}/`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      expenses.value = expenses.value.filter((e) => e.id !== expenseToDelete.value.id)
      expenseToDelete.value = null
    } else {
      const d = await res.json().catch(() => ({}))
      deleteError.value = d.detail || `Delete failed (${res.status}).`
    }
  } catch {
    deleteError.value = 'Something went wrong. Could not delete.'
  } finally {
    isDeleting.value = false
  }
}

const deleteSelected = async () => {
  if (!selectedExpenses.value.length) return
  try {
    await Promise.all(
      selectedExpenses.value.map((id) => apiFetch(`/api/expenses/${id}/`, { method: 'DELETE' })),
    )
    expenses.value = expenses.value.filter((e) => !selectedExpenses.value.includes(e.id))
    selectedExpenses.value = []
  } catch {
    error.value = 'Bulk delete failed. Please try again.'
  }
}

const formatDate = (val) => {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatAmount = (val) =>
  Number(val || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const categoryLabel = (s) =>
  ({
    repair: 'Repair',
    maintenance: 'Maintenance',
    utility: 'Utility',
    security: 'Security',
    cleaning: 'Cleaning',
    other: 'Other',
  })[s] ||
  s ||
  '—'

const vClickOutside = {
  mounted(el, binding) {
    el._co = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('mousedown', el._co)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._co)
  },
}

onMounted(fetchExpenses)
</script>

<style scoped src="../../../styles/pages/finances/expenses.css"></style>
