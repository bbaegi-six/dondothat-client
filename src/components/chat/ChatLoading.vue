<template>
  <div class="flex-1 flex items-center justify-center">
    <div class="text-white text-center">
      <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
      <p v-if="isLoading">이전 채팅 내용 불러오는 중...</p>
      <p v-else>채팅방에 연결 중...</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
/* Loading spinner animation */
.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
