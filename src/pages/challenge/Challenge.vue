<!-- challenge.vue -->
<template>
  <div>
    <!-- API 로딩 완료 후에만 렌더링 -->
    <template v-if="!challengeStore.isLoading">
      <!-- 진행 중인 챌린지가 있는 경우 -->
      <ChallengeProgress
        v-if="showProgress"
        :challenge-data="challengeStore.activeChallenge"
      />

      <!-- 실패한 챌린지가 있는 경우 -->
      <ChallengeFailed
        v-else-if="showFailed"
        :challenge-data="challengeStore.activeChallenge"
      />

      <!-- 참여 중인 챌린지가 없는 경우 (기본 화면) -->
      <div
        v-else
        :class="['flex flex-col h-screen pt-[10vh]', { 'is-leaving': isLeaving }]"
      >
      <!-- Main Content Area -->
      <div
        class="flex-1 flex items-center justify-center pt-15 pb-20 px-5 slide-up-animation"
      >
        <!-- Empty State Container - 328 × 296 -->
        <div
          class="w-82 h-74 text-center flex flex-col justify-center"
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
      <div
        class="px-8 pb-20 slide-up-animation"
        style="animation-delay: 0.2s"
      >
        <Button :disabled="false" @click="startChallenge" class="font-normal">
          챌린지 시작하기
        </Button>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useChallengeStore } from '@/stores/challenge';
import Button from '@/components/ui/Button.vue';
import challengeService from '@/services/challengeService';
import ChallengeProgress from './ChallengeProgress.vue';
import ChallengeFailed from './ChallengeFailed.vue';
import { initChallengeDevTools } from '@/utils/challengeDevTools';

const router = useRouter();
const authStore = useAuthStore();
const challengeStore = useChallengeStore();

// 화면 상태 관리
const showProgress = ref(false);
const showFailed = ref(false);
const isLeaving = ref(false); // New reactive variable for leaving animation

// 새 챌린지 시작
const startChallenge = () => {
  isLeaving.value = true; // Trigger leaving animation
  setTimeout(() => {
    // 저금통 계좌가 연결되지 않은 경우
    if (!authStore.user.savingConnected) {
      // 저금통 계좌 연결 페이지로 이동 (connectsub.vue)
      router.push('/challenge/connectsub');
    } else {
      // 저금통 계좌가 연결된 경우 바로 챌린지 플로우로 이동
      router.push('/challenge/flow');
    }
  }, 500);
};

// 페이지 로드 시 진척도 확인
onMounted(async () => {
  try {
    // 홈에서 이미 로드된 데이터가 있으면 API 호출 스킵 (성능 최적화)
    // 단, userChallengeData가 null이거나 activeChallenge가 초기 상태면 새로 로드
    if (!challengeStore.userChallengeData || challengeStore.activeChallenge.status === 'NONE') {
      await challengeStore.fetchChallengeProgress();
    }

    // 스토어의 activeChallenge를 기반으로 화면 상태 설정
    if (challengeStore.activeChallenge.status === 'failed') {
      showFailed.value = true;
    } else if (
      challengeStore.activeChallenge.status === 'ongoing' ||
      challengeStore.activeChallenge.status === 'completed'
    ) {
      showProgress.value = true;
    } else {
      // 챌린지가 없는 경우 (NONE) 또는 알 수 없는 상태
      showProgress.value = false;
      showFailed.value = false;
    }
  } catch (error) {
    console.error('챌린지 정보 로드 실패:', error);
    // 에러 시 기본 상태로 설정
    showProgress.value = false;
    showFailed.value = false;
  }
});

// 개발자 도구 초기화
initChallengeDevTools(challengeStore, router, showProgress, showFailed);
</script>

<style scoped>
/* 고정 크기 스타일 - 반응형 없음 */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px); /* Moves upwards */
  }
}

.slide-up-animation {
  animation: slide-up 0.5s ease-out forwards;
  animation-fill-mode: backwards;
  will-change: opacity, transform;
  transform: translateZ(0); /* GPU 가속 강제 활성화 */
}

.is-leaving .slide-up-animation {
  animation: slide-down 0.5s ease-out forwards;
  will-change: opacity, transform;
  transform: translateZ(0); /* GPU 가속 강제 활성화 */
}
</style>
