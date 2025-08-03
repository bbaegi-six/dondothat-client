import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

// Define an async function for app initialization
async function initializeApp() {
  const authStore = useAuthStore();
  await authStore.checkAuth(); // Wait for auth check to complete

  app.use(router);
  app.mount('#app');
}

// Call the async initialization function
initializeApp();
