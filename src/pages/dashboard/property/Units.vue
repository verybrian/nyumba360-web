<template>
  <div class="units">
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
          <input type="text" placeholder="Search units..." v-model="unitSearch" />
          <button v-if="unitSearch" class="search-clear" @click="unitSearch = ''">
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="filter-group">
          <button
            v-for="opt in filterOpts"
            :key="opt.value"
            class="filter-chip"
            :class="{ active: unitFilter === opt.value }"
            @click="unitFilter = opt.value"
          >
            {{ opt.label }}
            <span class="chip-count">{{ opt.count }}</span>
          </button>
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
        <button class="add-unit-button" @click="$emit('open-drawer', 'New Unit', { propertyId })">
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
          <span>New unit</span>
        </button>
        <button
          v-if="selectedUnits.length > 0"
          class="delete-unit-button"
          @click="confirmDeleteSelected"
        >
          Delete ({{ selectedUnits.length }})
        </button>
      </div>
    </div>

    <div v-if="loading" class="card-grid">
      <div v-for="n in 6" :key="'sk-' + n" class="unit-card skeleton-card">
        <div class="card-header-row">
          <div class="skeleton sk-line sk-med"></div>
          <div class="skeleton sk-badge"></div>
        </div>
        <div class="skeleton sk-line sk-long" style="margin-top: 8px"></div>
        <div class="card-foot-row" style="margin-top: 12px">
          <div class="skeleton sk-pill"></div>
          <div class="skeleton sk-pill"></div>
        </div>
      </div>
    </div>

    <div v-else-if="fetchError" class="inline-error">
      <svg
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
      <span>{{ fetchError }}</span>
      <button class="retry-btn" @click="fetchUnits">Retry</button>
    </div>

    <div v-else-if="units.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
          <path d="M3 11h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11Z" />
          <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
        </svg>
      </div>
      <p class="empty-title">No units yet</p>
      <p class="empty-sub">Add units to start tracking occupancy and rent.</p>
      <button class="empty-action" @click="$emit('open-drawer', 'New Unit', { propertyId })">
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
        Add unit
      </button>
    </div>

    <div v-else-if="filteredUnits.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <p class="empty-title">No results found</p>
      <button
        class="empty-action"
        @click="
          () => {
            unitSearch = ''
            unitFilter = ''
          }
        "
      >
        Clear filters
      </button>
    </div>

    <div v-else class="card-grid">
      <div
        v-for="unit in paginatedUnits"
        :key="unit.id"
        class="unit-card"
        :class="[unit.is_available ? 'vacant' : 'occupied', { expanded: expandedId === unit.id }]"
        @click="toggleExpand(unit.id)"
      >
        <div class="card-header-row">
          <div class="unit-code">{{ unit.code || unit.unique_ref || 'Unit' }}</div>
          <span class="avail-badge" :class="unit.is_available ? 'vacant' : 'occupied'">
            {{ unit.is_available ? 'Vacant' : 'Occupied' }}
          </span>
        </div>

        <div class="unit-price">
          Ksh {{ formatPrice(unit.price) }}<span class="price-freq">/mo</span>
        </div>

        <div class="card-foot-row">
          <span v-if="unit.block_name" class="pill">{{ unit.block_name }}</span>
          <span v-if="unit.rooms" class="pill"
            >{{ unit.rooms }} room{{ unit.rooms !== 1 ? 's' : '' }}</span
          >
          <span class="cond-pill" :class="unit.condition">{{
            conditionLabel(unit.condition)
          }}</span>
        </div>

        <div v-if="expandedId === unit.id" class="detail-panel" @click.stop>
          <div class="detail-grid">
            <div>
              <div class="detail-key">Unit code</div>
              <div class="detail-val">{{ unit.code || '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Unique ref</div>
              <div class="detail-val mono">{{ unit.unique_ref || '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Block</div>
              <div class="detail-val">{{ unit.block_name || '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Rooms</div>
              <div class="detail-val">{{ unit.rooms ?? '—' }}</div>
            </div>
            <div>
              <div class="detail-key">Rent</div>
              <div class="detail-val">Ksh {{ formatPrice(unit.price) }}/mo</div>
            </div>
            <div>
              <div class="detail-key">Condition</div>
              <div class="detail-val">
                <span class="cond-pill" :class="unit.condition">{{
                  conditionLabel(unit.condition)
                }}</span>
              </div>
            </div>
            <div>
              <div class="detail-key">Last inspection</div>
              <div class="detail-val">{{ formatDate(unit.last_inspection_date) }}</div>
            </div>
            <div>
              <div class="detail-key">Status</div>
              <div class="detail-val">
                <span class="avail-badge" :class="unit.is_available ? 'vacant' : 'occupied'">{{
                  unit.is_available ? 'Vacant' : 'Occupied'
                }}</span>
              </div>
            </div>
          </div>

          <template v-if="unit.notes">
            <div class="detail-section-title">Notes</div>
            <div class="notes-box">{{ unit.notes }}</div>
          </template>

          <div class="action-row">
            <button class="act-btn" @click.stop="editUnit(unit)">Edit</button>
            <button class="act-btn danger" @click.stop="confirmDelete(unit)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="table-footer" v-if="!loading && !fetchError && filteredUnits.length > 0">
      <div class="results-info">
        Results: {{ (currentPage - 1) * pageSize + 1 }}–{{
          Math.min(currentPage * pageSize, filteredUnits.length)
        }}
        of {{ filteredUnits.length }}
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

  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="unitToDelete" class="dialog-backdrop" @click="unitToDelete = null" />
    </Transition>
    <Transition name="dialog">
      <div v-if="unitToDelete" class="dialog" role="alertdialog">
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
        <h3 class="dialog-title">Delete unit?</h3>
        <p class="dialog-body">
          Unit <strong>{{ unitToDelete.code || unitToDelete.unique_ref }}</strong> will be
          permanently deleted.
        </p>
        <div v-if="deleteError" class="dialog-error">{{ deleteError }}</div>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="unitToDelete = null" :disabled="isDeleting">
            Cancel
          </button>
          <button class="btn-danger" @click="executeDelete" :disabled="isDeleting">
            <span v-if="isDeleting" class="btn-bubbles"
              ><span></span><span></span><span></span
            ></span>
            <span v-else>Delete unit</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'

const props = defineProps({
  propertyId: { type: String, required: true },
  lastSubmit: { type: Number, default: 0 },
})

const emit = defineEmits(['open-drawer', 'update:unit-count'])

const units = ref([])
const loading = ref(true)
const fetchError = ref('')

const unitSearch = ref('')
const unitFilter = ref('')
const currentPage = ref(1)
const pageSize = 18

const expandedId = ref(null)
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const selectedUnits = ref([])

const fetchUnits = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await apiFetch(`/api/properties/${props.propertyId}/units/`)
    if (!res.ok) {
      fetchError.value = `Failed to load units (${res.status}).`
      return
    }
    const data = await res.json()
    units.value = Array.isArray(data) ? data : (data.results ?? [])
    emit('update:unit-count', units.value.length)
  } catch {
    fetchError.value = 'Could not load units. Check your connection.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.lastSubmit,
  (val) => {
    if (val) fetchUnits()
  },
)
onMounted(fetchUnits)

const filterOpts = computed(() => [
  { value: '', label: 'All', count: units.value.length },
  { value: 'vacant', label: 'Vacant', count: units.value.filter((u) => u.is_available).length },
  {
    value: 'occupied',
    label: 'Occupied',
    count: units.value.filter((u) => !u.is_available).length,
  },
])

const filteredUnits = computed(() => {
  let list = units.value
  if (unitFilter.value === 'vacant') list = list.filter((u) => u.is_available)
  if (unitFilter.value === 'occupied') list = list.filter((u) => !u.is_available)
  const q = unitSearch.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (u) =>
        (u.code && u.code.toLowerCase().includes(q)) ||
        (u.unique_ref && u.unique_ref.toLowerCase().includes(q)) ||
        (u.block_name && u.block_name.toLowerCase().includes(q)),
    )
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUnits.value.length / pageSize)))

const paginatedUnits = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUnits.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total])
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.add(i)
  return [...pages].sort((a, b) => a - b)
})

