import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// pages
import Account from '../pages/account/Account.vue';
import ForgotPassword from '../pages/auth/ForgotPassword.vue';
import Login from '../pages/auth/Login.vue';
import Register from '../pages/auth/Register.vue';
import Challenge from '../pages/challenge/Challenge.vue'; // 챌린지 메인으로 직접 사용
import Chat from '../pages/chat/Chat.vue';
import Expenses from '../pages/expenses/Expenses.vue';
import ExpenseEdit from '../pages/expenses/ExpenseEdit.vue';
import NotFound from '../pages/error/NotFound.vue';
import ServerError from '../pages/error/ServerError.vue';
import Guide from '../pages/guide/Guide.vue';
import Home from '../pages/home/Home.vue';
import Profile from '../pages/profile/Profile.vue';
import Edit from '../pages/profile/Edit.vue';
import Terms from '../pages/profile/Terms.vue';
import Policy from '../pages/profile/Policy.vue';
import MyChallenge from '../pages/profile/MyChallenge.vue';

import OAuthRedirect from '../pages/auth/OAuthRedirect.vue';

const routes = [
  {
    path: '/oauth-redirect',
    name: 'OAuthRedirect',
    component: OAuthRedirect,
  },
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
    // meta: { requiresAuth: true }, // 나중에 제거
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
    component: Challenge, // Challenge.vue를 바로 메인 페이지로 사용
    meta: { requiresAuth: true },
  },
  {
    path: '/challenge/flow',
    component: () => import('@/pages/challenge/ChallengeFlow.vue')
  },
{
  path: '/challenge/days-input',
  name: 'ChallengeDaysInput', 
  component: () => import('../pages/challenge/ChallengeDaysInput.vue'),
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
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: Edit,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/mychallenge',
    name: 'MyChallenge',
    component: MyChallenge,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/terms',
    name: 'Terms',
    component: Terms,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/policy',
    name: 'Policy',
    component: Policy,
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

// 인증 필요 라우트 처리
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
