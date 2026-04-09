<template>
  <main class="landing">
    <template v-if="loading">
      <div class="skeleton" />
    </template>

    <template v-else-if="authStore.user">
      <RouterLink to="/d/" class="btn">Go to Dashboard</RouterLink>
    </template>

    <template v-else>
      <RouterLink to="/signup" class="btn">Sign up</RouterLink>
      <RouterLink to="/login" class="btn btn-outline">Log in</RouterLink>
    </template>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const loading = ref(true)

onMounted(async () => {
  await authStore.fetchUser()
  loading.value = false
})
</script>

<style scoped>
.landing {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn {
  padding: 0.65rem 1.5rem;
  background: #1b414b;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.95rem;
}

.btn-outline {
  background: transparent;
  color: #111;
  border: 1px solid #111;
}

.skeleton {
  width: 140px;
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
