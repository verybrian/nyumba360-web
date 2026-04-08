<template>
  <div class="dashboard-home">
    <Transition name="banner-slide">
      <div v-if="isDemo && !demoDismissed" class="demo-banner">
        <div class="demo-banner-icon">
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div class="demo-banner-body">
          <span class="demo-banner-title">You're exploring with demo data</span>
          <span class="demo-banner-sub"
            >Everything here is pre-filled so you can see how the system works. When you're ready,
            clear it and start with your own properties and tenants.</span
          >
        </div>
        <span class="demo-badge"> <span class="demo-badge-dot"></span>Demo mode </span>
        <span class="demo-timer">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Auto-clears in {{ demoDaysLeft }} day{{ demoDaysLeft === 1 ? '' : 's' }}
        </span>
        <div class="demo-banner-actions">
          <button class="demo-btn-primary" @click="showClearConfirm = true">
            Start with my data
          </button>
          <button class="demo-btn-dismiss" @click="demoDismissed = true" title="Dismiss">
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <Teleport to="body">
      <Transition name="backdrop">
        <div
          v-if="showClearConfirm"
          class="dialog-backdrop"
          @click.self="showClearConfirm = null"
        />
      </Transition>
      <Transition name="dialog">
        <div v-if="showClearConfirm" class="dialog" aria-modal="true" role="alertdialog">
          <div class="dialog-icon">
            <svg
              width="24"
              height="24"
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
          </div>
          <h3 class="dialog-title">Clear demo data</h3>
          <p class="dialog-body">
            This will permanently delete all demo properties, units, tenants, and payments. Your
            account will be empty and ready for your real data.
            <strong>This cannot be undone.</strong>
          </p>
          <div class="dialog-actions">
            <button class="btn-cancel" @click="showClearConfirm = false">Cancel</button>
            <button class="btn-danger" :disabled="isDemoClearing" @click="clearDemoData">
              <template v-if="isDemoClearing">
                <span class="btn-bubbles"><span></span><span></span><span></span></span>
              </template>
              <template v-else>Clear data</template>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="home-topbar">
      <div class="home-topbar-left">
        <h2>Overview</h2>
        <span class="home-topbar-sub">Property management dashboard</span>
      </div>
      <div class="home-topbar-right">
        <div class="date-range-picker">
          <div class="date-picker-wrapper">
            <DatePicker
              v-model:value="dateRange"
              type="date"
              range
              format="MMM D YYYY"
              value-format="MMM D YYYY"
              :placeholder="dateRangePlaceholder"
              :clearable="false"
              @change="handleDateChange"
            >
              <template #icon-calendar>
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </template>
            </DatePicker>
            <svg
              class="right-arrow"
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
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <button
            v-if="dateRange && dateRange.length === 2"
            class="clear-btn"
            @click="clearDateRange"
            title="Clear date range"
          >
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
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
        <button class="add-payment-btn" @click="$emit('open-drawer', 'New Payment')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New payment
        </button>
      </div>
    </div>

    <!-- ── KPI CARDS ── -->
    <div class="kpi-grid">
      <div class="kpi-card kpi-card--green">
        <div class="kpi-card-top">
          <span class="kpi-label">Total properties</span>
          <div class="kpi-icon kpi-icon--green">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="7" width="7" height="13" rx="1" />
              <rect x="14" y="3" width="7" height="17" rx="1" />
            </svg>
          </div>
        </div>
        <div class="kpi-card-body">
          <div v-if="statsLoading" class="skeleton skeleton-kpi-val"></div>
          <div v-else class="kpi-val">{{ stats.properties }}</div>
        </div>
        <div class="kpi-card-footer">
          <template v-if="statsLoading">
            <div class="skeleton skeleton-text sk-med"></div>
          </template>
          <template v-else>
            <!-- <span class="kpi-stat">
              <span class="kpi-stat-up">↑ {{ paidThisMonth }}</span> paid this period
            </span> -->
            <a href="/d/properties" class="kpi-link">View all</a>
          </template>
        </div>
        <div class="kpi-accent"></div>
      </div>

      <!-- Tenants -->
      <div class="kpi-card kpi-card--purple">
        <div class="kpi-card-top">
          <span class="kpi-label">Total tenants</span>
          <div class="kpi-icon kpi-icon--purple">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>
        <div class="kpi-card-body">
          <div v-if="statsLoading" class="skeleton skeleton-kpi-val"></div>
          <div v-else class="kpi-val">{{ stats.tenants }}</div>
        </div>
        <div class="kpi-card-footer">
          <template v-if="statsLoading">
            <div class="skeleton skeleton-text sk-med"></div>
          </template>
          <template v-else>
            <span class="kpi-stat">
              <template v-if="newTenantsThisPeriod >= newTenantsPrevPeriod">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="delta-icon up"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                <span class="kpi-stat-up">+{{ newTenantsThisPeriod }}</span>
              </template>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="delta-icon down"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span class="kpi-stat-down">{{ newTenantsThisPeriod }}</span>
              </template>
              new this period
            </span>
            <a href="/d/tenants/" class="kpi-link">View all</a>
          </template>
        </div>
        <div class="kpi-accent"></div>
      </div>

      <!-- Rental Income -->
      <div class="kpi-card kpi-card--blue">
        <div class="kpi-card-top">
          <span class="kpi-label">Rental income</span>
          <div class="kpi-icon kpi-icon--blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 12h-6a2 2 0 0 0 0 4h6v-4Z" />
              <path d="M2 14V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H6a4 4 0 0 0-4 4Z" />
            </svg>
          </div>
        </div>
        <div class="kpi-card-body">
          <div v-if="statsLoading" class="skeleton skeleton-kpi-val"></div>
          <div v-else class="kpi-val kpi-val--sm">Ksh {{ formatAmount(stats.income) }}</div>
        </div>
        <div class="kpi-card-footer">
          <template v-if="statsLoading">
            <div class="skeleton skeleton-text sk-med"></div>
          </template>
          <template v-else>
            <span class="kpi-stat">
              <template v-if="incomeDelta === null">
                <span class="kpi-stat-neutral">No prior data</span>
              </template>
              <template v-else-if="incomeDelta >= 0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="delta-icon up"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                <span class="kpi-stat-up">+{{ incomeDelta }}%</span>
              </template>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="delta-icon down"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span class="kpi-stat-down">{{ incomeDelta }}%</span>
              </template>
              vs last period
            </span>
          </template>
        </div>
        <div class="kpi-accent"></div>
      </div>

      <!-- Expenses -->
      <div class="kpi-card kpi-card--amber">
        <div class="kpi-card-top">
          <span class="kpi-label">Expenses</span>
          <div class="kpi-icon kpi-icon--amber">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2V2Z" />
              <path d="M8 6h8" />
              <path d="M8 10h8" />
              <path d="M8 14h5" />
            </svg>
          </div>
        </div>
        <div class="kpi-card-body">
          <div v-if="statsLoading" class="skeleton skeleton-kpi-val"></div>
          <div v-else class="kpi-val kpi-val--sm">Ksh {{ formatAmount(stats.expenses) }}</div>
        </div>
        <div class="kpi-card-footer">
          <template v-if="statsLoading">
            <div class="skeleton skeleton-text sk-med"></div>
          </template>
          <template v-else>
            <span class="kpi-stat">
              <template v-if="expensesDelta === null">
                <span class="kpi-stat-neutral">No prior data</span>
              </template>
              <template v-else-if="expensesDelta <= 0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="delta-icon up"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                <span class="kpi-stat-up">{{ expensesDelta }}%</span>
              </template>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="delta-icon down"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span class="kpi-stat-down">+{{ expensesDelta }}%</span>
              </template>
              vs last period
            </span>
          </template>
        </div>
        <div class="kpi-accent"></div>
      </div>
    </div>

    <div class="main-layout">
      <div class="left-col">
        <div class="payments-panel">
          <div class="panel-head">
            <span class="panel-title">Recent payments</span>
            <div class="panel-head-actions">
              <div class="search-bar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                <input type="text" placeholder="Search payments…" v-model="paymentSearch" />
              </div>
              <select v-model="statusFilter" class="filter-select">
                <option value="">All status</option>
                <option value="success">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button class="download-btn" title="Download">
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>

          <div class="payments-table-wrap">
            <table class="payments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tenant</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="paymentsLoading">
                  <tr v-for="n in 10" :key="'sk-' + n" class="skeleton-row">
                    <td><div class="skeleton skeleton-text sk-short"></div></td>
                    <td>
                      <div class="tenant-cell">
                        <div class="skeleton skeleton-avatar"></div>
                        <div class="skeleton skeleton-text sk-med"></div>
                      </div>
                    </td>
                    <td><div class="skeleton skeleton-text sk-med"></div></td>
                    <td><div class="skeleton skeleton-text sk-med"></div></td>
                    <td><div class="skeleton skeleton-text sk-short"></div></td>
                    <td><div class="skeleton skeleton-text sk-short"></div></td>
                    <td></td>
                  </tr>
                </template>

                <tr v-else-if="paymentsError">
                  <td colspan="7" class="error-cell">
                    {{ paymentsError }}
                    <button class="retry-btn" @click="fetchDashboard">Retry</button>
                  </td>
                </tr>

                <tr v-else-if="filteredPayments.length === 0">
                  <td colspan="7" class="empty-cell">
                    <div class="empty-state">
                      <div class="empty-icon">
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
                          <path d="M20 12h-6a2 2 0 0 0 0 4h6v-4Z" />
                          <path d="M2 14V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H6a4 4 0 0 0-4 4Z" />
                        </svg>
                      </div>
                      <p class="empty-title">
                        {{ paymentSearch || statusFilter ? 'No results found' : 'No payments yet' }}
                      </p>
                      <p v-if="!paymentSearch && !statusFilter" class="empty-sub">
                        Add payments to start tracking income.
                      </p>
                      <button
                        v-if="paymentSearch || statusFilter"
                        class="empty-action"
                        @click="
                          () => {
                            paymentSearch = ''
                            statusFilter = ''
                          }
                        "
                      >
                        Clear filters
                      </button>
                      <button
                        v-else
                        class="empty-action"
                        @click="$emit('open-drawer', 'New Payment')"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add payment
                      </button>
                    </div>
                  </td>
                </tr>

                <template v-else>
                  <tr v-for="payment in filteredPayments" :key="payment.id">
                    <td class="td-id">
                      {{ payment.reference || payment.custom_id?.toUpperCase() || payment.id }}
                    </td>
                    <td>
                      <div class="tenant-cell">
                        <div class="tenant-avatar" :style="avatarStyle(payment.tenant__name)">
                          {{ initials(payment.tenant__name) }}
                        </div>
                        <span class="tenant-name">{{ payment.tenant__name }}</span>
                      </div>
                    </td>
                    <td>{{ formatDate(payment.payment_date) }}</td>
                    <td class="td-amount">Ksh {{ formatAmount(payment.amount) }}</td>
                    <td>
                      <span class="method-tag">{{ methodLabel(payment.payment_method) }}</span>
                    </td>
                    <td>
                      <span class="status-badge" :class="'status-' + payment.status">
                        <span class="status-dot"></span>
                        {{ statusLabel(payment.status) }}
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div v-if="!paymentsLoading && payments.length > 0" class="panel-foot">
            <span class="panel-foot-info"
              >Showing {{ filteredPayments.length }} of {{ payments.length }} payments</span
            >
            <button class="view-all-btn" @click="$router.push('/d/finances')">
              View all payments
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- <div class="reliability-panel">
          <div class="panel-head">
            <div>
              <span class="panel-title">Tenant reliability</span>
              <p class="panel-subtitle">On-time payment rate · based on payment history</p>
            </div>
          </div>

          <div class="reliability-table-wrap">
            <table class="reliability-table">
              <thead>
                <tr>
                  <th style="width: 40px">#</th>
                  <th>Tenant</th>
                  <th>Payments</th>
                  <th style="width: 130px">Score</th>
                  <th style="width: 90px; text-align: right">Rating</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="paymentsLoading">
                  <tr v-for="n in 5" :key="'rsk-' + n" class="skeleton-row">
                    <td><div class="skeleton skeleton-text sk-short"></div></td>
                    <td>
                      <div class="tenant-cell">
                        <div class="skeleton skeleton-avatar"></div>
                        <div class="skeleton skeleton-text sk-med"></div>
                      </div>
                    </td>
                    <td><div class="skeleton skeleton-text sk-short"></div></td>
                    <td><div class="skeleton skeleton-bar"></div></td>
                    <td>
                      <div class="skeleton skeleton-text sk-short" style="margin-left: auto"></div>
                    </td>
                  </tr>
                </template>

                <tr v-else-if="reliabilityRanking.length === 0">
                  <td colspan="5" class="empty-cell">
                    <div class="empty-state">
                      <p class="empty-title">Not enough data yet</p>
                      <p class="empty-sub">
                        Reliability scores appear once tenants have payment history.
                      </p>
                    </div>
                  </td>
                </tr>

                <template v-else>
                  <tr v-for="(tenant, idx) in reliabilityRanking" :key="tenant.name">
                    <td class="td-rank">{{ idx + 1 }}</td>
                    <td>
                      <div class="tenant-cell">
                        <div class="tenant-avatar" :style="avatarStyle(tenant.name)">
                          {{ initials(tenant.name) }}
                        </div>
                        <span class="tenant-name">{{ tenant.name }}</span>
                      </div>
                    </td>
                    <td class="td-payment-count">
                      <span class="payment-count-text">{{ tenant.paid }}/{{ tenant.total }}</span>
                      <span class="payment-count-sub"> paid</span>
                    </td>
                    <td>
                      <div class="score-bar-wrap">
                        <div class="score-bar-track">
                          <div
                            class="score-bar-fill"
                            :class="scoreFillClass(tenant.score)"
                            :style="{ width: tenant.score + '%' }"
                          ></div>
                        </div>
                        <span class="score-num" :class="scoreTextClass(tenant.score)">{{
                          tenant.score
                        }}</span>
                      </div>
                    </td>
                    <td style="text-align: right">
                      <span class="reliability-badge" :class="reliabilityBadgeClass(tenant.score)">
                        {{ reliabilityLabel(tenant.score) }}
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div> -->
      </div>

      <!-- ── SIDEBAR ── -->
      <div class="sidebar">
        <div class="sidebar-panel">
          <div class="sidebar-panel-title">Occupancy</div>
          <template v-if="statsLoading">
            <div class="skeleton skeleton-occ-big"></div>
            <div class="skeleton skeleton-text sk-med" style="margin-top: 6px"></div>
            <div class="skeleton skeleton-bar" style="margin-top: 14px"></div>
            <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 10px">
              <div class="skeleton skeleton-text sk-full"></div>
              <div class="skeleton skeleton-text sk-full"></div>
              <div class="skeleton skeleton-text sk-full"></div>
            </div>
          </template>
          <template v-else>
            <div class="occ-big">{{ occupancyRate }}%</div>
            <div class="occ-sub">
              {{ stats.tenants }} tenants · {{ stats.properties }} properties
            </div>
            <div class="occ-bar-track">
              <div class="occ-bar-fill" :style="{ width: occupancyRate + '%' }"></div>
            </div>
            <div class="occ-breakdown">
              <div class="occ-row">
                <span class="occ-row-label">
                  <span class="occ-dot" style="background: var(--green)"></span>
                  Active tenants
                </span>
                <span class="occ-row-val">{{ stats.tenants }}</span>
              </div>
              <div class="occ-row">
                <span class="occ-row-label">
                  <span class="occ-dot" style="background: var(--red)"></span>
                  Inactive tenants
                </span>
                <span class="occ-row-val">{{ pendingCount }}</span>
              </div>
              <div class="occ-row">
                <span class="occ-row-label">
                  <span class="occ-dot" style="background: var(--text-muted)"></span>
                  Total properties
                </span>
                <span class="occ-row-val">{{ stats.properties }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- <div class="sidebar-panel">
          <div class="sidebar-panel-title">Income by method</div>
          <template v-if="paymentsLoading">
            <div v-for="n in 3" :key="n" style="margin-bottom: 14px">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
                <div class="skeleton skeleton-text sk-med"></div>
                <div class="skeleton skeleton-text sk-short"></div>
              </div>
              <div class="skeleton skeleton-bar"></div>
            </div>
          </template>
          <template v-else>
            <div class="ibar-list">
              <div v-for="item in incomeByMethod" :key="item.label" class="ibar-row">
                <div class="ibar-label-row">
                  <span class="ibar-name">{{ item.label }}</span>
                  <span class="ibar-amt">Ksh {{ formatAmount(item.total) }}</span>
                </div>
                <div class="ibar-track">
                  <div
                    class="ibar-fill"
                    :style="{ width: item.pct + '%', background: item.color }"
                  ></div>
                </div>
              </div>
            </div>
          </template>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'
import { apiFetch } from '@/utils/api'

const isDemo = ref(false)
const demoDaysLeft = ref(7)
const demoDismissed = ref(false)
const isDemoClearing = ref(false)
const showClearConfirm = ref(false)

const clearDemoData = async () => {
  isDemoClearing.value = true
  try {
    const res = await apiFetch('/api/organization/clear-demo/', { method: 'POST' })
    if (res.ok) {
      isDemo.value = false
      showClearConfirm.value = false
      fetchDashboard()
    }
  } finally {
    isDemoClearing.value = false
  }
}

const emit = defineEmits(['open-drawer'])

const props = defineProps({
  lastSubmit: { type: Number, default: 0 },
})

watch(
  () => props.lastSubmit,
  (val) => {
    if (val) fetchDashboard()
  },
)

const dateRange = ref([])

const getDefaultDateRange = () => {
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)
  return [thirtyDaysAgo, today]
}

