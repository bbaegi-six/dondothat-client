import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
import { useAuthStore } from './stores/auth';
// FontAwesome 전역 등록 제거 - 컴포넌트별 로컬 import로 변경
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
// FontAwesome 컴포넌트 전역 등록
app.component('FontAwesomeIcon', FontAwesomeIcon);

// Define an async function for app initialization
async function initializeApp() {
  const authStore = useAuthStore();
  await authStore.checkAuth(); // Wait for auth check to complete

  app.use(router);
  app.mount('#app');
}

// Call the async initialization function
initializeApp();
