<template>
  <div class="sms-configuration">
    <div class="section-header">
      <h2>SMS Configuration</h2>
      <p class="description">
        Manage automated SMS notifications for your tenants. Customize message templates and control
        when notifications are sent.
      </p>
    </div>

    <!-- Pricing Notice -->
    <div class="pricing-notice">
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
        <strong>SMS Pricing:</strong> SMS messages are charged per event at KSh 2.00 per message.
        This is not included in your monthly subscription rate. You will be billed based on actual
        SMS usage.
      </div>
    </div>

    <!-- Bulk SMS Section -->
    <div class="card bulk-sms-card">
      <div class="card-header">
        <div>
          <h3>Send Bulk SMS</h3>
          <p class="subtitle">Send immediate or scheduled messages to selected tenants</p>
        </div>
        <button class="btn-primary" @click="showBulkSmsModal = true">
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Compose Message
        </button>
      </div>
    </div>

    <!-- Automated Templates Section -->
    <div class="card templates-card">
      <div class="card-header">
        <h3>Automated Message Templates</h3>
        <button class="btn-secondary" @click="createTemplateModal = true">
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Template
        </button>
      </div>

      <div class="templates-list">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-item"
          :class="{ disabled: !template.enabled }"
        >
          <div class="template-header">
            <div class="template-info">
              <div class="template-toggle">
                <label class="toggle-switch field-label">
                  <input
                    type="checkbox"
                    v-model="template.enabled"
                    @change="handleTemplateToggle(template)"
                  />
                  <span class="toggle-slider"></span>
                </label>
                <div>
                  <h4>{{ template.name }}</h4>
                  <span class="template-trigger">{{ template.trigger }}</span>
                </div>
              </div>
              <div class="template-actions">
                <button class="btn-icon" @click="editTemplate(template)">
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
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </button>
                <button class="btn-icon delete" @click="deleteTemplate(template)">
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
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="template-content">
            <div class="message-preview">
              <span class="label">Message Preview:</span>
              <p>{{ template.message }}</p>
            </div>
            <div class="template-meta">
              <span class="meta-item">
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
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {{ template.sentCount }} sent
              </span>
              <span class="meta-item">
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
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Last sent: {{ template.lastSent || 'Never' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Variables Info -->
    <div class="card variables-card">
      <h3>Available Variables</h3>
      <p class="subtitle">Use these variables in your messages to personalize them:</p>
      <div class="variables-grid">
        <div class="variable-item" v-for="variable in availableVariables" :key="variable.code">
          <code>{{ variable.code }}</code>
          <span>{{ variable.description }}</span>
        </div>
      </div>
    </div>

    <!-- Bulk SMS Modal -->
    <div v-if="showBulkSmsModal" class="modal-overlay" @click.self="showBulkSmsModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Send Bulk SMS</h3>
          <button class="close-btn" @click="showBulkSmsModal = false">
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

        <form @submit.prevent="handleBulkSmsSend" class="modal-body">
          <!-- Recipients -->
          <div class="form-group">
            <label class="field-label">Recipients</label>
            <div class="recipients-options">
              <label class="radio-option">
                <input type="radio" v-model="bulkSms.recipientType" value="all" />
                <span>All Tenants ({{ totalTenants }})</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="bulkSms.recipientType" value="selected" />
                <span>Select Specific Tenants</span>
              </label>
            </div>

            <div v-if="bulkSms.recipientType === 'selected'" class="tenant-selector">
              <div class="search-box">
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
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input type="text" placeholder="Search tenants..." v-model="tenantSearch" />
              </div>
              <div class="tenant-list">
                <label v-for="tenant in filteredTenants" :key="tenant.id" class="tenant-checkbox">
                  <input type="checkbox" :value="tenant.id" v-model="bulkSms.selectedTenants" />
                  <div class="tenant-info">
                    <span class="tenant-name">{{ tenant.name }}</span>
                    <span class="tenant-details">{{ tenant.unit }} - {{ tenant.phone }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div class="form-group">
            <label class="field-label">
              Message
              <span class="char-count">{{ bulkSms.message.length }}/160</span>
            </label>
            <textarea
              v-model="bulkSms.message"
              placeholder="Type your message here..."
              rows="4"
              maxlength="160"
              required
            ></textarea>
          </div>

          <!-- Schedule -->
          <div class="form-group">
            <label class="field-label">Delivery</label>
            <div class="recipients-options">
              <label class="radio-option">
                <input type="radio" v-model="bulkSms.deliveryType" value="immediate" />
                <span>Send Immediately</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="bulkSms.deliveryType" value="scheduled" />
                <span>Schedule for Later</span>
              </label>
            </div>

            <div v-if="bulkSms.deliveryType === 'scheduled'" class="schedule-inputs">
              <input type="date" v-model="bulkSms.scheduleDate" required />
              <input type="time" v-model="bulkSms.scheduleTime" required />
            </div>
          </div>

          <!-- Cost Estimate -->
          <div class="cost-estimate">
            <div class="cost-row">
              <span>Recipients:</span>
              <strong>{{ recipientCount }}</strong>
            </div>
            <div class="cost-row">
              <span>Cost per SMS:</span>
              <strong>KSh 2.00</strong>
            </div>
            <div class="cost-row total">
              <span>Total Cost:</span>
              <strong>KSh {{ totalCost.toFixed(2) }}</strong>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showBulkSmsModal = false">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="!canSendBulkSms || sending">
              <span v-if="!sending">
                {{ bulkSms.deliveryType === 'scheduled' ? 'Schedule SMS' : 'Send SMS' }}
              </span>
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
                Sending...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Template Modal -->
    <div
      v-if="showEditTemplateModal"
      class="modal-overlay"
      @click.self="showEditTemplateModal = false"
    >
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingTemplate.id ? 'Edit Template' : 'Create Template' }}</h3>
          <button class="close-btn" @click="showEditTemplateModal = false">
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

        <form @submit.prevent="handleSaveTemplate" class="modal-body">
          <div class="form-group">
            <label class="field-label">Template Name</label>
            <input
              type="text"
              v-model="editingTemplate.name"
              placeholder="e.g., Rent Reminder"
              required
            />
          </div>

          <div class="form-group">
            <label class="field-label">Trigger Event</label>
            <select v-model="editingTemplate.trigger" required>
              <option value="">Select trigger...</option>
              <option value="3 days before due">3 days before rent due</option>
              <option value="1 day before due">1 day before rent due</option>
              <option value="On due date">On rent due date</option>
              <option value="1 day overdue">1 day after due date</option>
              <option value="7 days overdue">7 days after due date</option>
              <option value="Payment received">When payment is received</option>
            </select>
          </div>

          <div class="form-group">
            <label class="field-label">
              Message
              <span class="char-count">{{ editingTemplate.message.length }}/160</span>
            </label>
            <textarea
              v-model="editingTemplate.message"
              placeholder="Type your message here. Use variables like {tenant_name}, {amount}, {due_date}"
              rows="4"
              maxlength="160"
              required
            ></textarea>
            <p class="help-text">Click on variables below to insert them into your message</p>
          </div>

          <div class="quick-variables">
            <button
              type="button"
              v-for="variable in availableVariables"
              :key="variable.code"
              class="variable-chip"
              @click="insertVariable(variable.code)"
            >
              {{ variable.code }}
            </button>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showEditTemplateModal = false">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="!saving">Save Template</span>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const templates = ref([
  {
    id: 1,
    name: 'Rent Reminder - 3 Days Before',
    trigger: '3 days before due',
    message:
      'Hi {tenant_name}, reminder that your rent of KSh {amount} is due on {due_date}. Thank you!',
    enabled: true,
    sentCount: 145,
    lastSent: 'Dec 28, 2024',
  },
  {
    id: 2,
    name: 'Rent Due Today',
    trigger: 'On due date',
    message:
      'Hi {tenant_name}, your rent of KSh {amount} is due today. Please pay via Paybill {paybill}.',
    enabled: true,
    sentCount: 132,
    lastSent: 'Dec 31, 2024',
  },
  {
    id: 3,
    name: 'Payment Received',
    trigger: 'Payment received',
    message:
      'Hi {tenant_name}, we confirm receipt of KSh {amount} for {property_name} {unit}. Thank you!',
    enabled: true,
    sentCount: 98,
    lastSent: 'Dec 30, 2024',
  },
  {
    id: 4,
    name: 'Overdue Payment - 1 Day',
    trigger: '1 day overdue',
    message:
      'Hi {tenant_name}, your rent of KSh {amount} was due yesterday. Please clear as soon as possible.',
    enabled: false,
    sentCount: 23,
    lastSent: 'Dec 25, 2024',
  },
  {
    id: 5,
    name: 'Overdue Payment - 7 Days',
    trigger: '7 days overdue',
    message:
      'Hi {tenant_name}, your rent is 7 days overdue. Please contact us urgently to avoid further action.',
    enabled: false,
    sentCount: 8,
    lastSent: 'Dec 20, 2024',
  },
])

