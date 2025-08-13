<!-- ChallengeFlow.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- 1단계: Loading -->
    <ChallengeLoading
      v-if="currentStep === 'loading'"
      @loading-complete="handleLoadingComplete"
    />

    <!-- 2단계: Selection -->
    <ChallengeSelection
      v-else-if="currentStep === 'selection'"
      :challenges="availableChallenges"
      @challenge-selected="handleChallengeSelected"
    />

    <!-- 3단계: Days Input -->
    <ChallengeDaysInput
      v-else-if="currentStep === 'days-input'"
      :selected-challenge="selectedChallengeData"
      @date-complete="handleDateComplete"
    />

    <!-- 4단계: Success Message -->
    <div
      v-else-if="currentStep === 'success'"
      class="flex flex-col h-screen bg-default"
    >
      <!-- Success Content -->
      <div class="flex-1 flex flex-col items-center justify-center px-8">
        <!-- Success Icon -->
        <div
          class="w-16 h-16 mb-8 bg-brand rounded-full flex items-center justify-center slide-up-item"
          style="animation-delay: 0.1s"
        >
          <i class="fas fa-check text-white text-2xl"></i>
        </div>

        <!-- Success Message -->
        <h2
          class="text-white text-xl font-bold text-center mb-4 font-pretendard slide-up-item"
          style="animation-delay: 0.2s"
        >
          챌린지 참여가 완료되었습니다!
        </h2>

        <div
          class="text-white/70 text-sm text-center font-pretendard slide-up-item"
          style="animation-delay: 0.3s"
        >
          <p>지금부터 {{ challengeDays }}일 동안 매일 결제 내역을 확인합니다</p>
        </div>
      </div>

      <!-- Complete Button -->
      <div class="px-8 pb-[90px] slide-up-item" style="animation-delay: 0.4s">
        <button
          @click="completeChallenge"
          :disabled="isJoining"
          :class="[
            'w-full text-lg font-medium py-4 rounded-2xl font-pretendard transition',
            isJoining
              ? 'bg-gray-5 text-gray-2 cursor-not-allowed'
              : 'bg-brand text-white hover:bg-red-600',
          ]"
        >
          {{ isJoining ? '처리 중...' : '확인' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChallengeLoading from './ChallengeLoading.vue';
import ChallengeSelection from './ChallengeSelection.vue';
import ChallengeDaysInput from './ChallengeDaysInput.vue';
import challengeService from '@/services/challengeService';

const router = useRouter();

const currentStep = ref('loading');
const availableChallenges = ref([]);
const selectedChallenge = ref(null);
const selectedChallengeData = ref(null);
const challengeDays = ref(0);
const isJoining = ref(false);

const handleLoadingComplete = (challenges) => {
  console.log('✅ 로딩 완료, 받은 챌린지:', challenges);
  availableChallenges.value = challenges;
  currentStep.value = 'selection';
};

const handleChallengeSelected = (challengeId) => {
  console.log('✅ 챌린지 선택됨:', challengeId);
  selectedChallenge.value = challengeId;

  const selected = availableChallenges.value.find(
    (c) => c.challengeId === challengeId
  );
  selectedChallengeData.value = selected || {
    challengeId: challengeId,
    title: '알 수 없는 챌린지',
  };

  currentStep.value = 'days-input';
};

const handleDateComplete = async (data) => {
  console.log('✅ 날짜 입력 완료:', data);
  challengeDays.value = data.days;
  isJoining.value = true;

  try {
    console.log('📤 챌린지 참여 요청:', {
      challengeId: selectedChallenge.value,
      days: data.days,
    });

    await challengeService.joinChallenge(selectedChallenge.value, data.days);

    console.log('✅ 챌린지 참여 성공');
    isJoining.value = false;
    currentStep.value = 'success';
  } catch (error) {
    console.error('❌ 챌린지 참여 실패:', error);
    isJoining.value = false;
    // 에러 처리 (예: 에러 메시지 표시)
  }
};

const completeChallenge = () => {
  console.log('✅ 챌린지 플로우 완료 - Challenge 페이지로 이동');
  router.push('/challenge');
};

// ... (개발자 도구용 함수는 그대로 유지)
</script>

<style scoped>
@keyframes slide-up-item {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up-item {
  animation: slide-up-item 0.5s ease-out forwards;
  opacity: 0;
}
</style>
