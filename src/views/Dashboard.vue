<template>
  <div class="dashboard-layout">
    <aside
      class="sidebar"
      :class="{
        collapsed: isSidebarCollapsed && !isSidebarOverlay,
        overlay: isSidebarOverlay,
        open: isSidebarOverlay && !isSidebarCollapsed,
        'is-animating': isAnimating,
      }"
    >
      <div class="logo">
        <router-link to="/" class="logo-text">
          <span class="logo-nyumba">Nyumba</span><span class="logo-360">360</span>
        </router-link>
      </div>

      <nav class="nav-links">
        <p class="menu-label" v-if="!isSidebarCollapsed">Main Menu</p>
        <router-link
          v-for="link in mainMenu"
          :key="link.id"
          :to="link.id === '' ? '/d/' : `/d/${link.id}`"
          class="nav-link"
          :class="{ active: activeLink(link.id) }"
        >
          <component :is="link.icon" class="nav-icon" />
          <span>{{ link.label }}</span>
        </router-link>

        <div class="menu-spacer"></div>

        <p class="menu-label" v-if="!isSidebarCollapsed">System</p>
        <template v-for="link in systemMenu" :key="link.id">
          <div
            v-if="link.id === 'logout'"
            class="nav-link"
            role="button"
            tabindex="0"
            @click="signOut"
            @keyup.enter="signOut"
            style="cursor: pointer"
          >
            <component :is="link.icon" class="nav-icon" />
            <span>{{ link.label }}</span>
          </div>

          <router-link
            v-else
            :to="`/d/${link.id}`"
            class="nav-link"
            :class="{ active: route.path === `/d/${link.id}` }"
          >
            <component :is="link.icon" class="nav-icon" />
            <span>{{ link.label }}</span>
          </router-link>
        </template>
      </nav>
    </aside>

    <div
      v-if="isSidebarOverlay && !isSidebarCollapsed"
      class="sidebar-backdrop"
      @click="toggleSidebar"
    ></div>

    <div class="main-content">
      <header class="navbar">
        <button class="hamburger-btn" @click="toggleSidebar" title="Toggle Menu">
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 7.75C5.08579 7.75 4.75 8.08579 4.75 8.5C4.75 8.91421 5.08579 9.25 5.5 9.25V7.75ZM19.5 9.25C19.9142 9.25 20.25 8.91421 20.25 8.5C20.25 8.08579 19.9142 7.75 19.5 7.75V9.25ZM5.5 11.75C5.08579 11.75 4.75 12.0858 4.75 12.5C4.75 12.9142 5.08579 13.25 5.5 13.25V11.75ZM17.5 13.25C17.9142 13.25 18.25 12.9142 18.25 12.5C18.25 12.0858 17.9142 11.75 17.5 11.75V13.25ZM5.5 15.75C5.08579 15.75 4.75 16.0858 4.75 16.5C4.75 16.9142 5.08579 17.25 5.5 17.25V15.75ZM12.5 17.25C12.9142 17.25 13.25 16.9142 13.25 16.5C13.25 16.0858 12.9142 15.75 12.5 15.75V17.25ZM5.5 9.25H19.5V7.75H5.5V9.25ZM5.5 13.25H17.5V11.75H5.5V13.25ZM5.5 17.25H12.5V15.75H5.5V17.25Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div class="navbar-dropdowns" v-click-outside="closeAllDropdowns">
          <div class="create-dropdown">
            <button
              @click="toggleCreate"
              class="icon-btn create-icon-btn"
              :class="{ open: isCreateOpen }"
              title="Create"
            >
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            <div v-if="isCreateOpen" class="dropdown-menu">
              <button
                v-for="option in createOptions"
                :key="option.label"
                @click="handleCreate(option.label)"
                class="dropdown-item"
              >
                <span class="dropdown-icon" v-html="option.icon"></span>
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="create-dropdown" v-click-outside="() => (isNotifOpen = false)">
            <button
              class="icon-btn notification-btn"
              :class="{ open: isNotifOpen }"
              @click="toggleNotif"
              title="Notifications"
            >
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
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
              <!-- <span class="notification-dot"></span> -->
            </button>

            <div v-if="isNotifOpen" class="dropdown-menu">
              <div class="dropdown-header">
                <span>Notifications</span>
              </div>
              <div class="dropdown-empty">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <p>No notifications yet</p>
              </div>
            </div>
          </div>

          <button
            class="icon-btn theme-btn"
            @click="toggleTheme"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg
              v-if="isDark"
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
              <!-- Sun icon -->
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <!-- Moon icon -->
              <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .34.02.67.05 1A7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <div class="create-dropdown" v-click-outside="() => (isProfileOpen = false)">
            <button
              class="icon-btn profile-btn"
              :class="{ open: isProfileOpen }"
              @click="toggleProfile"
              title="Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="9" r="3" />
                <path d="M7 18c1.5-2 8.5-2 10 0" />
              </svg>
            </button>

            <div v-if="isProfileOpen" class="dropdown-menu">
              <div class="dropdown-header">
                <span>{{ auth.user?.name || 'Account' }}</span>
              </div>
              <button class="dropdown-item" @click="goToProfile">
                <span class="dropdown-icon">
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
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="9" r="3" />
                    <path d="M7 18c1.5-2 8.5-2 10 0" />
                  </svg>
                </span>
                View profile
              </button>
              <button class="dropdown-item danger-item" @click="signOut">
                <span class="dropdown-icon">
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
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </span>
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="content">
        <div class="content-inner">
          <router-view @open-drawer="handleCreate" :last-submit="lastSubmit" />
        </div>
      </main>
    </div>
  </div>

  <DrawerPanel
    v-model="isDrawerOpen"
    :type="activeDrawerType"
    :initial-data="activeDrawerData"
    @submit="lastSubmit = Date.now()"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { apiFetch } from '@/utils/api'
