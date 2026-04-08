<template>
  <div class="page">
    <aside class="left-panel">
      <div class="panel-content">
        <div class="panel-badge">Trusted by landlords across Kenya</div>

        <h1 class="panel-headline">Manage your property<br /><em>anywhere.</em></h1>

        <p class="panel-sub">
          No setup needed. No confusing forms. Just your phone and a PIN — and you're in control of
          your rentals from day one.
        </p>

        <ul class="features">
          <li>
            <span class="feat-icon">✓</span>
            <div>
              <strong>Track rent payments</strong>
              <span>Know who's paid and who hasn't, instantly</span>
            </div>
          </li>
          <li>
            <span class="feat-icon">✓</span>
            <div>
              <strong>Message your tenants</strong>
              <span>Send notices and reminders without WhatsApp chaos</span>
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
        <h2>Get started</h2>
        <p class="form-sub">Already have an account? <a href="/login">Sign in</a></p>

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

        <div class="divider"><span>or sign up with phone</span></div>

        <form @submit.prevent="handleSignUp">
          <div class="form-group">
            <label for="fullName">Full name</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              placeholder="e.g. Paul Kimani"
              required
              autocomplete="name"
              name="fullName"
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone number</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              placeholder=" e.g. 0712 345 678"
              required
              autocomplete="tel"
              name="phone"
              inputmode="tel"
            />
          </div>

          <div class="form-group pin-group">
            <label>
              4-digit PIN
              <span v-if="pinStrength === 'weak'" class="pin-warning"
                >⚠ Too easy to guess — try another</span
              >
            </label>
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
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="pin-box"
                :class="{ 'pin-box--weak': pinStrength === 'weak' && pin.every((d) => d !== '') }"
                :placeholder="pin[i] === '' ? '*' : ''"
                :aria-label="`PIN digit ${i + 1}`"
                @input="onPinInput(i, $event)"
                @keydown="onPinKeydown(i, $event)"
                @paste.prevent="onPinPaste($event)"
              />
            </div>
          </div>

          <button
            type="submit"
            class="signup-button"
            :disabled="!isFormComplete || loading || pinStrength === 'weak'"
          >
            <template v-if="loading">
              <span class="bubble" />
              <span class="bubble" />
              <span class="bubble" />
            </template>
            <template v-else>Create account</template>
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
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const phone = ref('')
const fullName = ref('')
const pin = reactive(['', '', '', ''])
const pinRefs = []

const error = ref('')
const loading = ref(false)

const WEAK_PINS = new Set([
  '0000',
  '1111',
  '2222',
  '3333',
  '4444',
  '5555',
  '6666',
  '7777',
  '8888',
  '9999',
  '1234',
  '4321',
  '1230',
  '0123',
  '1235',
  '2345',
  '3456',
  '4567',
  '5678',
  '6789',
  '9876',
  '8765',
  '7654',
  '6543',
  '5432',
  '4321',
  '0000',
  '1010',
  '2020',
  '1212',
  '0101',
  '1100',
  '0011',
  '2580',
  '1357',
  '2468',
  '1379',
])

const pinStrength = computed(() => {
  const str = pin.join('')
  if (str.length < 4) return 'incomplete'
  return WEAK_PINS.has(str) ? 'weak' : 'ok'
})

const ERROR_DURATION = 5000
let errorTimer = null

const ERRORS = {
  USER_EXISTS: 'This account already exists. Want to sign in instead?',
  PHONE_INVALID: "That phone number doesn't look right. Double-check it.",
  PHONE_REQUIRED: 'We need your phone number to create your account.',
  NAME_REQUIRED: "Don't forget your name — we'd love to know who you are!",
  PIN_INCOMPLETE: "Your PIN isn't complete yet — fill in all 4 digits.",
  PIN_WEAK: 'That PIN is too easy to guess. Please choose a different one.',
  SESSION_FAILED: "Account created, but we couldn't sign you in. Try signing in.",
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
  () =>
    fullName.value.trim().length > 0 && phone.value.trim().length > 0 && pin.every((d) => d !== ''),
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
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/sso/login/google-oauth2/`
}

function handleFacebookSSO() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/sso/login/facebook/`
}

onMounted(async () => {
  const user = await auth.fetchUser()
  if (user) router.push('/d/')
})

const handleSignUp = async () => {
  dismissError()
  loading.value = true

  if (!fullName.value.trim()) {
    showError(ERRORS.NAME_REQUIRED)
    loading.value = false
    return
  }
  if (!phone.value.trim()) {
    showError(ERRORS.PHONE_REQUIRED)
    loading.value = false
    return
  }

  const pinStr = pin.join('')
  if (pinStr.length < 4) {
    showError(ERRORS.PIN_INCOMPLETE)
    loading.value = false
    return
  }
  if (WEAK_PINS.has(pinStr)) {
    showError(ERRORS.PIN_WEAK)
    loading.value = false
    return
  }

  try {
    const response = await apiFetch('/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName.value.trim(),
        phone: phone.value.trim(),
        pin: pinStr,
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => null)
      if (response.status === 409 || errData?.phone?.some((m) => /exist/i.test(m))) {
        showError(ERRORS.USER_EXISTS)
      } else if (errData?.phone) {
        showError(ERRORS.PHONE_INVALID)
      } else {
        showError(errData?.detail || ERRORS.GENERIC)
      }
      return
    }

    const user = await auth.fetchUser()
    if (!user) {
      showError(ERRORS.SESSION_FAILED)
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

<style src="../styles/signup.css"></style>
