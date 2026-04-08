<template>
  <div class="finances">
    <div class="header">
      <div class="header-left">
        <h2>Financial Overview</h2>
      </div>
    </div>

    <div class="finances-layout">
      <nav class="finances-nav">
        <a
          href="#"
          class="nav-link"
          :class="{ active: activeTab === 'payments' }"
          @click.prevent="activeTab = 'payments'"
        >
          Payments
        </a>
        <!-- <a
          href="#"
          class="nav-link"
          :class="{ active: activeTab === 'mpesa' }"
          @click.prevent="activeTab = 'mpesa'"
        >
          M-pesa Transactions
        </a> -->
        <a
          href="#"
          class="nav-link"
          :class="{ active: activeTab === 'expenses' }"
          @click.prevent="activeTab = 'expenses'"
        >
          Expenses
        </a>
      </nav>

      <div class="finances-content">
        <component :is="currentTabComponent" :last-submit="lastSubmit" @open-drawer="openDrawer" />
      </div>
    </div>

    <DrawerPanel
      v-model="drawerOpen"
      :type="drawerType"
      :initial-data="drawerData"
      @submit="onDrawerSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Payments from './finances/Payments.vue'
import Transactions from './finances/Transactions.vue'
import Expenses from './finances/Expenses.vue'
import DrawerPanel from '@/views/DrawerPanel.vue'

const activeTab = ref('payments')

const currentTabComponent = computed(() => {
  const tabs = {
    payments: Payments,
    // mpesa: Transactions,
    expenses: Expenses,
  }
  return tabs[activeTab.value]
})

const drawerOpen = ref(false)
const drawerType = ref('')
const drawerData = ref(null)
const lastSubmit = ref(0)

const openDrawer = (type, data = null) => {
  drawerType.value = type
  drawerData.value = data
  drawerOpen.value = true
}

const onDrawerSubmit = () => {
  lastSubmit.value = Date.now()
}
</script>

<style scoped src="../../styles/pages/finances.css"></style>
