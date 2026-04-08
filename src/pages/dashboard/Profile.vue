<template>
  <div class="account-page">
    <div class="section-header">
      <h2>Account Settings</h2>
      <p class="description">Manage your account information and preferences.</p>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Profile Information</h3>
      </div>

      <div v-if="profileLoading" class="loading-row">Loading profile…</div>
      <div v-else-if="profileError" class="error-banner">{{ profileError }}</div>
      <div v-else class="info-grid">
        <div class="info-item">
          <label>Full Name</label>
          <div class="info-content">
            <span>{{ profile.name }}</span>
            <button class="btn-edit" @click="openEditModal('name')">
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
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Edit
            </button>
          </div>
        </div>

        <div class="info-item">
          <label>Email Address</label>
          <div class="info-content">
            <span>{{ profile.email }}</span>
            <button class="btn-edit" @click="openEditModal('email')">
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
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Edit
            </button>
          </div>
        </div>

        <div class="info-item">
          <label>Phone Number</label>
          <div class="info-content">
            <span>{{ profile.phone }}</span>
            <button class="btn-edit" @click="openEditModal('phone')">
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
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Edit
            </button>
          </div>
        </div>

        <div class="info-item">
          <label>Country</label>
          <div class="info-content">
            <span>{{ profile.country }}</span>
            <button class="btn-edit" @click="openEditModal('country')">
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
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Security</h3>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <label>4-digit PIN</label>
          <div class="info-content">
            <span>••••</span>
            <button class="btn-edit" @click="openEditModal('pin')">
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
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
              Change
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card danger-zone">
      <div class="card-header">
        <h3>Account Management</h3>
      </div>

      <div class="danger-actions">
        <div class="danger-item">
          <div>
            <h4>Pause Account</h4>
            <p>
              Temporarily disable your account. You can reactivate it anytime by logging back in.
            </p>
          </div>
          <button class="btn-warning" @click="showPauseModal = true">Pause Account</button>
        </div>

        <div class="danger-item">
          <div>
            <h4>Delete Account</h4>
            <p>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button class="btn-danger" @click="showDeleteModal = true">Delete Account</button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editModalTitle }}</h3>
          <button class="close-btn" @click="closeEditModal">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSave" class="modal-body">
          <div v-if="editField === 'name'" class="form-group">
            <label>Full Name</label>
            <input type="text" v-model="editValue" placeholder="Enter your full name" required />
          </div>

          <div v-if="editField === 'email'" class="form-group">
            <label>Email Address</label>
            <input type="email" v-model="editValue" placeholder="Enter your email" required />
            <p class="help-text">You may need to verify your new email address.</p>
          </div>

          <div v-if="editField === 'phone'" class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="editValue" placeholder="e.g., 0712345678" required />
          </div>

          <div v-if="editField === 'country'" class="form-group">
            <label>Country</label>
            <select v-model="editValue" required>
              <option value="">Select country...</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="South Africa">South Africa</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
            </select>
          </div>

          <div v-if="editField === 'pin'">
            <!-- Current PIN -->
            <div class="form-group pin-group">
              <label>Current PIN</label>
              <div class="pin-wrapper">
                <input
                  v-for="(_, i) in currentPin"
                  :key="'c' + i"
                  :ref="
                    (el) => {
                      if (el) currentPinRefs[i] = el
                    }
                  "
                  v-model="currentPin[i]"
                  type="password"
                  inputmode="numeric"
                  maxlength="1"
                  class="pin-box"
                  :placeholder="currentPin[i] === '' ? '*' : ''"
                  :aria-label="`Current PIN digit ${i + 1}`"
                  @input="currentPinHandlers.onInput(i, $event)"
                  @keydown="currentPinHandlers.onKeydown(i, $event)"
                  @paste.prevent="currentPinHandlers.onPaste($event)"
                />
              </div>
            </div>

            <!-- New PIN -->
            <div class="form-group pin-group">
              <label>New PIN</label>
              <div class="pin-wrapper">
                <input
                  v-for="(_, i) in newPin"
                  :key="'n' + i"
                  :ref="
                    (el) => {
                      if (el) newPinRefs[i] = el
                    }
                  "
                  v-model="newPin[i]"
                  type="password"
                  inputmode="numeric"
                  maxlength="1"
                  class="pin-box"
                  :placeholder="newPin[i] === '' ? '*' : ''"
                  :aria-label="`New PIN digit ${i + 1}`"
                  @input="newPinHandlers.onInput(i, $event)"
                  @keydown="newPinHandlers.onKeydown(i, $event)"
                  @paste.prevent="newPinHandlers.onPaste($event)"
                />
              </div>
            </div>

            <!-- Confirm PIN -->
            <div class="form-group pin-group">
              <label>Confirm New PIN</label>
              <div class="pin-wrapper">
                <input
                  v-for="(_, i) in confirmPin"
                  :key="'cf' + i"
                  :ref="
                    (el) => {
                      if (el) confirmPinRefs[i] = el
                    }
                  "
                  v-model="confirmPin[i]"
                  type="password"
                  inputmode="numeric"
                  maxlength="1"
                  class="pin-box"
                  :placeholder="confirmPin[i] === '' ? '*' : ''"
                  :aria-label="`Confirm PIN digit ${i + 1}`"
                  @input="confirmPinHandlers.onInput(i, $event)"
                  @keydown="confirmPinHandlers.onKeydown(i, $event)"
                  @paste.prevent="confirmPinHandlers.onPaste($event)"
                />
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeEditModal">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="!saving">Save Changes</span>
              <span v-else class="saving-state">
                <svg class="spinner" viewBox="0 0 24 24">
                  <circle
                    class="spinner-circle"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke-width="3"
                  ></circle>
                </svg>
                Saving...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showPauseModal" class="modal-overlay" @click.self="showPauseModal = false">
      <div class="modal modal-small">
        <div class="modal-header">
          <h3>Pause Account</h3>
          <button class="close-btn" @click="showPauseModal = false">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="warning-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="warning-icon"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              ></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <h4>Are you sure you want to pause your account?</h4>
            <p>
              Your account will be temporarily disabled. You can reactivate it anytime by logging
              back in.
            </p>
            <ul class="consequences-list">
              <li>You will be logged out immediately</li>
              <li>Your subscription billing will be paused</li>
              <li>Your data will be preserved</li>
              <li>You can reactivate by logging in again</li>
            </ul>
          </div>

          <div v-if="saveError" class="error-banner">
            <svg
              width="15"
              height="15"
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
            {{ saveError }}
          </div>

          <div v-if="actionError" class="error-banner">{{ actionError }}</div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showPauseModal = false">
              Cancel
            </button>
            <button class="btn-warning" @click="handlePauseAccount" :disabled="processing">
              <span v-if="!processing">Pause Account</span>
              <span v-else class="saving-state">
                <svg class="spinner" viewBox="0 0 24 24">
                  <circle
                    class="spinner-circle"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke-width="3"
                  ></circle>
                </svg>
                Processing...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal modal-small">
        <div class="modal-header">
          <h3>Delete Account</h3>
          <button class="close-btn" @click="showDeleteModal = false">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleDeleteAccount" class="modal-body">
          <div class="warning-content danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="danger-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h4>Permanently delete your account?</h4>
            <p>
              This action cannot be undone. All your data including properties, tenants, and
              financial records will be permanently deleted.
            </p>
            <ul class="consequences-list">
              <li>All properties and tenant data will be deleted</li>
              <li>All financial records will be lost</li>
              <li>Active subscriptions will be cancelled</li>
              <li>This action is irreversible</li>
            </ul>
          </div>

          <div class="form-group">
            <label>Type "DELETE" to confirm</label>
            <input type="text" v-model="deleteConfirmation" placeholder="Type DELETE" required />
          </div>

          <div v-if="saveError" class="error-banner">
            <svg
              width="15"
              height="15"
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
            {{ saveError }}
          </div>

          <div v-if="actionError" class="error-banner">{{ actionError }}</div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showDeleteModal = false">
              Cancel
            </button>
            <button
              type="submit"
              class="btn-danger"
              :disabled="deleteConfirmation !== 'DELETE' || processing"
            >
              <span v-if="!processing">Delete Account</span>
              <span v-else class="saving-state">
                <svg class="spinner" viewBox="0 0 24 24">
                  <circle
                    class="spinner-circle"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke-width="3"
                  ></circle>
                </svg>
                Deleting...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'

