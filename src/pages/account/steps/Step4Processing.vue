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
    <div class="pb-5">
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
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
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
