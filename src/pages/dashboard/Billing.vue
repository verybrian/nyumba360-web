<template>
  <div class="billing-page">
    <Transition name="banner-slide">
      <div v-if="accountState === 'overdue'" class="status-banner status-banner--warn">
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
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <strong>Payment overdue.</strong> Your account is in the 4-day grace period — access will
          be suspended on {{ gracePeriodEnd }} unless payment is received.
          <button class="banner-action" @click="openPayModal">Pay now</button>
        </div>
      </div>
    </Transition>

    <Transition name="banner-slide">
      <div v-if="accountState === 'trial'" class="status-banner status-banner--trial">
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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <strong>Free trial — {{ trialDaysRemaining }} days remaining.</strong>
          Your trial ends on {{ trialEndDate }}. After that, a subscription is required to keep
          access.
        </div>
      </div>
    </Transition>

    <div class="card" ref="paymentSection">
      <div class="plan-row">
        <div class="plan-meta">
          <h2>
            <span class="badge badge--tier">{{ planName }}</span>
            {{ planName }}
            <span class="badge" :class="statusBadgeClass">
              <span class="badge-dot"></span>
              {{ statusLabel }}
            </span>
          </h2>
          <p class="plan-sub">{{ billingCycleLabel }}</p>
        </div>
        <div class="price-block">
          <div class="price-amount">{{ accountState === 'trial' ? 'Ksh 0' : currentPrice }}</div>
          <div class="price-period">{{ currentPeriod }}</div>
          <div class="price-next">{{ nextBillingText }}</div>
        </div>
      </div>

      <div class="divider" />

      <div class="plan-pay-row">
        <div class="pay-hint">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          <span
            >Payments are initiated in the dashboard by clicking on
            <strong>"Pay subscription"</strong>.</span
          >
        </div>
        <button class="btn-primary" :disabled="accountState === 'trial'" @click="openPayModal">
          Pay subscription
        </button>
      </div>
    </div>

    <div v-if="planName.toLowerCase() === 'basic'" class="upgrade-strip">
      <div class="upgrade-strip-text">
        <strong>You're on Basic.</strong> Upgrade to Standard for M-Pesa reconciliation, analytics,
        rent reminders, and team access.
      </div>
      <button class="btn-primary btn-primary--sm" @click="showUpgradeModal = true">
        View Standard plan
      </button>
    </div>

    <div class="card">
      <div class="receipts-header">
        <h3>Payment receipts</h3>
        <div class="receipts-actions">
          <div class="search-bar">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search receipts…" v-model="receiptSearch" />
          </div>
          <button class="btn-ghost" @click="downloadAll">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download all
          </button>
        </div>
      </div>

      <div class="table-wrap">
        <table class="receipts-table">
          <thead>
            <tr>
              <th>Receipt</th>
              <th>Date paid</th>
              <th>Period covered</th>
              <th>Amount</th>
              <th>M-Pesa code</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredReceipts.length === 0">
              <td colspan="6" class="empty-cell">No receipts found.</td>
            </tr>
            <tr v-for="receipt in paginatedReceipts" :key="receipt.id" v-else>
              <td class="td-primary">{{ receipt.receipt_number }}</td>
              <td>{{ receipt.paid_at }}</td>
              <td>{{ receipt.period }}</td>
              <td class="td-amount">Ksh {{ receipt.amount }}</td>
              <td class="td-code">{{ receipt.mpesa_code || '—' }}</td>
              <td>
                <button class="btn-download" @click="downloadReceipt(receipt)">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="table-footer">
        <span class="hint-text">{{ paginationInfo }}</span>
        <div class="pagination">
          <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="pagination-num"
            :class="{ 'pagination-num--active': page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="backdrop">
        <div v-if="showPayModal" class="modal-backdrop" @click.self="closePayModal" />
      </Transition>
      <Transition name="modal-pop">
        <div v-if="showPayModal" class="modal" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3>Pay subscription</h3>
            <button class="modal-close" @click="closePayModal" aria-label="Close">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="pay-tabs">
            <button
              class="pay-tab"
              :class="{ 'pay-tab--active': payTab === 'stk' }"
              @click="payTab = 'stk'"
            >
              STK push
            </button>
            <button
              class="pay-tab"
              :class="{ 'pay-tab--active': payTab === 'code' }"
              @click="payTab = 'code'"
            >
              Enter M-Pesa code
            </button>
          </div>

          <div v-if="payTab === 'stk'" class="pay-tab-content">
            <p class="modal-body-text">
              We'll send a payment prompt to your M-Pesa. Open the prompt and enter your PIN to
              complete the payment of <strong>{{ currentPrice }}</strong
              >.
            </p>

            <div class="form-group">
              <label class="form-label">Send prompt to</label>
              <div class="phone-options">
                <div
                  class="phone-opt"
                  :class="{ 'phone-opt--selected': phoneMode === 'registered' }"
                  @click="phoneMode = 'registered'"
                >
                  <span class="phone-opt-label">Registered number</span>
                  <span class="phone-opt-value">{{ registeredPhone }}</span>
                </div>
                <div
                  class="phone-opt"
                  :class="{ 'phone-opt--selected': phoneMode === 'other' }"
                  @click="phoneMode = 'other'"
                >
                  <span class="phone-opt-label">Different number</span>
                  <span class="phone-opt-value">{{ otherPhone || 'Enter below' }}</span>
                </div>
              </div>
            </div>

            <Transition name="slide-down">
              <div v-if="phoneMode === 'other'" class="form-group">
                <input
                  type="tel"
                  v-model="otherPhone"
                  placeholder="e.g. 0712 345 678"
                  class="text-input"
                  :disabled="stkState === 'loading'"
                />
              </div>
            </Transition>

            <Transition name="fade">
              <div v-if="stkState !== 'idle'" class="feedback-banner" :class="stkFeedbackClass">
                <span class="spinner" v-if="stkState === 'loading'" />
                <svg
                  v-else-if="stkState === 'success'"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{{ stkFeedbackMessage }}</span>
                <button
                  v-if="stkState === 'error'"
                  class="banner-action"
                  @click="stkState = 'idle'"
                >
                  Dismiss
                </button>
              </div>
            </Transition>

            <div class="modal-actions">
              <button class="btn-ghost" @click="closePayModal">Cancel</button>
              <button
                class="btn-primary"
                :disabled="stkState === 'loading' || stkState === 'success'"
                @click="sendStkPush"
              >
                <span v-if="stkState === 'loading'" class="spinner spinner--sm" />
                {{ stkState === 'loading' ? 'Waiting for payment…' : 'Send STK push' }}
              </button>
            </div>
          </div>

          <div v-if="payTab === 'code'" class="pay-tab-content">
            <p class="modal-body-text">
              Already paid directly to Till No. <strong>6285888</strong>? Enter your M-Pesa
              confirmation code to record the payment and issue a receipt.
            </p>

            <div class="form-group">
              <label class="form-label">M-Pesa confirmation code</label>
              <input
                type="text"
                class="text-input text-input--code"
                v-model="mpesaCode"
                placeholder="e.g. RBJ4M8YT03"
                maxlength="12"
                @input="mpesaCode = mpesaCode.toUpperCase()"
                :disabled="codeState === 'loading' || codeState === 'success'"
              />
            </div>

            <Transition name="fade">
              <div v-if="codeState !== 'idle'" class="feedback-banner" :class="codeFeedbackClass">
                <span class="spinner" v-if="codeState === 'loading'" />
                <svg
                  v-else-if="codeState === 'success'"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{{ codeFeedbackMessage }}</span>
              </div>
            </Transition>

            <div class="modal-actions">
              <button class="btn-ghost" @click="closePayModal">Cancel</button>
              <button
                class="btn-primary"
                :disabled="
                  mpesaCode.length < 8 || codeState === 'loading' || codeState === 'success'
                "
                @click="submitCode"
              >
                <span v-if="codeState === 'loading'" class="spinner spinner--sm" />
                {{ codeState === 'loading' ? 'Validating…' : 'Validate payment' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="backdrop">
        <div
          v-if="showUpgradeModal"
          class="modal-backdrop"
          @click.self="showUpgradeModal = false"
        />
      </Transition>
      <Transition name="modal-pop">
        <div v-if="showUpgradeModal" class="modal modal--wide" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3>Upgrade to Standard</h3>
            <button class="modal-close" @click="showUpgradeModal = false" aria-label="Close">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p class="modal-body-text">
            Everything in Basic, plus tools built for landlords managing at scale.
          </p>

          <div class="plan-compare">
            <div class="compare-col">
              <h4>Basic <span class="compare-price">Ksh 1,050/mo</span></h4>
              <ul class="feature-list">
                <li v-for="feat in basicFeatures" :key="feat">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="check-icon check-icon--muted"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ feat }}
                </li>
              </ul>
            </div>
            <div class="compare-col compare-col--highlight">
              <h4>
                Standard <span class="compare-price">{{ selectedUpgradePrice }}</span>
              </h4>
              <ul class="feature-list">
                <li>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="check-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Everything in Basic
                </li>
                <li v-for="feat in standardExtraFeatures" :key="feat" class="feature-list__new">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="check-icon"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ feat }}
                </li>
              </ul>
            </div>
          </div>

          <div class="cadence-section">
            <div class="section-label" style="margin-bottom: 8px">Billing cycle</div>
            <div class="cadence-options">
              <button
                v-for="cad in upgradeCadences"
                :key="cad.id"
                class="cadence-btn"
                :class="{ 'cadence-btn--active': selectedCadence === cad.id }"
                @click="selectedCadence = cad.id"
              >
                <span class="cadence-label">{{ cad.label }}</span>
                <span class="cadence-price">{{ cad.price }}</span>
                <span v-if="cad.save" class="cadence-save">{{ cad.save }}</span>
              </button>
            </div>
          </div>

          <div class="contact-note">
            To upgrade, email <strong>support@nyuma360.co.ke</strong>. We'll get you set up within
            24 hours.
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/utils/api'

