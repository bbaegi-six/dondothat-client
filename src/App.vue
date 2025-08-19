<template>
  <div
    class="w-full h-screen bg-dark-bg relative font-pretendard flex flex-col"
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
  const noNavRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/account',
    '/profile/edit',
    '/profile/mychallenge',
    '/challenge/flow',
  ];

  // 다시 디버깅 추가
  console.log('=== 현재 상태 ===');
  console.log('현재 경로:', route.path);
  console.log('noNavRoutes에 포함?:', noNavRoutes.includes(route.path));
  console.log('shouldShowNav:', !noNavRoutes.includes(route.path));

  return !noNavRoutes.includes(route.path);
});
</script>

<style scoped>
* {
  background-color: #2f2f2f;
}
::-webkit-scrollbar {
  display: none;
}
</style>
