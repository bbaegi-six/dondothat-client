<template>
  <div class="app-container">
    <router-view />
    <Nav v-if="shouldShowNav" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Nav from '@/components/layout/Nav.vue';

const route = useRoute();
const shouldShowNav = computed(() => {
  const noNavRoutes = ['/login', '/register', '/forgot-password'];
  return !noNavRoutes.includes(route.path);
});
</script>

<style scoped>
.app-container {
  width: 390px;
  height: 100vh;
  background-color: #2f2f2f;
  position: relative;
  margin: 0 auto;
  font-family: 'Pretendard', sans-serif;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

@media (max-width: 430px) {
  .app-container {
    width: 100%;
  }
}
</style>
