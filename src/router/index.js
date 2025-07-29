import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// pages
import Account from '../pages/account/Account.vue';
import ForgotPassword from '../pages/auth/ForgotPassword.vue';
import Login from '../pages/auth/Login.vue';
import Register from '../pages/auth/Register.vue';
import Challenge from '../pages/challenge/Challenge.vue';
import Expenses from '../pages/expenses/Expenses.vue';
import ExpenseEdit from '../pages/expenses/ExpenseEdit.vue';
import NotFound from '../pages/error/NotFound.vue';
import ServerError from '../pages/error/ServerError.vue';
import Guide from '../pages/guide/Guide.vue';
import Home from '../pages/home/Home.vue';
import Notifications from '../pages/profile/Notifications.vue';
import Profile from '../pages/profile/Profile.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/challenge',
    name: 'Challenge',
    component: Challenge,
    meta: { requiresAuth: true },
  },
  {
    path: '/no-chat',
    name: 'NoChat',
    component: () => import('@/pages/chat/NoChat.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/pages/chat/Chat.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: Expenses,
    meta: { requiresAuth: true },
  },
  {
    path: '/expenses/:id',
    name: 'ExpenseEdit',
    component: ExpenseEdit,
    meta: { requiresAuth: true },
  },
  {
    path: '/expenses/new',
    name: 'ExpenseNew',
    component: ExpenseEdit,
    meta: { requiresAuth: true },
  },

  {
    path: '/guide',
    name: 'Guide',
    component: Guide,
    meta: { requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/500',
    name: 'ServerError',
    component: ServerError,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
