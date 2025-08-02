import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// 앱 시작 시 인증 상태 확인
const authStore = useAuthStore();
await authStore.checkAuth(); // 비동기 작업이 완료될 때까지 기다립니다.

app.use(router);

app.mount('#app');
