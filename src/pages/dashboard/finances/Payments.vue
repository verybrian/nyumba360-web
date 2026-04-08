<template>
  <div class="payments">
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
          <input type="text" placeholder="Search payments..." v-model="paymentSearch" />
        </div>

        <div class="filter-group">
          <button
            v-for="opt in statusOpts"
            :key="opt.value"
            class="filter-chip"
            :class="{ active: paymentStatus === opt.value }"
            @click="paymentStatus = opt.value"
          >
            {{ opt.label }}<span class="chip-count">{{ opt.count }}</span>
          </button>
        </div>

        <div class="filter-divider"></div>

        <button
          v-for="opt in purposeOpts"
          :key="opt.value"
          class="filter-chip"
          :class="{ active: purposeFilter === opt.value }"
          @click="purposeFilter = opt.value"
        >
          {{ opt.label }}
        </button>

        <div class="filter-divider"></div>

        <select v-if="propertyOptions.length > 1" v-model="propertyFilter" class="filter-select">
          <option value="">All properties</option>
          <option v-for="name in propertyOptions" :key="name" :value="name">{{ name }}</option>
        </select>
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

        <button class="add-payment-button" @click="$emit('open-drawer', 'New Payment')">
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
          <span>New payment</span>
        </button>

        <button
          v-if="selectedPayments.length > 0"
          @click="deleteSelected"
          class="delete-payment-button"
        >
          Delete ({{ selectedPayments.length }})
        </button>
      </div>
    </div>

    <div class="summary-strip">
      <div class="summary-card">
        <div class="summary-label">Total collected</div>
        <div class="summary-value">Ksh {{ formatAmount(totalCollected) }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Paid</div>
        <div class="summary-value paid-count">{{ paidCount }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Pending</div>
        <div class="summary-value pending-count">{{ pendingCount }}</div>
      </div>
    </div>

    <div v-if="loading" class="card-list">
      <div v-for="n in 5" :key="'sk-' + n" class="pay-card skeleton-card">
        <div class="card-top">
          <div class="card-name-block">
            <div class="skeleton avatar-skel"></div>
            <div>
              <div class="skeleton sk-line sk-long"></div>
              <div class="skeleton sk-line sk-med" style="margin-top: 6px"></div>
            </div>
          </div>
          <div style="text-align: right">
            <div class="skeleton sk-line sk-long"></div>
            <div class="skeleton sk-badge" style="margin-top: 6px; margin-left: auto"></div>
          </div>
        </div>
        <div class="card-meta">
          <div class="skeleton sk-pill"></div>
          <div class="skeleton sk-pill"></div>
          <div class="skeleton sk-pill"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="error-cell">
      {{ error }} <button @click="fetchPayments">Retry</button>
    </div>

    <div v-else-if="paginatedPayments.length === 0" class="empty-state">
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
          paymentSearch || paymentStatus || propertyFilter || purposeFilter
            ? 'No results found'
            : 'No payments yet'
        }}
      </p>
      <p
        v-if="!paymentSearch && !paymentStatus && !propertyFilter && !purposeFilter"
        class="empty-sub"
      >
        Record your first payment to start tracking income.
      </p>
      <button
        v-if="paymentSearch || paymentStatus || propertyFilter || purposeFilter"
        class="empty-action"
        @click="
          () => {
            paymentSearch = ''
            paymentStatus = ''
            propertyFilter = ''
            purposeFilter = ''
          }
        "
      >
        Clear filters
      </button>
      <button v-else class="empty-action" @click="$emit('open-drawer', 'New Payment')">
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
        Add payment
      </button>
    </div>

    <div v-else class="card-list">
      <div
        v-for="payment in paginatedPayments"
        :key="payment.id"
        class="pay-card"
        :class="{ expanded: expandedId === payment.id }"
        @click="toggleExpand(payment.id)"
      >
        <div class="card-top">
          <div class="card-name-block">
            <div class="avatar" :style="avatarStyle(payment.tenant_name)">
              {{ initials(payment.tenant_name) }}
            </div>
            <div>
              <div class="card-name">{{ payment.tenant_name || 'Unknown tenant' }}</div>
              <div class="card-sub">{{ formatDate(payment.payment_date) }}</div>
            </div>
          </div>
          <div style="text-align: right; flex-shrink: 0">
            <div class="card-amount">Ksh {{ formatAmount(payment.amount) }}</div>
            <span class="status-badge" :class="payment.status">{{
              statusLabel(payment.status)
            }}</span>
          </div>
        </div>

        <div class="card-meta">
          <span class="pill-mono">{{
            payment.reference || payment.custom_id?.toUpperCase() || '—'
          }}</span>
          <span class="pill">{{ purposeLabel(payment.purpose) }}</span>
          <span class="pill">{{ methodLabel(payment.payment_method) }}</span>
        </div>

        <div v-if="expandedId === payment.id" class="detail-panel" @click.stop>
          <div class="detail-section-title">Details</div>
          <div class="detail-grid">
            <div>
              <div class="detail-key">Payment ID</div>
              <div class="detail-val mono">
                {{ payment.reference || payment.custom_id?.toUpperCase() || payment.id }}
              </div>
            </div>
            <div>
              <div class="detail-key">Tenant</div>
              <div class="detail-val">{{ payment.tenant_name || '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Amount</div>
              <div class="detail-val">Ksh {{ formatAmount(payment.amount) }}</div>
            </div>
            <div>
              <div class="detail-key">Date</div>
              <div class="detail-val">{{ formatDate(payment.payment_date) }}</div>
            </div>
            <div>
              <div class="detail-key">Purpose</div>
              <div class="detail-val">{{ purposeLabel(payment.purpose) }}</div>
            </div>
            <div>
              <div class="detail-key">Method</div>
              <div class="detail-val">{{ methodLabel(payment.payment_method) }}</div>
            </div>
            <div>
              <div class="detail-key">Status</div>
              <div class="detail-val">
                <span class="status-badge" :class="payment.status">{{
                  statusLabel(payment.status)
                }}</span>
              </div>
            </div>
            <div v-if="payment.unit_code">
              <div class="detail-key">Unit</div>
              <div class="detail-val">{{ payment.unit_code }}</div>
            </div>
          </div>

          <template v-if="payment.notes">
            <div class="detail-section-title">Notes</div>
            <div class="notes-box">{{ payment.notes }}</div>
          </template>

          <div class="action-row">
            <button class="act-btn" @click.stop="editPayment(payment)">Edit</button>
            <button class="act-btn danger" @click.stop="confirmDelete(payment)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-footer" v-if="!loading && !error">
      <div class="results-info">
        Results: {{ filteredPayments.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }} –
        {{ Math.min(currentPage * pageSize, filteredPayments.length) }} of
        {{ filteredPayments.length }}
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
        <div v-if="paymentToDelete" class="dialog-backdrop" @click="paymentToDelete = null" />
      </Transition>
      <Transition name="dialog">
        <div v-if="paymentToDelete" class="dialog" role="alertdialog">
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
          <h3 class="dialog-title">Delete payment?</h3>
          <p class="dialog-body">This record will be permanently deleted.</p>
          <div v-if="deleteError" class="dialog-error">{{ deleteError }}</div>
          <div class="dialog-actions">
            <button class="btn-cancel" @click="paymentToDelete = null" :disabled="isDeleting">
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

const emit = defineEmits(['open-drawer'])

const props = defineProps({
  lastSubmit: { type: Number, default: 0 },
})

watch(
  () => props.lastSubmit,
  (val) => {
    if (val) fetchPayments()
  },
)

const payments = ref([])
const loading = ref(true)
const error = ref('')

const paymentSearch = ref('')
const paymentStatus = ref('')
const propertyFilter = ref('')
const purposeFilter = ref('')
const filtersOpen = ref(false)

const selectedPayments = ref([])

const currentPage = ref(1)
const pageSize = 20

const expandedId = ref(null)
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const fetchPayments = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/payments/')
    if (!res.ok) {
      error.value = `Failed to load payments (${res.status}).`
      return
    }
    const data = await res.json()
    payments.value = Array.isArray(data) ? data : (data.results ?? [])
  } catch {
    error.value = 'Something went wrong. Could not load payments.'
  } finally {
    loading.value = false
  }
}

