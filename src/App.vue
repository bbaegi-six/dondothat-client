<template>
  <div
    class="w-[390px] h-screen bg-dark-bg relative mx-auto font-pretendard flex flex-col"
  >
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
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
@media (max-width: 430px) {
  .w-\[390px\] {
    width: 100%;
  }
}
</style>
