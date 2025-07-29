<!-- step4processing.vue -->
<template>
  <div class="flex flex-col h-full px-5 relative">
    <!-- Loading State -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <!-- Loading Animation -->
      <div class="w-16 h-16 mx-auto mb-6 relative">
        <div
          class="w-16 h-16 border-4 border-[#FF5555] border-t-transparent rounded-full animate-spin"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg
            class="w-6 h-6 text-[#FF5555]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
            />
          </svg>
        </div>
      </div>

      <!-- Text Content -->
      <h2 class="text-lg font-semibold mb-2 text-white">계좌 정보 확인 중</h2>
      <p class="text-gray-400 text-sm">
        안전한 연결을 위해 잠시만 기다려 주세요
      </p>
    </div>

    <!-- Additional Info - Fixed at bottom -->
    <div class="pb-10">
      <div class="flex justify-center">
        <div class="w-[328px] bg-[#414141] rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <!-- Time Icon -->
            <svg
              class="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              />
            </svg>
            <span class="text-white text-sm font-medium">예상 완료 시간</span>
          </div>
          <p class="text-gray-300 text-xs">약 30초 ~ 1분 정도 소요됩니다.</p>
          <p class="text-gray-300 text-xs">
            은행 서버 상황에 따라 시간이 다를 수 있어요
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(['next']);

onMounted(() => {
  // 3초 후 무조건 성공으로 step5로 이동
  setTimeout(() => {
    emit('next');
  }, 3000);
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
