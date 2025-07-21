import { createRouter, createWebHistory } from 'vue-router';

// pages
import Account from '../pages/account/Account.vue';
import ForgotPassword from '../pages/auth/ForgotPassword.vue';
import Login from '../pages/auth/Login.vue';
import Register from '../pages/auth/Register.vue';
import Challenge from '../pages/challenge/Challenge.vue';
import Chat from '../pages/chat/Chat.vue';
import Consumption from '../pages/consumption/Consumption.vue';
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
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
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
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/consumption',
    name: 'Consumption',
    component: Consumption,
  },
  {
    path: '/guide',
    name: 'Guide',
    component: Guide,
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
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

export default router;