const toISODate = (d) => new Date(d).toISOString().split('T')[0]
const dateFrom = computed(() => (dateRange.value?.[0] ? toISODate(dateRange.value[0]) : null))
const dateTo = computed(() => (dateRange.value?.[1] ? toISODate(dateRange.value[1]) : null))

const dateRangePlaceholder = computed(() => {
  if (dateRange.value?.length === 2)
    return `${formatDate(dateRange.value[0])} – ${formatDate(dateRange.value[1])}`
  return 'Select date range'
})

const handleDateChange = () => fetchDashboard()
const clearDateRange = () => {
  dateRange.value = getDefaultDateRange()
  fetchDashboard()
}

const stats = ref({ properties: 0, tenants: 0, income: 0, expenses: 0 })
const statsLoading = ref(true)

const incomeDelta = computed(() => {
  const curr = Number(stats.value.income) || 0
  const prev = Number(stats.value.prev_income) || 0
  if (!prev) return null
  return Math.round(((curr - prev) / prev) * 100)
})

const expensesDelta = computed(() => {
  const curr = Number(stats.value.expenses) || 0
  const prev = Number(stats.value.prev_expenses) || 0
  if (!prev) return null
  return Math.round(((curr - prev) / prev) * 100)
})

const newTenantsThisPeriod = computed(() => stats.value.new_tenants_this_period ?? 0)
const newTenantsPrevPeriod = computed(() => stats.value.new_tenants_prev_period ?? 0)