const availableVariables = ref([
  { code: '{tenant_name}', description: "Tenant's name" },
  { code: '{amount}', description: 'Rent amount' },
  { code: '{due_date}', description: 'Payment due date' },
  { code: '{property_name}', description: 'Property name' },
  { code: '{unit}', description: 'Unit/House number' },
  { code: '{paybill}', description: 'Paybill number' },
  { code: '{balance}', description: 'Outstanding balance' },
])

const showBulkSmsModal = ref(false)
const totalTenants = ref(24)
const tenantSearch = ref('')

const mockTenants = ref([
  { id: 1, name: 'John Doe', unit: 'A1', phone: '0712345678' },
  { id: 2, name: 'Jane Smith', unit: 'A2', phone: '0723456789' },
  { id: 3, name: 'Michael Johnson', unit: 'B1', phone: '0734567890' },
  { id: 4, name: 'Sarah Williams', unit: 'B2', phone: '0745678901' },
  { id: 5, name: 'David Brown', unit: 'C1', phone: '0756789012' },
])

const bulkSms = ref({
  recipientType: 'all',
  selectedTenants: [],
  message: '',
  deliveryType: 'immediate',
  scheduleDate: '',
  scheduleTime: '',
})

const filteredTenants = computed(() => {
  if (!tenantSearch.value) return mockTenants.value
  return mockTenants.value.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(tenantSearch.value.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(tenantSearch.value.toLowerCase()) ||
      tenant.phone.includes(tenantSearch.value),
  )
})