watch([unitSearch, unitFilter], () => {
  currentPage.value = 1
  expandedId.value = null
})

const editUnit = (unit) => {
  emit('open-drawer', 'Edit Unit', unit)
}

const confirmDeleteSelected = () => {
  // TODO: bulk delete dialog
}

const unitToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const confirmDelete = (unit) => {
  deleteError.value = ''
  unitToDelete.value = unit
}

const executeDelete = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    const res = await apiFetch(`/api/units/${unitToDelete.value.id}/`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      units.value = units.value.filter((u) => u.id !== unitToDelete.value.id)
      selectedUnits.value = selectedUnits.value.filter((id) => id !== unitToDelete.value.id)
      emit('update:unit-count', units.value.length)
      unitToDelete.value = null
    } else {
      const data = await res.json().catch(() => ({}))
      deleteError.value = data.detail || `Delete failed (${res.status}).`
    }
  } catch {
    deleteError.value = 'Something went wrong. Could not delete unit.'
  } finally {
    isDeleting.value = false
  }
}

const conditionLabel = (val) =>
  ({
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    needs_repair: 'Needs repair',
    uninhabitable: 'Uninhabitable',
  })[val] ||
  val ||
  '—'

const formatPrice = (val) => {
  if (!val) return '—'
  return Number(val).toLocaleString('en-KE')
}

const formatDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  return isNaN(d)
    ? val
    : d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
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
</script>

<style scoped src="../../../styles/pages/property/units.css"></style>
