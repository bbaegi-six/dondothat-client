import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
// FontAwesome 전역 등록 제거 - 컴포넌트별 로컬 import로 변경
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
// FontAwesome 컴포넌트 전역 등록
app.component('FontAwesomeIcon', FontAwesomeIcon);

// Initialize app without initial auth check
app.use(router);
app.mount('#app');
