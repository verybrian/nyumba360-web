<template>
  <div class="overview">
    <div class="content-grid">
      <div class="left-column">
        <div class="section">
          <h2 class="section-title">Property Information</h2>

          <div class="info-row">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" />
                <path d="M16 6h.01" />
                <path d="M12 6h.01" />
                <path d="M12 10h.01" />
                <path d="M12 14h.01" />
                <path d="M16 10h.01" />
                <path d="M16 14h.01" />
                <path d="M8 10h.01" />
                <path d="M8 14h.01" />
              </svg>
            </div>
            <div class="info-content">
              <div class="info-type">{{ typeLabel(property.property_type) }}</div>
              <div class="info-subtype">Property Type</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div class="info-content">
              <template v-if="property.location">
                <div class="address">{{ property.location }}</div>
                <div class="address" style="color: #9ca3af">Kenya</div>
              </template>
              <div v-else class="address address--none">No location set</div>
            </div>
          </div>

          <div v-if="property.notes" class="info-row">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
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
            <div class="info-content">
              <div class="info-type">Notes</div>
              <div class="info-subtype">{{ property.notes }}</div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <div class="info-content">
              <div class="info-type">{{ formatDate(property.created_at) }}</div>
              <div class="info-subtype">Date Added</div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blocks">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ blockCount ?? '—' }}</div>
              <div class="stat-label">Blocks</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon units">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
                <path d="M3 11h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11Z" />
                <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ unitCount ?? '—' }}</div>
              <div class="stat-label">Units</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon tenants">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
            <div class="stat-content">
              <div class="stat-value">{{ tenantCount ?? '—' }}</div>
              <div class="stat-label">Tenants</div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Tenants</h2>
            <button
              class="add-button"
              title="Add tenant"
              @click="$emit('open-drawer', 'New Tenant')"
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
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>

          <template v-if="loading">
            <div class="tenant-card" v-for="n in 3" :key="n">
              <div class="skeleton skeleton-avatar"></div>
              <div
                style="flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 4px"
              >
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line skeleton-line--short"></div>
              </div>
            </div>
          </template>

          <div v-else-if="fetchError" class="inline-error">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ fetchError }}
            <button class="retry-btn" @click="fetchTenants">Retry</button>
          </div>

          <div v-else-if="tenants.length === 0" class="tenants-empty">
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p>No tenants yet</p>
          </div>

          <div v-else class="tenants-list">
            <div v-for="tenant in tenants.slice(0, 5)" :key="tenant.id" class="tenant-card">
              <div class="tenant-icon">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div class="tenant-info">
                <div class="tenant-name">{{ tenant.name }}</div>
                <div class="tenant-phone">{{ tenant.phone_number || '—' }}</div>
              </div>
              <div
                class="tenant-status"
                :class="tenant.is_active ? 'status-active' : 'status-inactive'"
              >
                {{ tenant.is_active ? 'Active' : 'Moved out' }}
              </div>
            </div>
          </div>

          <button
            v-if="tenants.length > 0"
            class="view-all-link"
            @click="$emit('change-tab', 'tenants')"
          >
            View all tenants
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
              style="display: inline-block; vertical-align: middle; margin-left: 4px"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'

const props = defineProps({
  property: { type: Object, required: true },
  blockCount: Number,
  unitCount: Number,
  tenantCount: Number,
})

const emit = defineEmits(['change-tab', 'open-drawer', 'update:tenant-count'])

const tenants = ref([])
const loading = ref(true)
const fetchError = ref('')

const fetchTenants = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await apiFetch(`/api/properties/${props.property.id}/tenants/`)
    if (!res.ok) {
      fetchError.value = `Failed to load tenants (${res.status}).`
      return
    }
    tenants.value = await res.json()
    emit('update:tenant-count', tenants.value.length)
  } catch {
    fetchError.value = 'Could not load tenants. Check your connection.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTenants)

const typeLabel = (type) =>
  ({ home: 'Home', apartment: 'Apartment Complex', office: 'Office Space' })[type] || type || '—'

const formatDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  return isNaN(d)
    ? val
    : d.toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped src="../../../styles/pages/property/overview.css"></style>
