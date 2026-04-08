<template>
  <div class="properties">
    <!-- ── DESKTOP HEADER ── -->
    <div class="header header-desktop">
      <div class="title">
        <h2>Properties</h2>
        <span v-if="!loading" class="count-badge">{{ filteredProperties.length }}</span>
      </div>
      <div class="actions">
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
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search properties..." />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div class="property-filter">
          <select v-model="propertyFilter" class="filter-select">
            <option value="">All Properties</option>
            <option value="home">Homes</option>
            <option value="apartment">Apartments</option>
            <option value="office">Offices</option>
          </select>
        </div>
        <div class="create-btn">
          <button @click="openDrawer('New Property')" class="create-btn-primary">
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Property</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── MOBILE HEADER ── -->
    <div class="header header-mobile">
      <div class="header-mobile-top">
        <div class="title">
          <h2>Properties</h2>
          <span v-if="!loading" class="count-badge">{{ filteredProperties.length }}</span>
        </div>
        <button @click="openDrawer('New Property')" class="create-btn-primary">
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New</span>
        </button>
      </div>
      <div class="header-mobile-bottom">
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
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search properties..." />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <select v-model="propertyFilter" class="filter-select">
          <option value="">All</option>
          <option value="home">Homes</option>
          <option value="apartment">Apartments</option>
          <option value="office">Offices</option>
        </select>
      </div>
    </div>

    <!-- ── ERROR BANNER ── -->
    <div v-if="fetchError" class="fetch-error">
      <svg
        width="16"
        height="16"
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
      <button class="retry-btn" @click="fetchProperties">Retry</button>
    </div>

    <!-- ── SKELETON LOADING ── -->
    <div v-if="loading" class="properties-section">
      <div v-for="n in 6" :key="n" class="property-card property-card--skeleton">
        <div class="card-header">
          <div class="skeleton skeleton-avatar"></div>
          <div class="skeleton-meta">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-sub"></div>
            <div class="skeleton skeleton-sub skeleton-sub--short"></div>
          </div>
        </div>
        <div class="card-divider"></div>
        <div class="card-body">
          <div v-for="i in 4" :key="i" class="card-row">
            <div class="skeleton skeleton-label"></div>
            <div class="skeleton skeleton-value"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── EMPTY STATE ── -->
    <div v-else-if="!fetchError && filteredProperties.length === 0" class="empty-state">
      <template v-if="searchQuery || propertyFilter">
        <div class="empty-icon">
          <svg
            width="36"
            height="36"
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
        <p class="empty-sub">
          No properties match "<strong>{{ searchQuery || propertyFilter }}</strong
          >". Try a different search or filter.
        </p>
        <button class="empty-action" @click="clearFilters">Clear filters</button>
      </template>
      <template v-else>
        <div class="empty-icon">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <p class="empty-title">No properties yet</p>
        <p class="empty-sub">Get started by adding your first property.</p>
        <button class="empty-action" @click="openDrawer('New Property')">
          <svg
            width="15"
            height="15"
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
          Add Property
        </button>
      </template>
    </div>

    <!-- ── PROPERTY CARDS ── -->
    <div v-else class="properties-section">
      <router-link
        v-for="property in filteredProperties"
        :key="property.id"
        :to="`/d/properties/${property.id}`"
        class="property-card"
      >
        <div class="card-header">
          <div class="property-avatar" :class="property.property_type">
            {{ initials(property.name) }}
          </div>
          <div class="property-meta">
            <div class="property-title">
              <h3>{{ property.name }}</h3>
              <span class="type-badge" :class="property.property_type">
                {{ typeLabel(property.property_type) }}
              </span>
            </div>
            <p v-if="property.location" class="property-location">
              <svg
                class="row-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{ property.location }}
            </p>
            <p v-else class="property-location property-location--none">
              <svg
                class="row-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              No location set
            </p>
          </div>
        </div>

        <div class="card-divider"></div>

        <div class="card-body">
          <div class="card-row">
            <span class="label">Units</span>
            <span class="value">{{ property.unit_count ?? '—' }}</span>
          </div>
          <div class="card-row">
            <span class="label">Tenants</span>
            <span class="value">{{ property.tenant_count ?? '—' }}</span>
          </div>
          <div class="card-row">
            <span class="label">Last updated</span>
            <span class="value">{{ formatDate(property.updated_at) }}</span>
          </div>
          <div class="card-row">
            <span class="label">Added</span>
            <span class="value">{{ formatDate(property.created_at) }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>

  <DrawerPanel v-model="isDrawerOpen" :type="activeDrawerType" @submit="handleDrawerSubmit" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DrawerPanel from '@/views/DrawerPanel.vue'
import { apiFetch } from '@/utils/api'

const properties = ref([])
const loading = ref(true)
const fetchError = ref('')
const searchQuery = ref('')
const propertyFilter = ref('')

const isDrawerOpen = ref(false)
const activeDrawerType = ref('')

const openDrawer = (type) => {
  activeDrawerType.value = type
  isDrawerOpen.value = true
}

const handleDrawerSubmit = ({ data } = {}) => {
  if (data) properties.value.unshift(data)
}

const fetchProperties = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await apiFetch('/api/properties/')
    if (!res.ok) {
      fetchError.value = `Failed to load properties (${res.status}). Please try again.`
      return
    }
    const data = await res.json()
    properties.value = Array.isArray(data) ? data : (data.results ?? [])
  } catch (err) {
    fetchError.value = 'Something went wrong. Check your connection and try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProperties)

const filteredProperties = computed(() => {
  let list = properties.value

  if (propertyFilter.value) {
    list = list.filter((p) => p.property_type === propertyFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || (p.location && p.location.toLowerCase().includes(q)),
    )
  }

  return list
})

const initials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const typeLabel = (type) => {
  const map = { home: 'Home', apartment: 'Apartment', office: 'Office' }
  return map[type] || type
}

const formatDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

const clearFilters = () => {
  searchQuery.value = ''
  propertyFilter.value = ''
}
</script>

<style scoped src="../../styles/pages/properties.css"></style>
