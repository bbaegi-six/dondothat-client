<!-- ChallengeLoading.vue -->
<template>
    <div class="flex flex-col h-screen bg-default">
  
      <!-- Title Section - 타이머와 동일한 위치에서 제거 -->
      <div class="flex flex-col items-center pt-[60px] pb-4">
        <!-- 빈 공간 유지 -->
      </div>

      <!-- Loading Text -->
      <h2 class="text-white text-xl font-bold text-center mb-4 font-pretendard">
        AI가 적합한 챌린지를 찾고 있습니다
      </h2>

      <div class="text-white/70 text-sm text-center font-pretendard">
        <p>지난 소비내역을 기준으로</p>
        <p>과소비를 판단합니다</p>
      </div>
    </div>

    <!-- Blurred Challenge Cards - 원본과 동일한 위치 -->
    <div class="px-4 pb-4">
      <div class="space-y-4 flex flex-col items-center blur-sm opacity-50">
        <!-- 카페 금지 챌린지 -->
        <div
          class="w-[328px] h-[98px] bg-default border-2 border-gray-1 rounded-2xl p-4 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-cafe"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M2,21V19H20V21H2M20,8V5L18,5V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"
              />
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="text-white text-base font-bold">카페 금지 챌린지</h3>
            <p class="text-gray-3 text-sm">카페에서 결제하지 않기</p>
          </div>
        </div>

        <!-- 배달음식 금지 챌린지 -->
        <div
          class="w-[328px] h-[98px] bg-default border-2 border-gray-1 rounded-2xl p-4 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-delivery"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M19,7C19.74,7 20.38,7.37 20.73,7.93L23.73,12.93C23.9,13.21 24,13.53 24,13.86V18A1,1 0 0,1 23,19H21A3,3 0 0,1 18,22A3,3 0 0,1 15,19H9A3,3 0 0,1 6,22A3,3 0 0,1 3,19H1A1,1 0 0,1 0,18V6A1,1 0 0,1 1,5H17A1,1 0 0,1 18,6V7H19M18,9.5V13H22V13.86L19.5,9.5H18M6,17.5A1.5,1.5 0 0,0 4.5,19A1.5,1.5 0 0,0 6,20.5A1.5,1.5 0 0,0 7.5,19A1.5,1.5 0 0,0 6,17.5M18,17.5A1.5,1.5 0 0,0 16.5,19A1.5,1.5 0 0,0 18,20.5A1.5,1.5 0 0,0 19.5,19A1.5,1.5 0 0,0 18,17.5Z"
              />
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="text-white text-base font-bold">
              배달 음식 금지 챌린지
            </h3>
            <p class="text-gray-3 text-sm">배달 음식 시키지 않기</p>
          </div>
        </div>

        <!-- 택시 금지 챌린지 -->
        <div
          class="w-[328px] h-[98px] bg-default border-2 border-gray-1 rounded-2xl p-4 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-taxi"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H15V4A2,2 0 0,0 13,2H11A2,2 0 0,0 9,4V5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,7H17.5L19,11H5L6.5,7M7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16M16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16Z"
              />
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="text-white text-base font-bold">택시 금지 챌린지</h3>
            <p class="text-gray-3 text-sm">택시 타지 않기</p>
          </div>
        </div>
      </div>
    </div>
  </template>
<script setup>
import { onMounted } from 'vue';

// Emit 이벤트 정의
const emit = defineEmits(['loading-complete']);

onMounted(() => {
  console.log('⏳ 챌린지 로딩 시작 - 3초 대기');

  // 3초 후 로딩 완료하고 부모에게 신호 전달
  setTimeout(() => {
    console.log('✅ 로딩 완료 - 챌린지 목록 조회 완료');
    emit('loading-complete');
  }, 3000);
});
</script>

<style scoped>
@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}

@keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes spin-slow {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
</style>
