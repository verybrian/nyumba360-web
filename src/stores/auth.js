import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  async function fetchUser() {
    try {
      const res = await apiFetch('/api/me/')
      if (!res.ok) {
        user.value = null
        return null
      }
      user.value = await res.json()
      return user.value
    } catch {
      user.value = null
      return null
    }
  }

  function clearUser() {
    user.value = null
  }

  return { user, fetchUser, clearUser }
})
