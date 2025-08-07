<template>
  <div class="flex-1 flex items-center justify-center">
    <div class="text-white text-center">
      <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
      <p>챌린지 상태 확인 중...</p>
      <p class="text-xs text-gray-400 mt-2">
        현재 로그인한 사용자의 챌린지 상태를 확인하고 있습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this simple component
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
