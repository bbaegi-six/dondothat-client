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
    // meta: { requiresAuth: true }, //로그인 해결되면 주석 해제
  },
  {
    path: '/challenge/flow',
    component: () => import('@/pages/challenge/ChallengeFlow.vue'),
  },
  {
    path: '/challenge/days-input',
    name: 'ChallengeDaysInput',
    component: () => import('../pages/challenge/ChallengeDaysInput.vue'),
    meta: { requiresAuth: true },
  },
<<<<<<< Updated upstream
=======
{
  path: '/challenge/days-input',
  name: 'ChallengeDaysInput', 
  component: () => import('../pages/challenge/ChallengeDaysInput.vue'),
  // meta: { requiresAuth: true }, //로그인 해결되면 주석 해제
},
>>>>>>> Stashed changes
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
    // meta: { requiresAuth: true },
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
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    // 인증이 필요한 라우트에 접근할 때마다 항상 최신 인증 상태를 백엔드로부터 확인
    await authStore.checkAuth();

    if (!authStore.isLoggedIn) {
      // checkAuth() 후에도 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
      next({ name: 'Login' });
    } else {
      // 로그인되어 있으면 다음으로 진행
      next();
    }
  } else {
    // 인증이 필요 없는 라우트는 바로 진행
    next();
  }
});

export default router;
