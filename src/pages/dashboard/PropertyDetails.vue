<template>
  <div class="property-details">
    <div class="back-crumb">
      <router-link to="/d/properties" class="back-btn">
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
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Properties</span>
      </router-link>
    </div>

    <div v-if="loading" class="header">
      <div class="name">
        <div class="skeleton skeleton-title"></div>
      </div>
    </div>

    <div v-else-if="fetchError" class="fetch-error">
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
      <button class="retry-btn" @click="fetchProperty">Retry</button>
    </div>

    <template v-else>
      <div class="header">
        <div class="name">
          <div class="property-avatar" :class="property.property_type">
            {{ initials(property.name) }}
          </div>
          <div class="name-group">
            <h2>{{ property.name }}</h2>
            <span class="type-badge" :class="property.property_type">
              {{ typeLabel(property.property_type) }}
            </span>
          </div>
        </div>

        <div class="actions">
          <div class="action-dropdown" v-click-outside="() => (isActionsOpen = false)">
            <button
              class="actions-btn"
              :class="{ open: isActionsOpen }"
              @click="isActionsOpen = !isActionsOpen"
              type="button"
            >
              <span>Actions</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="chevron"
                :class="{ rotated: isActionsOpen }"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <Transition name="dropdown">
              <div v-if="isActionsOpen" class="dropdown-menu">
                <button class="dropdown-item" @click="editProperty">
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
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  <span>Edit details</span>
                </button>
                <button class="dropdown-item danger" @click="confirmDelete">
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  <span>Delete record</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          class="tab"
          :class="{ active: activeTab === tab.name }"
          @click="activeTab = tab.name"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <div v-show="activeTab === 'overview'">
          <Overview
            :property="property"
            :block-count="blockCount"
            :unit-count="unitCount"
            :tenant-count="tenantCount"
            @change-tab="activeTab = $event"
            @open-drawer="openDrawer"
            @update:tenant-count="tenantCount = $event"
          />
        </div>
        <div v-show="activeTab === 'blocks'">
          <Blocks
            :property-id="propertyId"
            :last-submit="lastBlockSubmit"
            @open-drawer="openDrawer"
            @update:count="blockCount = $event"
          />
        </div>
        <div v-show="activeTab === 'units'">
          <Units
            :property-id="propertyId"
            :last-submit="lastUnitSubmit"
            @open-drawer="openDrawer"
            @update:count="unitCount = $event"
          />
        </div>
        <div v-show="activeTab === 'tenants'">
          <Tenants
            :property-id="propertyId"
            :last-submit="lastTenantSubmit"
            @open-drawer="openDrawer"
          />
        </div>
        <div v-show="activeTab === 'reports'">
          <Reports :property-id="propertyId" @open-drawer="openDrawer" />
        </div>
      </div>
    </template>

    <Teleport to="body">
      <Transition name="backdrop">
        <div v-if="showDeleteConfirm" class="dialog-backdrop" @click="showDeleteConfirm = false" />
      </Transition>
      <Transition name="dialog">
        <div v-if="showDeleteConfirm" class="dialog" role="alertdialog">
          <div class="dialog-icon">
            <svg
              width="24"
              height="24"
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
          <h3 class="dialog-title">Delete property?</h3>
          <p class="dialog-body">
            <strong>{{ property.name }}</strong> and all its associated units, blocks and records
            will be permanently deleted. This cannot be undone.
          </p>
          <div class="dialog-actions">
            <button class="btn-cancel" @click="showDeleteConfirm = false" :disabled="isDeleting">
              Cancel
            </button>
            <button class="btn-danger" @click="deleteProperty" :disabled="isDeleting">
              <template v-if="isDeleting">
                <span class="btn-bubbles"><span></span><span></span><span></span></span>
              </template>
              <template v-else>Delete property</template>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <DrawerPanel
      v-model="isDrawerOpen"
      :type="activeDrawerType"
      :initial-data="drawerInitialData"
      @submit="handleDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/utils/api'

import DrawerPanel from '@/views/DrawerPanel.vue'
import Overview from '@/pages/dashboard/property/Overview.vue'
import Blocks from '@/pages/dashboard/property/Blocks.vue'
import Units from '@/pages/dashboard/property/Units.vue'
import Tenants from '@/pages/dashboard/property/Tenants.vue'
import Reports from '@/pages/dashboard/property/Reports.vue'

const route = useRoute()
const router = useRouter()
const propertyId = route.params.id

const property = ref({})
const loading = ref(true)
const fetchError = ref('')

const blockCount = ref(0)
const unitCount = ref(0)
const tenantCount = ref(0)

const fetchProperty = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const res = await apiFetch(`/api/properties/${propertyId}/`)
    if (!res.ok) {
      fetchError.value =
        res.status === 404
          ? 'This property does not exist or has been deleted.'
          : `Failed to load property (${res.status}).`
      return
    }
    const data = await res.json()
    property.value = data
    blockCount.value = data.block_count ?? 0
    unitCount.value = data.unit_count ?? 0
    tenantCount.value = data.tenant_count ?? 0
  } catch {
    fetchError.value = 'Something went wrong. Check your connection and try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProperty)

const tabs = [
  { name: 'overview', label: 'Overview' },
  { name: 'blocks', label: 'Blocks' },
  { name: 'units', label: 'Units' },
  { name: 'tenants', label: 'Tenants' },
  { name: 'reports', label: 'Reports' },
]
const activeTab = ref('overview')

const isActionsOpen = ref(false)

const editProperty = () => {
  isActionsOpen.value = false
  openDrawer('Edit Property', property.value)
}

const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const confirmDelete = () => {
  isActionsOpen.value = false
  showDeleteConfirm.value = true
}

const deleteProperty = async () => {
  isDeleting.value = true
  try {
    const res = await apiFetch(`/api/properties/${propertyId}/`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      showDeleteConfirm.value = false
      router.push('/d/properties')
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.detail || `Delete failed (${res.status}).`)
    }
  } catch {
    alert('Something went wrong. Could not delete property.')
  } finally {
    isDeleting.value = false
  }
}

const isDrawerOpen = ref(false)
const activeDrawerType = ref('')
const drawerInitialData = ref(null)

const openDrawer = (type, data = null) => {
  activeDrawerType.value = type
  drawerInitialData.value = data
  isDrawerOpen.value = true
}

const lastBlockSubmit = ref(0)
const lastUnitSubmit = ref(0)
const lastTenantSubmit = ref(0)
const lastReportSubmit = ref(0)

const handleDrawerSubmit = ({ type, data } = {}) => {
  if (!type || !data) return
  if (type === 'Edit Property') {
    property.value = { ...property.value, ...data }
  }
  if (type === 'New Block' || type === 'Edit Block') {
    lastBlockSubmit.value = Date.now()
  }
  if (type === 'New Unit' || type === 'Edit Unit') {
    lastUnitSubmit.value = Date.now()
  }
  if (type === 'New Tenants' || type === 'Edit Tenant') {
    lastTenantSubmit.value = Date.now()
  }
  if (type === 'New Report' || type === 'Edit Report') {
    lastReportSubmit.value = Date.now()
  }
}

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const typeLabel = (type) =>
  ({ home: 'Home', apartment: 'Apartment Complex', office: 'Office Space' })[type] || type || ''

const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._clickOutside)
  },
}
</script>

<style scoped src="../../styles/pages/property-details.css"></style>