import { useAuthStore } from '@/stores/auth'

import DrawerPanel from '@/views/DrawerPanel.vue'

import NavIconHome from '@/components/icons/NavIconHome.vue'
import NavIconProperty from '@/components/icons/NavIconProperty.vue'
import NavIconUsers from '@/components/icons/NavIconUsers.vue'
import NavIconFinances from '@/components/icons/NavIconFinances.vue'
import NavIconReports from '@/components/icons/NavIconReports.vue'
import NavIconBilling from '@/components/icons/NavIconBilling.vue'
import NavIconUser from '@/components/icons/NavIconUser.vue'
import NavIconSettings from '@/components/icons/NavIconSettings.vue'
import NavIconSupport from '@/components/icons/NavIconSupport.vue'
import NavIconLogout from '@/components/icons/NavIconLogout.vue'

const router = useRouter()
const route = useRoute()

const auth = useAuthStore()
const isCreateOpen = ref(false)
const isNotifOpen = ref(false)
const isProfileOpen = ref(false)
const isSidebarCollapsed = ref(false)
const isSidebarOverlay = ref(false)
const isAnimating = ref(false)

const isDrawerOpen = ref(false)
const activeDrawerType = ref('')
const activeDrawerData = ref(null)
const lastSubmit = ref(0)

const isDark = ref(false)

const toggleCreate = () => {
  isCreateOpen.value = !isCreateOpen.value
  isNotifOpen.value = false
  isProfileOpen.value = false
}

const toggleNotif = () => {
  isNotifOpen.value = !isNotifOpen.value
  isCreateOpen.value = false
  isProfileOpen.value = false
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
  isCreateOpen.value = false
  isNotifOpen.value = false
}

const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  isDark.value = theme === 'dark'
  localStorage.setItem('theme', theme)
}

const toggleTheme = () => {
  applyTheme(isDark.value ? 'light' : 'dark')
}

const goToProfile = () => {
  router.push('/d/profile')
  isProfileOpen.value = false
}

const closeAllDropdowns = () => {
  isCreateOpen.value = false
  isNotifOpen.value = false
  isProfileOpen.value = false
}

const mainMenu = [
  { id: '', label: 'Dashboard', icon: NavIconHome },
  { id: 'properties', label: 'Properties', icon: NavIconProperty },
  { id: 'tenants', label: 'Tenants', icon: NavIconUsers },
  { id: 'finances', label: 'Finances', icon: NavIconFinances },
  { id: 'reports', label: 'Reports', icon: NavIconReports },
  // { id: 'billing', label: 'Billing & Invoices', icon: NavIconBilling },
]

const systemMenu = [
  { id: 'profile', label: 'Account', icon: NavIconUser },
  // { id: 'settings', label: 'Settings', icon: NavIconSettings },
  { id: 'support', label: 'Help & Support', icon: NavIconSupport },
  { id: 'logout', label: 'Log Out', icon: NavIconLogout },
]

const activeLink = (linkId) => {
  const segment = route.path.split('/')[2] || ''
  return segment === linkId
}

const createOptions = [
  {
    label: 'New Property',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-6 9 6"/>
        <path d="M9 22V12h6v10"/>
        <path d="M21 22H3"/>
      </svg>`,
  },
  {
    label: 'New Unit',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>`,
  },
  {
    label: 'New Tenant',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>`,
  },
  {
    label: 'New Payment',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 12h-6a2 2 0 0 0 0 4h6v-4Z"/>
        <path d="M2 14V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H6a4 4 0 0 0-4 4Z"/>
      </svg>`,
  },
  {
    label: 'New Expense',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2V2Z"/>
        <path d="M8 6h8"/>
        <path d="M8 10h8"/>
        <path d="M8 14h5"/>
      </svg>`,
  },
  {
    label: 'New Report',
    icon: `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>`,
  },
]

onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  if (saved !== null) {
    isSidebarCollapsed.value = saved === 'true'
  }
  handleResize()
  window.addEventListener('resize', handleResize)
})

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    applyTheme(savedTheme)
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark ? 'dark' : 'light')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const toggleSidebar = () => {
  isAnimating.value = true
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  if (!isSidebarOverlay.value) {
    localStorage.setItem('sidebar-collapsed', String(isSidebarCollapsed.value))
  }
  setTimeout(() => {
    isAnimating.value = false
  }, 250)
}

const handleResize = () => {
  const width = window.innerWidth
  if (width <= 1280) {
    isSidebarOverlay.value = true
    isSidebarCollapsed.value = true
  } else {
    isSidebarOverlay.value = false
  }
}

const handleCreate = (option, data = null) => {
  isCreateOpen.value = false
  activeDrawerType.value = option
  activeDrawerData.value = data
  isDrawerOpen.value = true
}

const signOut = async () => {
  try {
    await apiFetch('/api/logout/', { method: 'POST' })
  } catch (err) {
    console.error('Logout failed', err)
  } finally {
    auth.clearUser()
    router.replace('/login')
  }
}
</script>

<style scoped src="../styles/dashboard.css"></style>
