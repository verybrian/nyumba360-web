<template>
  <nav :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <!-- Logo -->
      <a href="/" class="logo">Nyumba<span>360</span></a>

      <!-- Desktop links -->
      <ul class="nav-links">
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#listings">Find a Home</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><router-link to="/media">Media</router-link></li>
      </ul>

      <!-- Desktop CTA -->
      <div class="nav-actions">
        <template v-if="authStore.user">
          <router-link to="/dashboard" class="btn-dashboard">
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
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </router-link>
          <div class="nav-avatar-wrap" @click="toggleUserMenu" ref="avatarRef">
            <div class="nav-avatar">{{ initials }}</div>
            <svg
              class="avatar-chevron"
              :class="{ open: userMenuOpen }"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <!-- User dropdown -->
            <transition name="dropdown">
              <div class="user-dropdown" v-if="userMenuOpen">
                <div class="dropdown-header">
                  <div class="dropdown-avatar">{{ initials }}</div>
                  <div>
                    <div class="dropdown-name">
                      {{ authStore.user.name || authStore.user.username }}
                    </div>
                    <div class="dropdown-email">{{ authStore.user.email }}</div>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <router-link to="/dashboard" class="dropdown-item" @click="userMenuOpen = false">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  Dashboard
                </router-link>
                <router-link to="/settings" class="dropdown-item" @click="userMenuOpen = false">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path
                      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                    />
                  </svg>
                  Settings
                </router-link>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item danger" @click="handleLogout">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </transition>
          </div>
        </template>
        <template v-else>
          <!-- Logged out -->
          <router-link to="/login" class="btn-login">Sign In</router-link>
          <router-link to="/register" class="btn-nav">Get Started</router-link>
        </template>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="hamburger"
        @click="mobileOpen = !mobileOpen"
        :class="{ active: mobileOpen }"
        aria-label="Toggle menu"
      >
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="mobile-menu">
      <div class="mobile-menu" v-if="mobileOpen">
        <ul class="mobile-links">
          <li><a href="#how-it-works" @click="mobileOpen = false">How It Works</a></li>
          <li><a href="#listings" @click="mobileOpen = false">Find a Home</a></li>
          <li><a href="#pricing" @click="mobileOpen = false">Pricing</a></li>
          <li><a href="#contact" @click="mobileOpen = false">Contact</a></li>
          <li><router-link to="/media" @click="mobileOpen = false">Media</router-link></li>
        </ul>
        <div class="mobile-actions">
          <template v-if="authStore.user">
            <div class="mobile-user-info">
              <div class="mobile-avatar">{{ initials }}</div>
              <div>
                <div class="mobile-user-name">
                  {{ authStore.user.name || authStore.user.username }}
                </div>
                <div class="mobile-user-email">{{ authStore.user.email }}</div>
              </div>
            </div>
            <router-link to="/dashboard" class="mobile-btn-primary" @click="mobileOpen = false">
              Dashboard
            </router-link>
            <router-link to="/settings" class="mobile-btn-secondary" @click="mobileOpen = false">
              Settings
            </router-link>
            <button class="mobile-btn-danger" @click="handleLogout">Sign Out</button>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-btn-secondary" @click="mobileOpen = false"
              >Sign In</router-link
            >
            <router-link to="/register" class="mobile-btn-primary" @click="mobileOpen = false"
              >Get Started</router-link
            >
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isScrolled = ref(false)
const mobileOpen = ref(false)
const userMenuOpen = ref(false)
const avatarRef = ref(null)

// Computed
const firstName = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ')[0]
})

const initials = computed(() => {
  const name = authStore.user?.name || '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

// Scroll detection
function onScroll() {
  isScrolled.value = window.scrollY > 12
}

// Close user dropdown when clicking outside
function onClickOutside(e) {
  if (avatarRef.value && !avatarRef.value.contains(e.target)) {
    userMenuOpen.value = false
  }
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

async function handleLogout() {
  userMenuOpen.value = false
  mobileOpen.value = false
  authStore.clearUser()
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
  authStore.fetchUser()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped src="../styles/app-navbar.css"></style>