const payments = ref([])
const paymentsLoading = ref(true)
const paymentsError = ref('')
const paymentSearch = ref('')
const statusFilter = ref('')

const filteredPayments = computed(() => {
  let list = payments.value
  if (statusFilter.value) list = list.filter((p) => p.status === statusFilter.value)
  const q = paymentSearch.value.toLowerCase().trim()
  if (q)
    list = list.filter(
      (p) =>
        (p.reference && p.reference.toLowerCase().includes(q)) ||
        (p.tenant__name && p.tenant__name.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)),
    )
  return list.slice(0, 10)
})

watch(statusFilter, (val) => {
  if (val === '') fetchDashboard()
})

const paidThisMonth = computed(() => payments.value.filter((p) => p.status === 'success').length)
const pendingCount = computed(() => payments.value.filter((p) => p.status === 'pending').length)
const failedCount = computed(() => payments.value.filter((p) => p.status === 'failed').length)

const collectionRate = computed(() => {
  const total = payments.value.length
  if (!total) return 0
  const paid = payments.value.filter((p) => p.status === 'success').length
  return Math.round((paid / total) * 100)
})

const occupancyRate = computed(() => {
  if (!stats.value.properties) return 0
  return Math.min(100, Math.round((stats.value.tenants / (stats.value.properties * 4)) * 100))
})

