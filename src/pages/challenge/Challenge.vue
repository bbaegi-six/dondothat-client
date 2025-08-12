<!-- challenge.vue -->
<template>
  <div>
    <!-- 진행 중인 챌린지가 있는 경우 -->
    <ChallengeProgress v-if="showProgress" :challenge-data="challengeData" />

    <!-- 실패한 챌린지가 있는 경우 -->
    <ChallengeFailed v-else-if="showFailed" :challenge-data="challengeData" />

    <!-- 참여 중인 챌린지가 없는 경우 (기본 화면) -->
    <div v-else class="flex flex-col h-screen">
      <!-- Main Content Area -->
      <div
        class="flex-1 flex items-center justify-center pt-[60px] pb-[90px] px-5"
      >
        <!-- Empty State Container - 328 × 296 -->
        <div
          class="w-[328px] h-[296px] text-center flex flex-col justify-center"
        >
          <!-- Icon Circle - 하얀색 배경 -->
          <div
            class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <i class="fas fa-trophy text-4xl" style="color: #ff5555"></i>
          </div>

          <!-- Main Text -->
          <h2
            class="text-white text-2xl font-bold mb-6 leading-tight font-pretendard"
          >
            아직 참여 중인<br />
            챌린지가 없어요
          </h2>

          <!-- Subtitle -->
          <div class="text-white text-base font-pretendard space-y-1 mb-12">
            <p>새로운 도전을 통해</p>
            <p>소비 습관을 개선해볼까요?</p>
          </div>
        </div>
      </div>

      <!-- Start Challenge Button - 컨테이너 밖으로 분리 -->
      <div class="px-8 pb-[90px]">
        <Button :disabled="false" @click="startChallenge" class="font-normal">
          챌린지 시작하기
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/Button.vue';
import ChallengeProgress from './ChallengeProgress.vue';
import ChallengeFailed from './ChallengeFailed.vue';
import challengeService from '@/services/challengeService';

const router = useRouter();
const authStore = useAuthStore();

// 화면 상태 관리
const showProgress = ref(false);
const showFailed = ref(false);

// 백엔드에서 받아온 챌린지 데이터
const challengeData = ref(null);

// 새 챌린지 시작
const startChallenge = () => {
  router.push('/challenge/flow');
  // 저금통 계좌가 연결되지 않은 경우
  if (!authStore.user.savingConnected) {
    // 저금통 계좌 연결 페이지로 이동 (connectsub.vue)
    router.push('/challenge/connectsub');
  } else {
    // 저금통 계좌가 연결된 경우 바로 챌린지 플로우로 이동
    router.push('/challenge/flow');
  }
};

// 페이지 로드 시 진척도 확인
const checkCurrentChallenge = async () => {
  try {
    console.log('📊 챌린지 진척도 조회 중...');
    const result = await challengeService.getProgress();

    if (result && result.user_challenge_id) {
      console.log('✅ 진행 중인 챌린지 발견:', result);

      // 백엔드 데이터 저장
      challengeData.value = {
        userChallengeId: result.user_challenge_id,
        challengeId: result.challenge_id,
        title: result.title,
        status: result.status,
        period: result.period,
        progress: result.progress,
        saving: result.saving,
      };

      // 상태에 따른 화면 분기
      if (result.status === 'failed') {
        console.log('❌ 실패한 챌린지 - ChallengeFailed 표시');
        showFailed.value = true;
      } else if (result.status === 'ongoing' || result.status === 'completed') {
        console.log('✅ 진행중/완료 챌린지 - ChallengeProgress 표시');
        showProgress.value = true;
      } else {
        console.log('⚠️ 알 수 없는 상태:', result.status);
        // 기본 화면 유지
      }
    } else {
      console.log('📭 진행 중인 챌린지 없음 - 기본 화면 표시');
      // 모든 상태를 false로 유지하여 기본 화면 표시
    }
  } catch (error) {
    console.error('❌ 챌린지 상태 확인 실패:', error);
    // 에러 시에도 기본 화면 유지
  }
};

onMounted(() => {
  checkCurrentChallenge();
});

// 개발자 도구용 함수들
if (process.env.NODE_ENV === 'development') {
  window.testChallengeStates = () => {
    console.log('🧪 테스트용 상태 변경 함수들:');
    console.log('- testOngoing() : 진행중 챌린지');
    console.log('- testCompleted() : 완료된 챌린지');
    console.log('- testFailed() : 실패한 챌린지');
    console.log('- testEmpty() : 챌린지 없음');
    console.log('- testFlow() : 플로우 테스트');
  };

  window.testOngoing = () => {
    challengeData.value = {
      userChallengeId: 3,
      challengeId: 1,
      title: '배달음식 금지 챌린지',
      status: 'ongoing',
      period: 10,
      progress: 2,
      saving: 5000,
    };
    showProgress.value = true;
    showFailed.value = false;
    showChallengeFlow.value = false;
  };

  window.testCompleted = () => {
    challengeData.value = {
      userChallengeId: 3,
      challengeId: 1,
      title: '배달음식 금지 챌린지',
      status: 'completed',
      period: 10,
      progress: 10,
      saving: 50000,
    };
    showProgress.value = true;
    showFailed.value = false;
    showChallengeFlow.value = false;
  };

  window.testFailed = () => {
    challengeData.value = {
      userChallengeId: 3,
      challengeId: 1,
      title: '배달음식 금지 챌린지',
      status: 'failed',
      period: 10,
      progress: 5,
      saving: 25000,
    };
    showFailed.value = true;
    showProgress.value = false;
    showChallengeFlow.value = false;
  };

  window.testEmpty = () => {
    challengeData.value = null;
    showProgress.value = false;
    showFailed.value = false;
    showChallengeFlow.value = false;
  };

  window.testFlow = () => {
    router.push('/challenge/flow');
  };

  console.log('🧪 개발 모드: 테스트 함수들 등록 완료');
  console.log('사용법: testChallengeStates() 호출 후 원하는 함수 실행');
}
</script>

<style scoped>
/* 고정 크기 스타일 - 반응형 없음 */
</style>