const statusOpts = computed(() => [
  { value: '', label: 'All', count: payments.value.length },
  {
    value: 'success',
    label: 'Paid',
    count: payments.value.filter((p) => p.status === 'success').length,
  },
  {
    value: 'pending',
    label: 'Pending',
    count: payments.value.filter((p) => p.status === 'pending').length,
  },
  {
    value: 'failed',
    label: 'Failed',
    count: payments.value.filter((p) => p.status === 'failed').length,
  },
])

const purposeOpts = [
  { value: '', label: 'All purposes' },
  { value: 'rent', label: 'Rent' },
  { value: 'fine', label: 'Fine' },
  { value: 'repairs', label: 'Repairs' },
]

const totalCollected = computed(() =>
  payments.value
    .filter((p) => p.status === 'success')
    .reduce((s, p) => s + Number(p.amount || 0), 0),
)
const paidCount = computed(() => payments.value.filter((p) => p.status === 'success').length)
const pendingCount = computed(() => payments.value.filter((p) => p.status === 'pending').length)

const filteredPayments = computed(() => {
  let list = payments.value
  if (paymentStatus.value) list = list.filter((p) => p.status === paymentStatus.value)
  if (propertyFilter.value) list = list.filter((p) => p.property_name === propertyFilter.value)
  if (purposeFilter.value) list = list.filter((p) => p.purpose === purposeFilter.value)
  const q = paymentSearch.value.toLowerCase().trim()
  if (q)
    list = list.filter(
      (p) =>
        (p.custom_id && p.custom_id.toLowerCase().includes(q)) ||
        (p.tenant_name && p.tenant_name.toLowerCase().includes(q)) ||
        (p.payment_ref && p.payment_ref.toLowerCase().includes(q)) ||
        (p.reference && p.reference.toLowerCase().includes(q)) ||
        (p.unit_code && p.unit_code.toLowerCase().includes(q)) ||
        p.id.toString().includes(q),
    )
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPayments.value.length / pageSize)))

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPayments.value.slice(start, start + pageSize)
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
  ...new Set(payments.value.map((p) => p.property_name).filter(Boolean)),
])

