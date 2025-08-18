import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// pages - 동적 import로 변경하여 번들 크기 최적화
const Account = () => import('../pages/account/Account.vue');
const ForgotPassword = () => import('../pages/auth/ForgotPassword.vue');
const Login = () => import('../pages/auth/Login.vue');
const Register = () => import('../pages/auth/Register.vue');
const Challenge = () => import('../pages/challenge/Challenge.vue');
const Chat = () => import('../pages/chat/Chat.vue');
const Expenses = () => import('../pages/expenses/Expenses.vue');
const ExpenseEdit = () => import('../pages/expenses/ExpenseEdit.vue');
const NotFound = () => import('../pages/error/NotFound.vue');
const ServerError = () => import('../pages/error/ServerError.vue');
const Guide = () => import('../pages/guide/Guide.vue');
const Home = () => import('../pages/home/Home.vue');
const Profile = () => import('../pages/profile/Profile.vue');
const Edit = () => import('../pages/profile/Edit.vue');
const Terms = () => import('../pages/profile/Terms.vue');
const Policy = () => import('../pages/profile/Policy.vue');
const MyChallenge = () => import('../pages/profile/MyChallenge.vue');

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
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      // URL 직접 접근 차단 - 다른 페이지에서만 접근 가능
      if (!from.name) {
        next('/'); // 홈으로 리다이렉트
        return;
      }
      next();
    },
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
    path: '/challenge/connectsub',
    name: 'ConnectSub',
    component: () => import('@/pages/challenge/ConnectSub.vue'),
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
    meta: { requiresAuth: true },
    async beforeEnter(to, from, next) {
      try {
        // Chat Store의 챌린지 상태 확인 API 호출
        const { useChatStore } = await import('@/stores/chat');
        const chatStore = useChatStore();
        
        const status = await chatStore.checkUserChallengeStatus();
        
        if (!status.hasActiveChallenge) {
          // 챌린지가 없으면 no-chat으로 리다이렉트
          next('/no-chat');
        } else {
          // 챌린지가 있으면 Chat 컴포넌트로 진행
          next();
        }
      } catch (error) {
        console.error('챌린지 상태 확인 실패:', error);
        // 에러 발생 시에도 no-chat으로 이동
        next('/no-chat');
      }
    },
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
