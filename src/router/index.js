import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import PasswordReset from '../views/PasswordReset.vue'
import Landing from '../views/Landing.vue'

import DashboardLayout from '../views/Dashboard.vue'
import DashboardHome from '../pages/dashboard/Home.vue'
import PropertiesPage from '../pages/dashboard/Properties.vue'
import TenantsPage from '../pages/dashboard/Tenants.vue'
import FinancesPage from '../pages/dashboard/Finances.vue'
import ReportsPage from '../pages/dashboard/Reports.vue'
import BillingPage from '../pages/dashboard/Billing.vue'
import ProfilePage from '../pages/dashboard/Profile.vue'
import SettingsPage from '../pages/dashboard/Settings.vue'
import SupportPage from '../pages/dashboard/Support.vue'

import PropertyDetails from '../pages/dashboard/PropertyDetails.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
      meta: { authLayout: false, showFooter: false },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
      meta: { authLayout: true, showFooter: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: PasswordReset,
      meta: { authLayout: true, showFooter: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
      meta: { authLayout: true, showFooter: true },
    },

    {
      path: '/d/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', component: DashboardHome },
        { path: 'properties', component: PropertiesPage },
        { path: 'properties/:id', component: PropertyDetails, props: true },
        { path: 'tenants', component: TenantsPage },
        { path: 'finances', component: FinancesPage },
        { path: 'reports', component: ReportsPage },
        // { path: 'billing', component: BillingPage },
        { path: 'profile', component: ProfilePage },
        // { path: 'settings', component: SettingsPage },
        { path: 'support', component: SupportPage },

        {
          path: ':pathMatch(.*)*',
          redirect: '/d/',
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()

  const auth = useAuthStore()
  const user = await auth.fetchUser()

  if (!user) return next('/login')

  next()
})

export default router
