<template>
  <div class="reset-container">
    <div class="reset-card">
      <h3>Reset password</h3>

      <form @submit.prevent="handlereset">
        <div class="form-group input-icon-wrapper">
          <img
            class="input-icon"
            src="https://img.icons8.com/ios-glyphs/30/000000/user.png"
            alt="user"
          />

          <input
            id="email_or_phone"
            v-model="email"
            type="text"
            placeholder="Email or Phone"
            required
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="reset-button" :disabled="loading">
          {{ loading ? 'Processing...' : 'Continue' }}
        </button>
      </form>

      <div class="log-in">
        <label>
          <span>Remember your password?</span>
        </label>
        <a href="/login">Log In</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')

const error = ref('')
const loading = ref(false)

const handlereset = async () => {
  error.value = ''
  loading.value = true

  setTimeout(() => {
    // TODO: Implement password reset
    sessionStorage.setItem('isAuthenticated', 'true')
    sessionStorage.setItem('userPhone', username.value)

    router.push('/d/')
    loading.value = false
  }, 1000)
}
</script>

<style scoped src="../styles/password-reset.css"></style>