const profile = ref({ name: '', email: '', phone: '', country: '', is_active: false })
const profileLoading = ref(true)
const profileError = ref('')

const fetchProfile = async () => {
  profileLoading.value = true
  profileError.value = ''
  try {
    const res = await apiFetch('/api/user/')
    if (!res.ok) {
      profileError.value = `Failed to load profile (${res.status}).`
      return
    }
    const data = await res.json()
    profile.value = data
  } catch {
    profileError.value = 'Could not load profile. Check your connection.'
  } finally {
    profileLoading.value = false
  }
}

const showEditModal = ref(false)
const editField = ref('')
const editValue = ref('')
const saving = ref(false)
const saveError = ref('')

const currentPin = reactive(['', '', '', ''])
const newPin = reactive(['', '', '', ''])
const confirmPin = reactive(['', '', '', ''])
const currentPinRefs = []
const newPinRefs = []
const confirmPinRefs = []

function makePinHandlers(pinArr, pinRefsArr, nextGroupFirstRef = null) {
  return {
    onInput(index, event) {
      const val = event.target.value.replace(/\D/g, '')
      pinArr[index] = val ? val[val.length - 1] : ''
      if (pinArr[index] && index < 3) pinRefsArr[index + 1]?.focus()
      else if (pinArr[index] && index === 3) nextGroupFirstRef?.()?.focus()
    },
    onKeydown(index, event) {
      if (event.key === 'Backspace' && !pinArr[index] && index > 0) {
        pinRefsArr[index - 1]?.focus()
      }
    },
    onPaste(event) {
      const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
      text.split('').forEach((ch, i) => {
        pinArr[i] = ch
      })
      pinRefsArr[Math.min(text.length, 3)]?.focus()
    },
  }
}