watch([paymentSearch, paymentStatus, propertyFilter, purposeFilter], () => {
  currentPage.value = 1
  expandedId.value = null
})

const editPayment = (payment) => {
  emit('open-drawer', 'Edit Payment', {
    id: payment.id,
    tenant: payment.tenant,
    unit: payment.unit,
    amount: payment.amount,
    payment_date: payment.payment_date,
    payment_method: payment.payment_method,
    purpose: payment.purpose,
    status: payment.status,
    reference: payment.payment_ref ?? payment.reference ?? '',
    notes: payment.notes ?? '',
  })
}

const paymentToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const confirmDelete = (payment) => {
  deleteError.value = ''
  paymentToDelete.value = payment
}

const executeDelete = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    const res = await apiFetch(`/api/payments/${paymentToDelete.value.id}/`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      payments.value = payments.value.filter((p) => p.id !== paymentToDelete.value.id)
      paymentToDelete.value = null
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
  if (!selectedPayments.value.length) return
  try {
    await Promise.all(
      selectedPayments.value.map((id) => apiFetch(`/api/payments/${id}/`, { method: 'DELETE' })),
    )
    payments.value = payments.value.filter((p) => !selectedPayments.value.includes(p.id))
    selectedPayments.value = []
  } catch {
    error.value = 'Bulk delete failed. Please try again.'
  }
}

const formatDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatAmount = (val) => {
  if (!val && val !== 0) return '—'
  return Number(val).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const statusLabel = (s) =>
  ({ success: 'Paid', pending: 'Pending', failed: 'Failed' })[s] || s || '—'
const purposeLabel = (s) => ({ rent: 'Rent', fine: 'Fine', repairs: 'Repairs' })[s] || s || '—'
const methodLabel = (s) => ({ mpesa: 'M-Pesa', cash: 'Cash', bank: 'Bank Transfer' })[s] || s || '—'

const initials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

const AVATAR_PALETTES = [
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#FAECE7', color: '#712B13' },
  { bg: '#FBEAF0', color: '#72243E' },
  { bg: '#EAF3DE', color: '#27500A' },
]

const avatarStyle = (name) => {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length
  const p = AVATAR_PALETTES[idx]
  return { background: p.bg, color: p.color }
}

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

onMounted(fetchPayments)
</script>

<style scoped src="../../../styles/pages/finances/payments.css"></style>