const recipientCount = computed(() => {
  if (bulkSms.value.recipientType === 'all') {
    return totalTenants.value
  }
  return bulkSms.value.selectedTenants.length
})

const totalCost = computed(() => {
  return recipientCount.value * 2.0
})

const canSendBulkSms = computed(() => {
  if (!bulkSms.value.message) return false
  if (bulkSms.value.recipientType === 'selected' && bulkSms.value.selectedTenants.length === 0) {
    return false
  }
  if (bulkSms.value.deliveryType === 'scheduled') {
    return bulkSms.value.scheduleDate && bulkSms.value.scheduleTime
  }
  return true
})

const sending = ref(false)

const showEditTemplateModal = ref(false)
const showCreateTemplateModal = ref(false)
const createTemplateModal = computed({
  get: () => showCreateTemplateModal.value,
  set: (val) => {
    if (val) {
      handleCreateTemplate()
    }
    showCreateTemplateModal.value = val
  },
})

const editingTemplate = ref({
  id: null,
  name: '',
  trigger: '',
  message: '',
  enabled: true,
})

const saving = ref(false)

const handleTemplateToggle = (template) => {
  console.log('Template toggled:', template)
  // Save to backend
}

const editTemplate = (template) => {
  editingTemplate.value = { ...template }
  showEditTemplateModal.value = true
}

const deleteTemplate = (template) => {
  if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
    const index = templates.value.findIndex((t) => t.id === template.id)
    if (index > -1) {
      templates.value.splice(index, 1)
    }
  }
}

const insertVariable = (variableCode) => {
  editingTemplate.value.message += variableCode
}

const handleSaveTemplate = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingTemplate.value.id) {
      // Update existing
      const index = templates.value.findIndex((t) => t.id === editingTemplate.value.id)
      if (index > -1) {
        templates.value[index] = { ...editingTemplate.value }
      }
    } else {
      // Create new
      templates.value.push({
        ...editingTemplate.value,
        id: Date.now(),
        sentCount: 0,
        lastSent: null,
      })
    }

    showEditTemplateModal.value = false
    showCreateTemplateModal.value = false
    editingTemplate.value = { id: null, name: '', trigger: '', message: '', enabled: true }
  } catch (error) {
    console.error('Error saving template:', error)
    alert('Failed to save template')
  } finally {
    saving.value = false
  }
}

const handleBulkSmsSend = async () => {
  sending.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    alert(
      `SMS ${bulkSms.value.deliveryType === 'scheduled' ? 'scheduled' : 'sent'} to ${recipientCount.value} recipients!`,
    )
    showBulkSmsModal.value = false
    bulkSms.value = {
      recipientType: 'all',
      selectedTenants: [],
      message: '',
      deliveryType: 'immediate',
      scheduleDate: '',
      scheduleTime: '',
    }
  } catch (error) {
    console.error('Error sending bulk SMS:', error)
    alert('Failed to send SMS')
  } finally {
    sending.value = false
  }
}

const handleCreateTemplate = () => {
  editingTemplate.value = { id: null, name: '', trigger: '', message: '', enabled: true }
  showEditTemplateModal.value = true
}
</script>

<style scoped src="../../../styles/pages/settings/sms.css"></style>
