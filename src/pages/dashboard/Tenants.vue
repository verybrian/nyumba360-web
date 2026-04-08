<template>
  <div class="tenants">
    <div class="header">
      <div class="header-left">
        <h2 class="page-title">Tenants</h2>
      </div>
      <div class="header-right">
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
          <input type="text" placeholder="Search tenants..." v-model="tenantSearch" />
        </div>

        <div class="filters-wrapper" :class="{ open: filtersOpen }">
          <button class="filter-btn" @click="filtersOpen = !filtersOpen">
            Filters
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div v-if="filtersOpen" class="filters-dropdown">
            <label>
              Status
              <select v-model="tenantStatus">
                <option value="active">Active</option>
                <option value="inactive">Moved Out</option>
                <option value="all">All</option>
              </select>
            </label>
            <label>
              Property
              <select v-model="propertyFilter">
                <option value="">All Properties</option>
                <option v-for="name in propertyOptions" :key="name" :value="name">
                  {{ name }}
                </option>
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span class="btn-text">Download</span>
        </button>

        <button @click="$emit('open-drawer', 'New Tenant')" class="add-tenant-button">
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
          <span>New tenant</span>
        </button>

        <button
          v-if="selectedTenants.length > 0"
          @click="deleteSelected"
          class="delete-tenant-button"
        >
          Delete ({{ selectedTenants.length }})
        </button>
      </div>
    </div>

    <div class="summary-strip">
      <div class="summary-card">
        <div class="summary-label">Total</div>
        <div class="summary-value">{{ filteredTenants.length }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Active</div>
        <div class="summary-value">
          {{ filteredTenants.filter((t) => t.is_active).length }}
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Moved out</div>
        <div class="summary-value">{{ filteredTenants.filter((t) => !t.is_active).length }}</div>
      </div>
    </div>

    <div v-if="loading" class="card-list">
      <div v-for="n in 5" :key="'sk-' + n" class="tenant-card skeleton-card">
        <div class="card-top">
          <div class="card-name-block">
            <div class="skeleton avatar-skel"></div>
            <div>
              <div class="skeleton sk-line sk-long"></div>
              <div class="skeleton sk-line sk-med" style="margin-top: 6px"></div>
            </div>
          </div>
          <div class="skeleton sk-line sk-short"></div>
        </div>
        <div class="card-meta">
          <div class="skeleton sk-pill"></div>
          <div class="skeleton sk-pill"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="error-cell">
      {{ error }} <button @click="fetchTenants">Retry</button>
    </div>

    <div v-else-if="paginatedTenants.length === 0" class="empty-state">
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p class="empty-title">No tenants found</p>
      <p class="empty-sub">
        {{
          tenantSearch || propertyFilter
            ? 'Try adjusting your filters.'
            : 'Add your first tenant to get started.'
        }}
      </p>
      <button
        v-if="!tenantSearch && !propertyFilter"
        class="empty-action"
        @click="$emit('open-drawer', 'New Tenant')"
      >
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
        Add tenant
      </button>
    </div>

    <div v-else class="card-list">
      <div
        v-for="tenant in paginatedTenants"
        :key="tenant.id"
        class="tenant-card"
        :class="{ expanded: expandedId === tenant.id }"
        @click="toggleExpand(tenant.id)"
      >
        <div class="card-top">
          <div class="card-name-block">
            <div class="avatar" :style="avatarStyle(tenant.name)">{{ initials(tenant.name) }}</div>
            <div>
              <div class="card-name">{{ tenant.name }}</div>
              <div class="card-sub">
                {{ tenant.unit_code || 'No unit'
                }}<template v-if="tenant.property_name">
                  &middot; {{ tenant.property_name }}</template
                ><template v-if="tenant.move_in_date">
                  &middot; since {{ formatDate(tenant.move_in_date) }}</template
                >
              </div>
            </div>
          </div>
          <div class="card-right">
            <span class="status-badge" :class="tenant.is_active ? 'active' : 'inactive'">
              {{ tenant.is_active ? 'Active' : 'Moved out' }}
            </span>
            <div v-if="tenant.reliability_score != null" class="score-bar-wrap">
              <span class="score-label">Reliability</span>
              <div class="score-track">
                <div class="score-fill" :style="scoreFillStyle(tenant.reliability_score)"></div>
              </div>
              <span class="score-val" :style="{ color: scoreColor(tenant.reliability_score) }"
                >{{ tenant.reliability_score }}%</span
              >
            </div>
          </div>
        </div>

        <div class="card-meta">
          <span class="pill-mono">{{ tenant.phone_number || '—' }}</span>
          <span v-if="tenant.monthly_due_day" class="pill"
            >Due day {{ tenant.monthly_due_day }}</span
          >
          <span v-if="!tenant.is_active && tenant.move_out_date" class="pill pill-muted"
            >Out {{ formatDate(tenant.move_out_date) }}</span
          >
        </div>

        <div v-if="expandedId === tenant.id" class="detail-panel" @click.stop>
          <template v-if="tenant.reliability_score != null">
            <div class="detail-section-title">Reliability score</div>
            <div class="score-detail">
              <div class="score-big" :style="{ color: scoreColor(tenant.reliability_score) }">
                {{ tenant.reliability_score }}%
              </div>
              <div class="score-breakdown">
                <div v-for="item in scoreBreakdown(tenant)" :key="item.label" class="score-row">
                  <span class="score-row-label">{{ item.label }}</span>
                  <div class="mini-track">
                    <div
                      class="mini-fill"
                      :style="{ width: item.value + '%', background: scoreColor(item.value) }"
                    ></div>
                  </div>
                  <span class="score-row-val">{{ item.value }}%</span>
                </div>
              </div>
            </div>
          </template>

          <div class="detail-section-title">Details</div>
          <div class="detail-grid">
            <div>
              <div class="detail-key">ID number</div>
              <div class="detail-val">{{ tenant.id_number || '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Alt. phone</div>
              <div class="detail-val">{{ tenant.alt_phone_number || '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Move-in date</div>
              <div class="detail-val">{{ formatDate(tenant.move_in_date) }}</div>
            </div>
            <div>
              <div class="detail-key">Move-out date</div>
              <div class="detail-val">{{ formatDate(tenant.move_out_date) }}</div>
            </div>
            <div>
              <div class="detail-key">Monthly due day</div>
              <div class="detail-val">
                {{
                  tenant.monthly_due_day
                    ? `${tenant.monthly_due_day}${ordinal(tenant.monthly_due_day)}`
                    : '—'
                }}
              </div>
            </div>
            <div>
              <div class="detail-key">Unit</div>
              <div class="detail-val">{{ tenant.unit_code || '—' }}</div>
            </div>
          </div>

          <template v-if="tenant.notes">
            <div class="detail-section-title">Notes</div>
            <div class="notes-box">{{ tenant.notes }}</div>
          </template>

          <div class="action-row">
            <button class="act-btn" @click.stop="recordPayment(tenant)">Record payment</button>
            <button class="act-btn" @click.stop="editTenant(tenant)">Edit</button>
            <button class="act-btn danger" @click.stop="confirmDelete(tenant)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-footer" v-if="!loading && !error">
      <div class="results-info">
        Results: {{ filteredTenants.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }} –
        {{ Math.min(currentPage * pageSize, filteredTenants.length) }} of
        {{ filteredTenants.length }}
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
        <div v-if="tenantToDelete" class="dialog-backdrop" @click="tenantToDelete = null" />
      </Transition>
      <Transition name="dialog">
        <div v-if="tenantToDelete" class="dialog" role="alertdialog">
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
          <h3 class="dialog-title">Delete tenant?</h3>
          <p class="dialog-body">
            <strong>{{ tenantToDelete.name }}</strong> will be permanently removed.
          </p>
          <div v-if="deleteError" class="dialog-error">{{ deleteError }}</div>
          <div class="dialog-actions">
            <button class="btn-cancel" @click="tenantToDelete = null" :disabled="isDeleting">
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
    if (val) fetchTenants()
  },
)

const tenants = ref([])
const loading = ref(true)
const error = ref('')

const tenantSearch = ref('')
const tenantStatus = ref('active')
const propertyFilter = ref('')
const filtersOpen = ref(false)

const selectedTenants = ref([])

const currentPage = ref(1)
const pageSize = 20

const expandedId = ref(null)

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const editTenant = (tenant) => {
  emit('open-drawer', 'Edit Tenant', tenant)
}

const recordPayment = (tenant) => {
  emit('open-drawer', 'New Payment', { tenantId: tenant.id, tenantName: tenant.name })
}

const tenantToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const confirmDelete = (tenant) => {
  deleteError.value = ''
  tenantToDelete.value = tenant
}

const executeDelete = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    const res = await apiFetch(`/api/tenants/${tenantToDelete.value.id}/`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      tenants.value = tenants.value.filter((t) => t.id !== tenantToDelete.value.id)
      tenantToDelete.value = null
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
  if (!selectedTenants.value.length) return
  try {
    await Promise.all(
      selectedTenants.value.map((id) => apiFetch(`/api/tenants/${id}/`, { method: 'DELETE' })),
    )
    tenants.value = tenants.value.filter((t) => !selectedTenants.value.includes(t.id))
    selectedTenants.value = []
  } catch {
    error.value = 'Bulk delete failed. Please try again.'
  }
}

const fetchTenants = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/tenants/')
    if (!res.ok) {
      error.value = `Failed to load tenants (${res.status}).`
      return
    }
    const data = await res.json()
    tenants.value = Array.isArray(data) ? data : (data.results ?? [])
  } catch {
    error.value = 'Something went wrong. Could not load tenants.'
  } finally {
    loading.value = false
  }
}

const filteredTenants = computed(() => {
  let list = tenants.value
  if (tenantStatus.value === 'active') list = list.filter((t) => t.is_active)
  if (tenantStatus.value === 'inactive') list = list.filter((t) => !t.is_active)
  if (propertyFilter.value) list = list.filter((t) => t.property_name === propertyFilter.value)
  const q = tenantSearch.value.toLowerCase().trim()
  if (q)
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.phone_number && t.phone_number.includes(q)) ||
        (t.unit_code && t.unit_code.toLowerCase().includes(q)),
    )
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTenants.value.length / pageSize)))

const paginatedTenants = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTenants.value.slice(start, start + pageSize)
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
  ...new Set(tenants.value.map((t) => t.property_name).filter(Boolean)),
])

const formatDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

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

const scoreColor = (score) => {
  if (score >= 80) return '#0F6E56'
  if (score >= 60) return '#854F0B'
  return '#A32D2D'
}

const scoreFillStyle = (score) => ({
  width: score + '%',
  background: scoreColor(score),
})

const scoreBreakdown = (tenant) => {
  return [
    {
      label: 'On-time payments',
      value: tenant.score_payments ?? Math.min(100, Math.round(tenant.reliability_score * 1.04)),
    },
    {
      label: 'Lease compliance',
      value: tenant.score_compliance ?? Math.min(100, Math.round(tenant.reliability_score * 0.97)),
    },
    {
      label: 'Maintenance resp.',
      value: tenant.score_maintenance ?? Math.min(100, Math.round(tenant.reliability_score * 0.93)),
    },
  ]
}

watch([tenantSearch, tenantStatus, propertyFilter], () => {
  currentPage.value = 1
  expandedId.value = null
})

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

onMounted(fetchTenants)
</script>

<style scoped src="../../styles/pages/tenants.css"></style>
