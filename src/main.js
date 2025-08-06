import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
import { useAuthStore } from './stores/auth';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleQuestion as farCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleQuestion as fasCircleQuestion,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

library.add(farCircleQuestion, fasCircleQuestion, faAngleRight);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
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
