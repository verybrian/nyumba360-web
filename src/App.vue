<template>
  <AuthNavbar v-if="route.meta.authLayout" />
  <AppNavbar v-if="route.meta.showNavbar" />
  <main class="app-main">
    <router-view />
  </main>
  <AppFooter v-if="route.meta.showFooter" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import AuthNavbar from './components/AuthNavbar.vue'

const route = useRoute()
</script>
