import { createRouter, createWebHistory } from 'vue-router'

// Onboarding & Auth Pages
import Welcome from '../pages/onboarding/Welcome.vue'
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'

// Main App Pages
import Home from '../pages/main/Home.vue'
import Dashboard from '../pages/main/Dashboard.vue'
import Transactions from '../pages/main/Transactions.vue'
import Analytics from '../pages/main/Analytics.vue'
import Budget from '../pages/main/Budget.vue'
import Goals from '../pages/main/Goals.vue'
import Categories from '../pages/main/Categories.vue'

// Detail Pages (to be implemented later)
// import TransactionDetail from '../pages/details/TransactionDetail.vue'
// import CategoryDetail from '../pages/details/CategoryDetail.vue'
// import BudgetDetail from '../pages/details/BudgetDetail.vue'

// Settings & Profile
import Profile from '../pages/profile/Profile.vue'
import Settings from '../pages/profile/Settings.vue'
import Notifications from '../pages/profile/Notifications.vue'
import Security from '../pages/profile/Security.vue'

const routes = [
  // Onboarding Flow
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },

  // Auth Flow
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },

  // Main App
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics
  },
  {
    path: '/budget',
    name: 'Budget',
    component: Budget
  },
  {
    path: '/goals',
    name: 'Goals',
    component: Goals
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },

  // Detail Pages (to be implemented later)
  // {
  //   path: '/transaction/:id',
  //   name: 'TransactionDetail',
  //   component: TransactionDetail
  // },
  // {
  //   path: '/category/:id',
  //   name: 'CategoryDetail',
  //   component: CategoryDetail
  // },
  // {
  //   path: '/budget/:id',
  //   name: 'BudgetDetail',
  //   component: BudgetDetail
  // },

  // Profile & Settings
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications
  },
  {
    path: '/security',
    name: 'Security',
    component: Security
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
