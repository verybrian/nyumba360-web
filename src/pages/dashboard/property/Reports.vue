<template>
  <div class="reports-container">
    <div class="reports-header">
      <div class="status-filters">
        <button
          class="filter-btn"
          :class="{ active: statusFilter === 'open' }"
          @click="statusFilter = 'open'"
        >
          Open
        </button>
        <button
          class="filter-btn"
          :class="{ active: statusFilter === 'resolved' }"
          @click="statusFilter = 'resolved'"
        >
          Resolved
        </button>
        <button
          class="filter-btn"
          :class="{ active: statusFilter === '' }"
          @click="statusFilter = ''"
        >
          All
        </button>
      </div>
      <button
        class="create-btn-primary"
        @click="$emit('open-drawer', 'New Report', { propertyId })"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
        <span>New Report</span>
      </button>
    </div>

    <div v-if="reports.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
          <path d="M9 9h1" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      </div>
      <p class="empty-title">No reports yet</p>
      <p class="empty-sub">Log incidents, maintenance issues or complaints for this property.</p>
      <button class="empty-action" @click="$emit('open-drawer', 'New Report', { propertyId })">
        <svg
          width="14"
          height="14"
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
        Add Report
      </button>
    </div>

    <div v-else-if="filteredReports.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg
          width="28"
          height="28"
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
      <p class="empty-title">No {{ formatStatus(statusFilter) }} reports</p>
      <button class="empty-action" @click="statusFilter = ''">Show all</button>
    </div>

    <div v-else class="reports-list">
      <div
        v-for="report in filteredReports"
        :key="report.id"
        class="report-card"
        :class="{ expanded: expandedId === report.id }"
      >
        <div class="report-preview" @click="toggleExpand(report.id)">
          <div class="report-header">
            <div class="report-info">
              <div class="priority-icon" :class="`priority-${report.priority_level}`">
                <span class="icon-circle">!</span>
              </div>
              <div class="report-main">
                <h3 class="report-title">{{ report.title }}</h3>
                <p class="report-meta">
                  <span class="meta-item">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {{ formatDate(report.occurred_at) }}
                  </span>
                  <span v-if="getPropertyUnit(report)" class="meta-item">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    {{ getPropertyUnit(report) }}
                  </span>
                </p>
              </div>
            </div>
            <div class="report-badges-actions">
              <div class="report-badges">
                <span class="status-badge" :class="`status-${report.status}`">{{
                  formatStatus(report.status)
                }}</span>
                <span class="priority-badge" :class="`priority-${report.priority_level}`">{{
                  formatPriority(report.priority_level)
                }}</span>
              </div>
              <button class="expand-btn" @click.stop="toggleExpand(report.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="chevron"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <p v-if="report.incident && expandedId !== report.id" class="report-incident-preview">
            {{ truncateText(report.incident, 120) }}
          </p>
        </div>

        <Transition name="expand">
          <div v-if="expandedId === report.id" class="report-details-expanded">
            <div class="detail-section" v-if="report.incident">
              <h4 class="detail-label">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Incident Description
              </h4>
              <p class="detail-content">{{ report.incident }}</p>
            </div>

            <div class="detail-grid">
              <div class="detail-section" v-if="getPropertyUnit(report)">
                <h4 class="detail-label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Location
                </h4>
                <div class="location-tag">
                  <span class="dot"></span>
                  {{ getPropertyUnit(report) }}
                </div>
              </div>

              <div
                class="detail-section"
                v-if="report.reporter || report.reporter_phone || report.relationship"
              >
                <h4 class="detail-label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Reporter
                </h4>
                <div class="reporter-details">
                  <p v-if="report.reporter" class="reporter-name">{{ report.reporter }}</p>
                  <p v-if="report.relationship" class="reporter-relation">
                    {{ report.relationship }}
                  </p>
                  <p v-if="report.reporter_phone" class="reporter-phone">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      ></path>
                    </svg>
                    {{ report.reporter_phone }}
                  </p>
                </div>
              </div>

              <div class="detail-section">
                <h4 class="detail-label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Timestamps
                </h4>
                <div class="timestamp-list">
                  <p class="timestamp-item">
                    <span class="timestamp-label">Occurred:</span>
                    <span class="timestamp-value">{{ formatFullDate(report.occurred_at) }}</span>
                  </p>
                  <p class="timestamp-item">
                    <span class="timestamp-label">Recorded:</span>
                    <span class="timestamp-value">{{ formatFullDate(report.created_at) }}</span>
                  </p>
                  <p v-if="report.updated_at !== report.created_at" class="timestamp-item">
                    <span class="timestamp-label">Updated:</span>
                    <span class="timestamp-value">{{ formatFullDate(report.updated_at) }}</span>
                  </p>
                </div>
              </div>

              <div class="detail-section" v-if="report.attachment">
                <h4 class="detail-label">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                    ></path>
                  </svg>
                  Attachment
                </h4>
                <a :href="report.attachment" target="_blank" class="attachment-link">
                  View attachment
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div class="report-actions-expanded">
              <button class="action-btn action-btn-edit" @click="editReport(report)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Edit Report
              </button>
              <button
                v-if="report.status !== 'resolved'"
                class="action-btn action-btn-resolve"
                @click="setStatus(report, 'resolved')"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Mark Resolved
              </button>
              <button
                v-else
                class="action-btn action-btn-reopen"
                @click="setStatus(report, 'open')"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 2v6h6" />
                  <path d="M21 12a9 9 0 0 0-9-9" />
                </svg>
                Reopen
              </button>
              <button class="action-btn action-btn-delete" @click="confirmDelete(report)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="reportToDelete" class="dialog-backdrop" @click="reportToDelete = null" />
    </Transition>
    <Transition name="dialog">
      <div v-if="reportToDelete" class="dialog" role="alertdialog">
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
        <h3 class="dialog-title">Delete report?</h3>
        <p class="dialog-body">
          <strong>{{ reportToDelete.title }}</strong> will be permanently deleted.
        </p>
        <div v-if="deleteError" class="dialog-error">{{ deleteError }}</div>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="reportToDelete = null" :disabled="isDeleting">
            Cancel
          </button>
          <button class="btn-danger" @click="deleteReport" :disabled="isDeleting">
            <span v-if="isDeleting" class="btn-bubbles"
              ><span></span><span></span><span></span
            ></span>
            <span v-else>Delete report</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { apiFetch } from '@/utils/api'

