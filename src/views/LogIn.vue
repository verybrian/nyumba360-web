<template>
  <div class="page">
    <aside class="left-panel">
      <div class="panel-content">
        <div class="panel-badge">Trusted by landlords across Kenya</div>

        <h1 class="panel-headline">Welcome back.<br /><em>You're home.</em></h1>

        <p class="panel-sub">
          Everything you left is right where you put it. Pick up where you left off.
        </p>

        <ul class="features">
          <li>
            <span class="feat-icon">✓</span>
            <div>
              <strong>Your dashboard, ready</strong>
              <span>Rent status, notices and messages waiting for you</span>
            </div>
          </li>
          <li>
            <span class="feat-icon">✓</span>
            <div>
              <strong>Secure with your PIN</strong>
              <span>Only you can access your account — no one else</span>
            </div>
          </li>
          <li>
            <span class="feat-icon">✓</span>
            <div>
              <strong>Works on any phone</strong>
              <span>No app download required — runs in your browser</span>
            </div>
          </li>
        </ul>

        <figure class="testimonial">
          <blockquote>
            "I used to spend my weekends chasing rent. Now I open this app on Monday morning and
            everything is already there."
          </blockquote>
          <figcaption>
            <div class="avatar">DM</div>
            <div>
              <strong>David Mwathi</strong>
              <span>Landlord, Nakuru · 12 units</span>
            </div>
          </figcaption>
        </figure>
      </div>
    </aside>

    <main class="right-panel">
      <Transition name="banner">
        <div v-if="error" class="error-banner" role="alert" aria-live="assertive">
          <span class="error-text">{{ error }}</span>
          <button class="error-close" @click="dismissError" aria-label="Dismiss">
            <span class="error-icon">✕</span>
          </button>
          <div class="error-timeline" :style="{ animationDuration: ERROR_DURATION + 'ms' }" />
        </div>
      </Transition>

      <div class="form-shell">
        <h2>Sign in.</h2>
        <p class="form-sub">Don't have an account? <a href="/signup">Create one</a></p>

        <div class="sso-group">
          <button type="button" class="sso-button facebook-btn" @click="handleFacebookSSO">
            <img
              src="https://img.icons8.com/color/48/facebook-new.png"
              alt="Facebook"
              width="18"
              height="18"
            />
            <span>Facebook</span>
          </button>
          <button type="button" class="sso-button google-btn" @click="handleGoogleSSO">
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google"
              width="18"
              height="18"
            />
            <span>Google</span>
          </button>
        </div>

        <div class="divider"><span>or sign in with phone</span></div>

        <form @submit.prevent="handleSignIn">
          <div class="form-group">
            <label for="identifier">Email or phone number</label>
            <input
              id="identifier"
              v-model="identifier"
              type="text"
              placeholder="you@email.com"
              required
              autocomplete="username"
              name="identifier"
              inputmode="text"
            />
          </div>

          <div class="form-group pin-group">
            <label>4-digit PIN</label>
            <div class="pin-wrapper">
              <input
                v-for="(_, i) in pin"
                :key="i"
                :ref="
                  (el) => {
                    if (el) pinRefs[i] = el
                  }
                "
                v-model="pin[i]"
                type="password"
                inputmode="numeric"
                maxlength="1"
                class="pin-box"
                :placeholder="pin[i] === '' ? '*' : ''"
                :aria-label="`PIN digit ${i + 1}`"
                @input="onPinInput(i, $event)"
                @keydown="onPinKeydown(i, $event)"
                @paste.prevent="onPinPaste($event)"
              />
            </div>
          </div>

          <div class="forgot-row">
            <a href="/reset-password">Forgot your PIN?</a>
          </div>

          <button type="submit" class="signin-button" :disabled="!isFormComplete || loading">
            <template v-if="loading">
              <span class="bubble" />
              <span class="bubble" />
              <span class="bubble" />
            </template>
            <template v-else>Sign in</template>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/utils/api'

const router = useRouter()

const identifier = ref('')
const pin = reactive(['', '', '', ''])
const pinRefs = []
const error = ref('')
const loading = ref(false)

const ERROR_DURATION = 5000
let errorTimer = null

const ERRORS = {
  IDENTIFIER_REQUIRED: 'Please enter your phone number or email.',
  PIN_INCOMPLETE: 'Fill in all 4 digits of your PIN to continue.',
  INVALID_CREDENTIALS: 'User credentials do not match. Give it another try.',
  NETWORK: 'No connection? Check your internet and try again.',
  GENERIC: 'Something went wrong on our end. Give it another try.',
}

function showError(msg) {
  error.value = msg
  clearTimeout(errorTimer)
  errorTimer = setTimeout(dismissError, ERROR_DURATION)
}

function dismissError() {
  error.value = ''
  clearTimeout(errorTimer)
}

onUnmounted(() => clearTimeout(errorTimer))

const isFormComplete = computed(
  () => identifier.value.trim().length > 0 && pin.every((d) => d !== ''),
)

// PIN handlers
function onPinInput(index, event) {
  const val = event.target.value.replace(/\D/g, '')
  pin[index] = val ? val[val.length - 1] : ''
  if (pin[index] && index < 3) pinRefs[index + 1]?.focus()
}

function onPinKeydown(index, event) {
  if (event.key === 'Backspace' && !pin[index] && index > 0) {
    pinRefs[index - 1]?.focus()
  }
}

function onPinPaste(event) {
  const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
  text.split('').forEach((ch, i) => {
    pin[i] = ch
  })
  pinRefs[Math.min(text.length, 3)]?.focus()
}

// SSO
function handleGoogleSSO() {
  console.log('Google SSO triggered')
  // TODO: window.location.href = '/auth/google'
}

function handleFacebookSSO() {
  console.log('Facebook SSO triggered')
  // TODO: window.location.href = '/auth/facebook'
}

onMounted(async () => {
  const res = await apiFetch('/api/me/')
  if (res.ok) router.push('/d/')
})

const handleSignIn = async () => {
  dismissError()
  loading.value = true

  const raw = identifier.value.trim()
  if (!raw) {
    showError(ERRORS.IDENTIFIER_REQUIRED)
    loading.value = false
    return
  }

  const pinStr = pin.join('')
  if (pinStr.length < 4) {
    showError(ERRORS.PIN_INCOMPLETE)
    loading.value = false
    return
  }

  try {
    const response = await apiFetch('/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: raw, pin: pinStr }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => null)
      if (errData?.identifier) {
        showError(errData.identifier)
      } else if (errData?.pin) {
        showError(ERRORS.INVALID_CREDENTIALS)
      } else {
        showError(errData?.detail || ERRORS.GENERIC)
      }
      return
    }

    router.push('/d/')
  } catch {
    showError(ERRORS.NETWORK)
  } finally {
    loading.value = false
  }
}
</script>

<style src="../styles/login.css"></style>
