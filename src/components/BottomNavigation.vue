<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
    <nav class="flex justify-around max-w-screen-sm mx-auto">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="p-4 text-center text-gray-600 hover:text-blue-600"
      >
        <div class="text-xs">{{ item.label }}</div>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navItems = ref([
  { name: 'Dashboard', path: '/dashboard', label: '대시보드' },
  { name: 'Transactions', path: '/transactions', label: '거래내역' },
  { name: 'Analytics', path: '/analytics', label: '분석' },
  { name: 'Profile', path: '/profile', label: '프로필' }
])
</script>

<style scoped>
.router-link-active {
  color: #2563eb; /* text-blue-600 */
  font-weight: bold;
}
</style>
