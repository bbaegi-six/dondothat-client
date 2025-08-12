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
      :available-challenges="availableChallenges"
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
          class="w-16 h-16 mb-8 bg-brand rounded-full flex items-center justify-center"
        >
          <i class="fas fa-check text-white text-2xl"></i>
        </div>

        <!-- Success Message -->
        <h2
          class="text-white text-xl font-bold text-center mb-4 font-pretendard"
        >
          챌린지 참여가 완료되었습니다!
        </h2>

        <div class="text-white/70 text-sm text-center font-pretendard">
          <p>
            {{
              selectedChallengeData?.title ||
              challengeNames[selectedChallengeData?.type]
            }}
            {{ challengeDays }}일
          </p>
          <p>지금부터 매일 결제 내역을 확인합니다</p>
        </div>
      </div>

      <!-- Complete Button -->
      <div class="px-8 pb-[90px]">
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

// Router
const router = useRouter();

// Emit 이벤트 정의 (라우터 사용 시 필요없음)
// const emit = defineEmits(['flow-complete']);

// 플로우 상태
const currentStep = ref('loading');
const selectedChallenge = ref(null);
const selectedChallengeData = ref(null);
const challengeDays = ref(0);
const isJoining = ref(false);

// 챌린지 이름 매핑
const challengeNames = {
  cafe: '카페 금지',
  delivery: '배달음식 금지',
  taxi: '택시 금지',
};

// 플로우 핸들러들
const handleLoadingComplete = () => {
  console.log('✅ 로딩 완료');
  currentStep.value = 'selection';
};

const handleChallengeSelected = (challenge) => {
  console.log('✅ 챌린지 선택됨:', challenge);
  selectedChallenge.value = challenge;

  // 선택된 챌린지 데이터 설정
  selectedChallengeData.value = {
    type: challenge,
    title: challengeNames[challenge] + ' 챌린지',
  };

  currentStep.value = 'days-input';
};

const handleDateComplete = async (data) => {
  console.log('✅ 날짜 입력 완료:', data);
  selectedChallenge.value = data.challenge;
  challengeDays.value = data.days;
  isJoining.value = true;

  try {
    // 백엔드에 챌린지 참여 요청
    console.log('📤 챌린지 참여 요청:', {
      challenge: data.challenge,
      days: data.days,
    });

    // 실제 API 호출 (challengeService에 구현 필요)
    // const result = await challengeService.joinChallenge(data.challenge, data.days);

    // 임시로 성공 처리
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5초 대기
    console.log('✅ 챌린지 참여 성공');

    isJoining.value = false;
    currentStep.value = 'success';

    // 실제 구현에서는 API 응답에 따라 처리
    // if (result.success) {
    //   currentStep.value = 'success';
    // } else {
    //   console.error('챌린지 참여 실패:', result.error);
    //   // 에러 처리
    // }
  } catch (error) {
    console.error('❌ 챌린지 참여 실패:', error);
    isJoining.value = false;
    // 에러 처리 (예: 에러 메시지 표시)
  }
};

const completeChallenge = () => {
  console.log('✅ 챌린지 플로우 완료 - Challenge 페이지로 이동');

  // Challenge 페이지로 이동 (자동으로 checkCurrentChallenge 호출됨)
  router.push('/challenge');
};

// 개발자 도구용 함수들
if (process.env.NODE_ENV === 'development') {
  window.testChallengeFlow = () => {
    console.log('🧪 챌린지 플로우 테스트 함수들:');
    console.log('- goToSelection() : 선택 화면으로');
    console.log('- goToInput() : 입력 화면으로');
    console.log('- goToSuccess() : 성공 화면으로');
  };

  window.goToSelection = () => {
    currentStep.value = 'selection';
  };

  window.goToInput = () => {
    selectedChallenge.value = 'cafe';
    selectedChallengeData.value = {
      type: 'cafe',
      title: '카페 금지 챌린지',
    };
    currentStep.value = 'days-input';
  };

  window.goToSuccess = () => {
    selectedChallenge.value = 'cafe';
    selectedChallengeData.value = {
      type: 'cafe',
      title: '카페 금지 챌린지',
    };
    challengeDays.value = 14;
    currentStep.value = 'success';
  };

  console.log('🧪 개발 모드: 플로우 테스트 함수들 등록 완료');
}
</script>

<style scoped>
/* 페이지 전환 애니메이션 등 기존 스타일 */
</style>
