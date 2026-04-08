<template>
  <div class="paybill-integration">
    <div class="section-header">
      <h2>M-Pesa Paybill Integration</h2>
      <p class="description">
        Connect your M-Pesa Paybill to automatically receive and track rent payments from your
        tenants.
      </p>
    </div>

    <!-- Help Banner -->
    <div class="help-banner">
      <div class="help-content">
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
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <div>
          <strong>Need help with integration?</strong>
          <p>Contact our support team for assistance with setting up your M-Pesa Paybill.</p>
        </div>
      </div>
      <div class="help-actions">
        <a href="tel:+254103016064" class="help-btn">
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
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            ></path>
          </svg>
          Call Support
        </a>
        <a href="https://wa.me/254103016064" target="_blank" class="help-btn whatsapp">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>

    <!-- Configuration Form -->
    <form @submit.prevent="handleSave" class="config-form">
      <!-- Paybill Number -->
      <div class="form-group">
        <label for="paybill-number">
          Paybill Number
          <span class="required">*</span>
        </label>
        <input
          id="paybill-number"
          v-model="formData.paybillNumber"
          type="text"
          placeholder="e.g., 123456"
          required
          maxlength="10"
        />
        <p class="help-text">Your M-Pesa Paybill business number</p>
      </div>

      <!-- Business Name -->
      <div class="form-group">
        <label for="business-name">
          Business Name / Display Name
          <span class="required">*</span>
        </label>
        <input
          id="business-name"
          v-model="formData.businessName"
          type="text"
          placeholder="e.g., ABC Properties Ltd"
          required
        />
        <p class="help-text">The name that appears on M-Pesa transactions</p>
      </div>

      <!-- Consumer Key -->
      <div class="form-group">
        <label for="consumer-key">
          Consumer Key
          <span class="required">*</span>
        </label>
        <input
          id="consumer-key"
          v-model="formData.consumerKey"
          type="text"
          placeholder="Enter your consumer key"
          required
        />
        <p class="help-text">
          Get this from your
          <a
            href="https://developer.safaricom.co.ke/"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >
            M-Pesa Developer Portal
          </a>
        </p>
      </div>

      <!-- Consumer Secret -->
      <div class="form-group">
        <label for="consumer-secret">
          Consumer Secret
          <span class="required">*</span>
        </label>
        <div class="input-with-toggle">
          <input
            id="consumer-secret"
            v-model="formData.consumerSecret"
            :type="showSecret ? 'text' : 'password'"
            placeholder="Enter your consumer secret"
            required
          />
          <button type="button" class="toggle-visibility" @click="showSecret = !showSecret">
            <svg
              v-if="!showSecret"
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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg
              v-else
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
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              ></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        </div>
        <p class="help-text">Keep this secure and never share it publicly</p>
      </div>

      <!-- Passkey -->
      <div class="form-group">
        <label for="passkey">
          Passkey
          <span class="required">*</span>
        </label>
        <div class="input-with-toggle">
          <input
            id="passkey"
            v-model="formData.passkey"
            :type="showPasskey ? 'text' : 'password'"
            placeholder="Enter your passkey"
            required
          />
          <button type="button" class="toggle-visibility" @click="showPasskey = !showPasskey">
            <svg
              v-if="!showPasskey"
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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg
              v-else
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
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
              ></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>
        </div>
        <p class="help-text">Your M-Pesa API passkey for secure transactions</p>
      </div>

      <!-- Callback URL -->
      <div class="form-group callback-section">
        <label for="callback-url">Callback URL</label>
        <div class="callback-container">
          <input
            id="callback-url"
            :value="callbackUrl"
            type="text"
            readonly
            class="callback-input"
          />
          <button type="button" class="copy-btn" @click="copyCallbackUrl">
            <svg
              v-if="!copied"
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
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg
              v-else
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
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <div class="callback-instructions">
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
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <div>
            <strong>Important:</strong> Copy this URL and paste it in your
            <a
              href="https://developer.safaricom.co.ke/"
              target="_blank"
              rel="noopener noreferrer"
              class="link"
            >
              M-Pesa Developer Portal
            </a>
            under the Callback URL section for your app. This allows us to receive payment
            notifications.
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="handleCancel">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="saving">
          <span v-if="!saving">Save Configuration</span>
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
</template>

<script setup>
import { ref, computed } from 'vue'

const formData = ref({
  paybillNumber: '',
  businessName: '',
  consumerKey: '',
  consumerSecret: '',
  passkey: '',
})

const showSecret = ref(false)
const showPasskey = ref(false)
const copied = ref(false)
const saving = ref(false)

const callbackUrl = computed(() => {
  return `https://api.wajuaji.digital/v1/mpesa/callback/`
})

const copyCallbackUrl = async () => {
  try {
    await navigator.clipboard.writeText(callbackUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    // Here you would make an API call to save the configuration
    console.log('Saving configuration:', formData.value)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert('Configuration saved successfully!')
  } catch (error) {
    console.error('Error saving configuration:', error)
    alert('Failed to save configuration. Please try again.')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    formData.value = {
      paybillNumber: '',
      businessName: '',
      consumerKey: '',
      consumerSecret: '',
      passkey: '',
    }
  }
}
</script>

<style scoped src="../../../styles/pages/settings/paybill.css"></style>