const currentPinHandlers = makePinHandlers(currentPin, currentPinRefs, () => newPinRefs[0])
const newPinHandlers = makePinHandlers(newPin, newPinRefs, () => confirmPinRefs[0])
const confirmPinHandlers = makePinHandlers(confirmPin, confirmPinRefs)

const editModalTitle = computed(
  () =>
    ({
      name: 'Edit Name',
      email: 'Edit Email',
      phone: 'Edit Phone Number',
      country: 'Edit Country',
      pin: 'Change PIN',
    })[editField.value] || 'Edit',
)

const openEditModal = (field) => {
  editField.value = field
  saveError.value = ''
  if (field === 'pin') {
    currentPin.fill('')
    newPin.fill('')
    confirmPin.fill('')
    ;[0, 1, 2, 3].forEach((i) => {
      currentPin[i] = ''
      newPin[i] = ''
      confirmPin[i] = ''
    })
  } else {
    editValue.value = profile.value[field] ?? ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editField.value = ''
  editValue.value = ''
  saveError.value = ''
  ;[0, 1, 2, 3].forEach((i) => {
    currentPin[i] = ''
    newPin[i] = ''
    confirmPin[i] = ''
  })
}

const handleSave = async () => {
  saveError.value = ''
  saving.value = true

  try {
    if (editField.value === 'pin') {
      const current = currentPin.join('')
      const next = newPin.join('')
      const confirm = confirmPin.join('')

      if (next !== confirm) {
        saveError.value = 'New PINs do not match.'
        return
      }
      if (next.length < 4) {
        saveError.value = 'Please fill in all 4 digits.'
        return
      }

      const res = await apiFetch('/api/user/change-pin/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_pin: current, new_pin: next }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        saveError.value =
          d.detail || d.current_pin?.[0] || d.new_pin?.[0] || `Failed (${res.status}).`
        return
      }
    } else {
      const fieldMap = {
        name: 'name',
        email: 'email',
        phone: 'phone',
        country: 'country',
      }
      const res = await apiFetch(`/api/user/${profile.value.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldMap[editField.value]]: editValue.value }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        saveError.value = d.detail || Object.values(d)?.[0]?.[0] || `Failed (${res.status}).`
        return
      }
      const updated = await res.json()
      profile.value = updated
    }
    closeEditModal()
  } catch {
    saveError.value = 'Something went wrong. Please check your connection.'
  } finally {
    saving.value = false
  }
}

const showPauseModal = ref(false)
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')
const processing = ref(false)
const actionError = ref('')

const handlePauseAccount = async () => {
  processing.value = true
  actionError.value = ''
  try {
    const res = await apiFetch('/api/user/pause/', { method: 'POST' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      actionError.value = d.detail || `Failed (${res.status}).`
      return
    }
    // Log out — adjust to your auth logout method
    showPauseModal.value = false
  } catch {
    actionError.value = 'Something went wrong. Please try again.'
  } finally {
    processing.value = false
  }
}

const handleDeleteAccount = async () => {
  processing.value = true
  actionError.value = ''
  try {
    const res = await apiFetch(`/api/user/${profile.value.id}/`, { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      actionError.value = d.detail || `Failed (${res.status}).`
      return
    }
    // Redirect to logout/goodbye — adjust to your router
    showDeleteModal.value = false
  } catch {
    actionError.value = 'Something went wrong. Please try again.'
  } finally {
    processing.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped src="../../styles/pages/profile.css"></style>
