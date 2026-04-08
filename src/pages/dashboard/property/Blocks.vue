<template>
  <div class="blocks">
    <!-- ── Header ── -->
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
          <input type="text" placeholder="Search blocks..." v-model="blockSearch" />
          <button v-if="blockSearch" class="search-clear" @click="blockSearch = ''">
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
      </div>
      <div class="header-right">
        <button
          class="add-block-button"
          @click="$emit('open-drawer', 'New Block', { propertyId: props.propertyId })"
        >
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
          <span>New block</span>
        </button>
      </div>
    </div>

    <!-- ── Summary strip ── -->
    <div class="summary-strip">
      <div class="summary-card">
        <div class="summary-label">Total blocks</div>
        <div class="summary-value">{{ blocks.length }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Total units</div>
        <div class="summary-value">{{ totalUnits }}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Avg. occupancy</div>
        <div
          class="summary-value"
          :class="avgOccupancy >= 70 ? 'occ-high' : avgOccupancy >= 40 ? 'occ-mid' : 'occ-low'"
        >
          {{ avgOccupancy }}%
        </div>
      </div>
    </div>

    <!-- ── Error ── -->
    <div v-if="fetchError" class="inline-error">
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
      <button class="retry-btn" @click="fetchBlocks">Retry</button>
    </div>

    <!-- ── Loading skeletons ── -->
    <div v-else-if="loading" class="card-list">
      <div v-for="n in 4" :key="'sk-' + n" class="block-card skeleton-card">
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

    <!-- ── Empty: no blocks at all ── -->
    <div v-else-if="!fetchError && blocks.length === 0" class="empty-state">
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
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </div>
      <p class="empty-title">No blocks yet</p>
      <p class="empty-sub">Add your first block to organise units within this property.</p>
      <button
        class="empty-action"
        @click="$emit('open-drawer', 'New Block', { propertyId: props.propertyId })"
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
        Add block
      </button>
    </div>

    <!-- ── Empty: no search results ── -->
    <div v-else-if="!fetchError && filteredBlocks.length === 0" class="empty-state">
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
      <p class="empty-title">No results for "{{ blockSearch }}"</p>
      <button class="empty-action" @click="blockSearch = ''">Clear search</button>
    </div>

    <!-- ── Card list ── -->
    <div v-else class="card-list">
      <div
        v-for="block in paginatedBlocks"
        :key="block.id"
        class="block-card"
        :class="{ expanded: expandedId === block.id }"
        @click="toggleExpand(block.id)"
      >
        <!-- Card face -->
        <div class="card-top">
          <div class="card-name-block">
            <div
              class="avatar"
              :style="{
                background: avatarBg(block.name_or_code),
                color: avatarColor(block.name_or_code),
              }"
            >
              {{ initials(block.name_or_code) }}
            </div>
            <div>
              <div class="card-name">{{ block.name_or_code || 'Unnamed block' }}</div>
              <div class="card-sub">
                {{ block.unit_count ?? 0 }} unit{{ block.unit_count !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
          <div class="card-right">
            <div class="occ-wrap">
              <div class="occ-track">
                <div
                  class="occ-fill"
                  :style="{
                    width: occupancyPct(block) + '%',
                    background: occupancyColor(occupancyPct(block)),
                  }"
                ></div>
              </div>
              <span class="occ-val" :style="{ color: occupancyColor(occupancyPct(block)) }"
                >{{ occupancyPct(block) }}%</span
              >
            </div>
          </div>
        </div>

        <!-- Pills -->
        <div class="card-meta">
          <span class="pill">{{ block.unit_count ?? 0 }} units</span>
          <span class="pill pill-occ" :style="occupancyPillStyle(occupancyPct(block))">
            {{ occupancyLabel(occupancyPct(block)) }}
          </span>
        </div>

        <!-- Expanded panel -->
        <div v-if="expandedId === block.id" class="detail-panel" @click.stop>
          <div class="detail-section-title">Occupancy</div>
          <div class="occ-detail">
            <div class="occ-stat">
              <div class="occ-stat-val">{{ occupiedCount(block) }}</div>
              <div class="occ-stat-label">Occupied</div>
            </div>
            <div class="occ-divider"></div>
            <div class="occ-stat">
              <div class="occ-stat-val">{{ block.vacant_count ?? 0 }}</div>
              <div class="occ-stat-label">Vacant</div>
            </div>
            <div class="occ-divider"></div>
            <div class="occ-stat">
              <div class="occ-stat-val">{{ block.unit_count ?? 0 }}</div>
              <div class="occ-stat-label">Total</div>
            </div>
            <div class="occ-bar-large">
              <div
                class="occ-fill"
                :style="{
                  width: occupancyPct(block) + '%',
                  background: occupancyColor(occupancyPct(block)),
                }"
              ></div>
            </div>
          </div>

          <template v-if="block.notes">
            <div class="detail-section-title">Notes</div>
            <div class="notes-box">{{ block.notes }}</div>
          </template>

          <div class="action-row">
            <button
              class="act-btn"
              @click.stop="$emit('change-tab', 'units', { blockId: block.id })"
            >
              View units
            </button>
            <button class="act-btn" @click.stop="editBlock(block)">Edit</button>
            <button class="act-btn danger" @click.stop="confirmDelete(block)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Footer ── -->
    <div class="table-footer" v-if="!loading && !fetchError && filteredBlocks.length > 0">
      <div class="results-info">
        Results: {{ (currentPage - 1) * pageSize + 1 }}–{{
          Math.min(currentPage * pageSize, filteredBlocks.length)
        }}
        of {{ filteredBlocks.length }}
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

  <!-- ── Delete dialog ── -->
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="blockToDelete" class="dialog-backdrop" @click="blockToDelete = null" />
    </Transition>
    <Transition name="dialog">
      <div v-if="blockToDelete" class="dialog" role="alertdialog">
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
        <h3 class="dialog-title">Delete block?</h3>
        <p class="dialog-body">
          <strong>{{ blockToDelete.name_or_code }}</strong> and all its associated units will be
          permanently deleted.
        </p>
        <div v-if="deleteError" class="dialog-error">{{ deleteError }}</div>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="blockToDelete = null" :disabled="isDeleting">
            Cancel
          </button>
          <button class="btn-danger" @click="executeDelete" :disabled="isDeleting">
            <span v-if="isDeleting" class="btn-bubbles"
              ><span></span><span></span><span></span
            ></span>
            <span v-else>Delete block</span>
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

