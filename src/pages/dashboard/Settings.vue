<template>
  <div class="settings">
    <div class="header">
      <div class="header-left">
        <h2>Settings</h2>
      </div>
    </div>

    <div class="settings-layout">
      <nav class="settings-nav">
        <a
          href="#"
          class="nav-link"
          :class="{ active: activeTab === 'paybill' }"
          @click.prevent="activeTab = 'paybill'"
        >
          <span class="nav-label">Paybill Integration</span>
        </a>

        <a
          href="#"
          class="nav-link has-badge"
          title="This feature is currently broken"
          :class="{ active: activeTab === 'sms' }"
          @click.prevent="activeTab = 'sms'"
        >
          SMS Configuration
          <span class="badge badge-error badge-overlay"> ! </span>
        </a>
      </nav>

      <div class="settings-content">
        <component :is="currentTabComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Paybill from './settings/Paybill.vue'
import SMS from './settings/SMS.vue'

const activeTab = ref('paybill')

const currentTabComponent = computed(() => {
  const tabs = {
    paybill: Paybill,
    sms: SMS,
  }
  return tabs[activeTab.value]
})
</script>

<style scoped src="../../styles/pages/settings.css"></style>