const emit = defineEmits(['open-drawer'])

const reports = ref([])
const properties = ref([])
const units = ref([])
const loading = ref(true)
const error = ref('')
const expandedId = ref(null)

const props = defineProps({
  propertyId: { type: String, default: null },
  lastSubmit: { type: Number, default: 0 },
})

const fetchReports = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('/api/reports/')
    if (!res.ok) {
      error.value = `Failed to load reports (${res.status}).`
      return
    }
    const data = await res.json()
    reports.value = Array.isArray(data) ? data : (data.results ?? [])

    // Fetch property and unit data for display
    await fetchPropertiesAndUnits()
  } catch {
    error.value = 'Network error. Could not load reports.'
  } finally {
    loading.value = false
  }
}

const fetchPropertiesAndUnits = async () => {
  try {
    const [propsRes, unitsRes] = await Promise.all([
      apiFetch('/api/properties/'),
      apiFetch('/api/units/'),
    ])

    if (propsRes.ok) {
      const propsData = await propsRes.json()
      properties.value = Array.isArray(propsData) ? propsData : (propsData.results ?? [])
    }

    if (unitsRes.ok) {
      const unitsData = await unitsRes.json()
      units.value = Array.isArray(unitsData) ? unitsData : (unitsData.results ?? [])
    }
  } catch (e) {
    console.error('Error fetching properties/units:', e)
  }
}

const statusFilter = ref('open')

const filteredReports = computed(() => {
  if (!statusFilter.value) return reports.value
  return reports.value.filter((r) => r.status === statusFilter.value)
})

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id
}

const getPropertyUnit = (report) => {
  if (!report.property || !report.unit) return null

  const property = properties.value.find((p) => p.id === report.property)
  const unit = units.value.find((u) => u.id === report.unit)

  if (!property || !unit) return null

  const propertyName = property.name || 'Property'
  const unitCode = unit.unit_code || unit.code || 'Unit'

  return `${propertyName} - ${unitCode}`
}

const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const editReport = (report) => {
  expandedId.value = null
  emit('open-drawer', 'Edit Report', {
    id: report.id,
    title: report.title,
    property: report.property,
    unit: report.unit,
    priority_level: report.priority_level,
    status: report.status,
    occurred_at: report.occurred_at,
    incident: report.incident ?? '',
    reporter_name: report.reporter ?? '',
    relationship: report.relationship ?? '',
    reporter_phone: report.reporter_phone ?? '',
  })
}

const setStatus = async (report, newStatus) => {
  try {
    const res = await apiFetch(`/api/reports/${report.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      const idx = reports.value.findIndex((r) => r.id === report.id)
      if (idx !== -1) reports.value[idx] = updated
    }
  } catch {}
}

const reportToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const confirmDelete = (report) => {
  expandedId.value = null
  deleteError.value = ''
  reportToDelete.value = report
}

const deleteReport = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    const res = await apiFetch(`/api/reports/${reportToDelete.value.id}/`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      reports.value = reports.value.filter((r) => r.id !== reportToDelete.value.id)
      reportToDelete.value = null
    } else {
      const data = await res.json().catch(() => ({}))
      deleteError.value = data.detail || `Delete failed (${res.status}).`
    }
  } catch {
    deleteError.value = 'Something went wrong. Could not delete report.'
  } finally {
    isDeleting.value = false
  }
}

const formatDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
  })
}

const formatFullDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatStatus = (s) => {
  if (!s) return 'All'
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const formatPriority = (p) => {
  if (!p) return '—'
  return p.charAt(0).toUpperCase() + p.slice(1)
}

watch(
  () => props.lastSubmit,
  (val) => {
    if (val) fetchReports()
  },
)

onMounted(fetchReports)
</script>

<style scoped src="../../../styles/pages/property/reports.css"></style>