const emit = defineEmits(['open-drawer', 'change-tab', 'update:block-count'])

const blocks = ref([])
const loading = ref(true)
const fetchError = ref('')

const blockSearch = ref('')
const currentPage = ref(1)
const pageSize = 10

const expandedId = ref(null)

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const fetchBlocks = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await apiFetch(`/api/properties/${props.propertyId}/blocks/`)
    if (!res.ok) {
      fetchError.value = `Failed to load blocks (${res.status}).`
      return
    }
    const data = await res.json()
    blocks.value = Array.isArray(data) ? data : (data.results ?? [])
    emit('update:block-count', blocks.value.length)
  } catch {
    fetchError.value = 'Could not load blocks. Check your connection.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.lastSubmit,
  (val) => {
    if (val) fetchBlocks()
  },
)

onMounted(fetchBlocks)

const filteredBlocks = computed(() => {
  const q = blockSearch.value.toLowerCase().trim()
  if (!q) return blocks.value
  return blocks.value.filter((b) => b.name_or_code.toLowerCase().includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBlocks.value.length / pageSize)))

const paginatedBlocks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBlocks.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total])
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) pages.add(i)
  return [...pages].sort((a, b) => a - b)
})

const totalUnits = computed(() => blocks.value.reduce((s, b) => s + (b.unit_count ?? 0), 0))

const avgOccupancy = computed(() => {
  if (!blocks.value.length) return 0
  const sum = blocks.value.reduce((s, b) => s + occupancyPct(b), 0)
  return Math.round(sum / blocks.value.length)
})

watch(blockSearch, () => {
  currentPage.value = 1
})

const editBlock = (block) => {
  emit('open-drawer', 'Edit Block', block)
}

const blockToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const confirmDelete = (block) => {
  deleteError.value = ''
  blockToDelete.value = block
}

const executeDelete = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    const res = await apiFetch(`/api/blocks/${blockToDelete.value.id}/`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      blocks.value = blocks.value.filter((b) => b.id !== blockToDelete.value.id)
      emit('update:block-count', blocks.value.length)
      blockToDelete.value = null
      if (expandedId.value === blockToDelete.value?.id) expandedId.value = null
    } else {
      const data = await res.json().catch(() => ({}))
      deleteError.value = data.detail || `Delete failed (${res.status}).`
    }
  } catch {
    deleteError.value = 'Something went wrong. Could not delete block.'
  } finally {
    isDeleting.value = false
  }
}

const AVATAR_PALETTES = [
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#FAECE7', color: '#712B13' },
  { bg: '#FBEAF0', color: '#72243E' },
  { bg: '#EAF3DE', color: '#27500A' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#F1EFE8', color: '#444441' },
]

const avatarBg = (name = '') => {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length
  return AVATAR_PALETTES[idx].bg
}

const avatarColor = (name = '') => {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length
  return AVATAR_PALETTES[idx].color
}

const initials = (name = '') => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

const occupancyPct = (block) => {
  if (!block.unit_count || block.unit_count === 0) return 0
  const occupied = block.unit_count - (block.vacant_count ?? 0)
  return Math.round((occupied / block.unit_count) * 100)
}

const occupiedCount = (block) => block.unit_count - (block.vacant_count ?? 0)

const occupancyColor = (pct) => {
  if (pct >= 70) return '#0F6E56'
  if (pct >= 40) return '#854F0B'
  return '#A32D2D'
}

const occupancyLabel = (pct) => {
  if (pct >= 70) return 'Well occupied'
  if (pct >= 40) return 'Partial'
  return 'Low occupancy'
}

const occupancyPillStyle = (pct) => {
  if (pct >= 70) return { background: '#E1F5EE', color: '#085041', borderColor: 'transparent' }
  if (pct >= 40) return { background: '#FAEEDA', color: '#633806', borderColor: 'transparent' }
  return { background: '#FCEBEB', color: '#791F1F', borderColor: 'transparent' }
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

<style scoped src="../../../styles/pages/property/blocks.css"></style>