const router = useRouter()

const loading = ref(true)
const fetchError = ref(null)

const accountState = ref('active') // 'active' | 'trial' | 'overdue'
const planName = ref('')
const currentPrice = ref('')
const trialEndDate = ref('')
const gracePeriodEnd = ref('')
const nextBillingDate = ref('')

const registeredPhone = ref('')
const billingName = ref('')

const billingCycleLabel = ref('Monthly')
const currentPeriod = ref('/month')
const trialDaysRemaining = computed(() => {
  if (!trialEndDate.value) return 0
  const diff = new Date(trialEndDate.value) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const nextBillingText = computed(() => {
  if (accountState.value === 'trial') return `Trial ends: ${trialEndDate.value}`
  if (accountState.value === 'overdue') return `Grace period ends: ${gracePeriodEnd.value}`
  return `Next billing: ${nextBillingDate.value}`
})

const statusBadgeClass = computed(() => ({
  'badge--active': accountState.value === 'active',
  'badge--trial': accountState.value === 'trial',
  'badge--warn': accountState.value === 'overdue',
}))

const statusLabel = computed(
  () => ({ active: 'Active', trial: 'Trial', overdue: 'Overdue' })[accountState.value],
)

const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatPrice = (amount) => {
  if (amount == null) return ''
  return `Ksh ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`
}

const loadBilling = async () => {
  loading.value = true
  fetchError.value = null

  try {
    const res = await apiFetch('/api/billing/')

    if (res.status === 401 || res.status === 403) {
      router.push('/login')
      return
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      fetchError.value = body.detail || 'Failed to load billing information.'
      return
    }

    const data = await res.json()
    const { plan, receipts: rawReceipts, user } = data

    planName.value = plan.name
    currentPrice.value = formatPrice(plan.price)
    accountState.value =
      plan.status === 'trial' ? 'trial' : plan.status === 'limited' ? 'overdue' : 'active'
    trialEndDate.value = formatDate(plan.trial_ends_at)
    gracePeriodEnd.value = formatDate(plan.trial_ends_at) // adjust if you add a separate grace_period_ends_at field
    nextBillingDate.value = formatDate(plan.next_billing_date)

    if (user) {
      registeredPhone.value = user.phone || ''
      billingName.value = user.name || ''
    }

    receipts.value = (rawReceipts || []).map((r) => ({
      id: r.id,
      receipt_number: r.receipt_number,
      paid_at: formatDate(r.paid_at || r.created_at),
      period: r.period || '',
      amount: Number(r.amount).toLocaleString('en-KE', { minimumFractionDigits: 2 }),
      mpesa_code: r.mpesa_code || null,
    }))
  } catch (err) {
    fetchError.value = 'A network error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(loadBilling)

// Pay modal
const showPayModal = ref(false)
const payTab = ref('stk')

const openPayModal = () => {
  payTab.value = 'stk'
  stkState.value = 'idle'
  codeState.value = 'idle'
  mpesaCode.value = ''
  showPayModal.value = true
}

const closePayModal = () => {
  if (stkState.value === 'loading' || codeState.value === 'loading') return
  showPayModal.value = false
  setTimeout(() => {
    stkState.value = 'idle'
    codeState.value = 'idle'
    mpesaCode.value = ''
  }, 300)
}

watch(payTab, () => {
  stkState.value = 'idle'
  codeState.value = 'idle'
  mpesaCode.value = ''
})

const phoneMode = ref('registered')
const otherPhone = ref('')
const stkState = ref('idle')
const paymentSection = ref(null)

const stkFeedbackClass = computed(() => ({
  'feedback-banner--info': stkState.value === 'loading',
  'feedback-banner--success': stkState.value === 'success',
  'feedback-banner--error': stkState.value === 'error',
}))

const stkFeedbackMessage = computed(
  () =>
    ({
      loading: 'STK push sent — enter your M-Pesa PIN on your phone.',
      success: 'Payment received. Your subscription is now active.',
      error: 'Payment failed or timed out. Try again or switch to the code tab.',
    })[stkState.value] || '',
)

const sendStkPush = async () => {
  stkState.value = 'loading'
  const phone = phoneMode.value === 'registered' ? registeredPhone.value : otherPhone.value

  try {
    const res = await apiFetch('/api/billing/stk-push/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    stkState.value = res.ok ? 'success' : 'error'
    if (res.ok) loadBilling()
  } catch {
    stkState.value = 'error'
  }
}

const scrollToPayment = () => {
  paymentSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// M-Pesa code validation
const mpesaCode = ref('')
const codeState = ref('idle')

const codeFeedbackClass = computed(() => ({
  'feedback-banner--info': codeState.value === 'loading',
  'feedback-banner--success': codeState.value === 'success',
  'feedback-banner--error': codeState.value === 'error',
}))

const codeFeedbackMessage = computed(
  () =>
    ({
      loading: 'Validating code…',
      success: 'Payment validated. Your receipt has been issued.',
      error: 'Code not found or already used. Contact support if this is unexpected.',
    })[codeState.value] || '',
)

const submitCode = async () => {
  codeState.value = 'loading'

  try {
    const res = await apiFetch('/api/billing/validate-code/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: mpesaCode.value }),
    })
    codeState.value = res.ok ? 'success' : 'error'
    if (res.ok) loadBilling()
  } catch {
    codeState.value = 'error'
  }
}

const showUpgradeModal = ref(false)
const selectedCadence = ref('monthly')

const upgradeCadences = [
  { id: 'monthly', label: 'Monthly', price: 'Ksh 1,500/mo', save: null },
  { id: 'biannual', label: 'Bi-annual', price: 'Ksh 7,700/6mo', save: 'Save 14%' },
  { id: 'annual', label: 'Annual', price: 'Ksh 13,700/yr', save: 'Save 24%' },
]

const selectedUpgradePrice = computed(
  () => upgradeCadences.find((c) => c.id === selectedCadence.value)?.price || '',
)

const basicFeatures = [
  'All core property management',
  'Unlimited tenants & units',
  'Maintenance request tracking',
  'Vacant unit listings',
  'Income & expense tracking',
  'AI bulk unit creation',
  'Email & phone support',
]

const standardExtraFeatures = [
  'M-Pesa rent reconciliation',
  'Multi-admin team access',
  'Analytics dashboard',
  'Rent reminder automation',
  'Bulk SMS announcements',
  'Free onboarding session',
  'Priority support',
]

const receiptSearch = ref('')
const currentPage = ref(1)
const pageSize = 10
const receipts = ref([])

watch(receiptSearch, () => {
  currentPage.value = 1
})

const filteredReceipts = computed(() => {
  const q = receiptSearch.value.toLowerCase().trim()
  if (!q) return receipts.value
  return receipts.value.filter(
    (r) =>
      r.receipt_number.toLowerCase().includes(q) ||
      r.period.toLowerCase().includes(q) ||
      (r.mpesa_code && r.mpesa_code.toLowerCase().includes(q)),
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredReceipts.value.length / pageSize)))

const paginatedReceipts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredReceipts.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages
})

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * pageSize + 1
  const end = Math.min(currentPage.value * pageSize, filteredReceipts.value.length)
  return `${start}–${end} of ${filteredReceipts.value.length}`
})

const downloadReceipt = async (receipt) => {
  const res = await apiFetch(`/api/billing/receipts/${receipt.id}/download/`)
  if (!res.ok) return
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${receipt.receipt_number}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}

const downloadAll = async () => {
  const res = await apiFetch('/api/billing/receipts/download-all/')
  if (!res.ok) return
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'receipts.zip'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped src="../../styles/pages/billing.css"></style>