const incomeByMethod = computed(() => {
  const map = { mpesa: 0, cash: 0, bank: 0 }
  for (const p of payments.value) {
    if (p.status === 'success' && p.payment_method in map)
      map[p.payment_method] += Number(p.amount) || 0
  }
  const max = Math.max(...Object.values(map), 1)
  const colors = { mpesa: 'var(--light-azure)', cash: 'var(--green)', bank: 'var(--purple)' }
  const labels = { mpesa: 'M-Pesa', cash: 'Cash', bank: 'Bank transfer' }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([key, total]) => ({
      label: labels[key],
      total,
      pct: Math.round((total / max) * 100),
      color: colors[key],
    }))
})

const fetchDashboard = async () => {
  statsLoading.value = true
  paymentsLoading.value = true
  paymentsError.value = ''

  try {
    const params = new URLSearchParams()
    if (dateFrom.value) params.set('date_from', dateFrom.value)
    if (dateTo.value) params.set('date_to', dateTo.value)

    const res = await apiFetch(`/api/dashboard/?${params}`)
    if (!res.ok) {
      paymentsError.value = `Failed to load data (${res.status}).`
      return
    }
    const data = await res.json()
    stats.value = data.stats
    payments.value = data.payments
    isDemo.value = data.organization?.is_demo ?? false
    demoDaysLeft.value = data.organization?.demo_days_left ?? 7
  } catch {
    paymentsError.value = 'Something went wrong.'
  } finally {
    statsLoading.value = false
    paymentsLoading.value = false
  }
}

const itemToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const confirmDeletePayment = (payment) => {
  activeActionMenu.value = null
  deleteError.value = ''
  itemToDelete.value = { ...payment, _endpoint: `/api/payments/${payment.id}/` }
}

const executeDelete = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    const res = await apiFetch(itemToDelete.value._endpoint, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      payments.value = payments.value.filter((p) => p.id !== itemToDelete.value.id)
      itemToDelete.value = null
      fetchDashboard()
    } else {
      const d = await res.json().catch(() => ({}))
      deleteError.value = d.detail || `Delete failed (${res.status}).`
    }
  } catch {
    deleteError.value = 'Something went wrong. Could not delete.'
  } finally {
    isDeleting.value = false
  }
}

const activeActionMenu = ref(null)
const toggleActionMenu = (id) => {
  activeActionMenu.value = activeActionMenu.value === id ? null : id
}
const closeActionMenu = (id) => {
  if (activeActionMenu.value === id) activeActionMenu.value = null
}

const formatDate = (val) => {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatAmount = (val) => {
  if (!val && val !== 0) return '—'
  return Number(val).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const statusLabel = (s) =>
  ({ success: 'Paid', pending: 'Pending', failed: 'Failed' })[s] || s || '—'
const methodLabel = (s) => ({ mpesa: 'M-Pesa', cash: 'Cash', bank: 'Bank Transfer' })[s] || s || '—'

const initials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

const AVATAR_PALETTES = [
  { bg: 'var(--avatar-purple-bg)', color: 'var(--avatar-purple-fg)' },
  { bg: 'var(--avatar-green-bg)', color: 'var(--avatar-green-fg)' },
  { bg: 'var(--avatar-blue-bg)', color: 'var(--avatar-blue-fg)' },
  { bg: 'var(--avatar-amber-bg)', color: 'var(--avatar-amber-fg)' },
  { bg: 'var(--avatar-pink-bg)', color: 'var(--avatar-pink-fg)' },
]

const avatarStyle = (name) => {
  const idx = (name || '').charCodeAt(0) % AVATAR_PALETTES.length
  return AVATAR_PALETTES[idx]
    ? { background: AVATAR_PALETTES[idx].bg, color: AVATAR_PALETTES[idx].color }
    : {}
}

const vClickOutside = {
  mounted(el, binding) {
    el._co = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('mousedown', el._co)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._co)
  },
}

onMounted(() => {
  dateRange.value = getDefaultDateRange()
  fetchDashboard()
})
</script>

<style scoped src="../../styles/pages/home.css"></style>
