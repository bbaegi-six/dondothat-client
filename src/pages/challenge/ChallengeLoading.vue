<!-- ChallengeLoading.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- Title Section - 타이머와 동일한 위치에서 제거 -->
    <div class="flex flex-col items-center pt-[60px] pb-4">
      <!-- 빈 공간 유지 -->
    </div>

    <!-- Loading Content - 중앙 배치 -->
    <div class="flex-1 flex flex-col items-center justify-center px-8">
      <!-- Loading Icon -->
      <div class="w-16 h-16 mb-8">
        <svg
          class="w-16 h-16 text-white animate-spin-slow"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
          />
        </svg>
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

    <!-- Bottom Space - 원본과 동일한 여백 -->
    <div class="px-8 pb-[90px]">
      <!-- 빈 공간 유지 -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import challengeService from '@/services/challengeService';

const emit = defineEmits(['loading-complete']);

const fetchRecommendations = async () => {
  try {
    // .data를 제거하여 서비스에서 반환된 데이터 배열을 직접 사용합니다.
    const challenges = await challengeService.getRecommendations();
    return challenges;
  } catch (error) {
    console.error('추천 챌린지 조회 실패:', error);
    // API 실패 시 기본 챌린지 목록 반환
    return [
      { challengeId: 1, title: '배달음식 금지 챌린지', summary: '배달 대신 직접 요리!' },
      { challengeId: 3, title: '쇼핑 금지 챌린지', summary: '불필요한 소비 줄이기!' },
      { challengeId: 7, title: '술 금지 챌린지', summary: '금주 도전!' },
    ];
  }
};

onMounted(async () => {
  console.log('⏳ 챌린지 로딩 시작 - API 호출 및 최소 1.5초 대기');

  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));
  const fetchPromise = fetchRecommendations();

  const [, challenges] = await Promise.all([minLoadingTime, fetchPromise]);

  console.log('✅ 로딩 완료 - 챌린지 목록 조회 완료:', challenges);
  emit('loading-complete', challenges);
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
</style>
