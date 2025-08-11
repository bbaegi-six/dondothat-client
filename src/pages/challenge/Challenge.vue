<!-- challenge.vue -->
<template>
  <div>
    <!-- Main Challenge Page -->
    <div v-if="!showChallengeFlow" class="flex flex-col h-screen">

      <!-- Main Content Area -->
      <div class="flex-1 flex items-center justify-center pt-[60px] pb-[90px] px-5">
        <!-- Empty State Container - 328 × 296 -->
        <div class="w-[328px] h-[296px] text-center flex flex-col justify-center">
          <!-- Icon Circle - 하얀색 배경 -->
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-trophy text-4xl" style="color: #FF5555;"></i>
          </div>

          <!-- Main Text -->
          <h2 class="text-white text-2xl font-bold mb-6 leading-tight font-pretendard">
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
        <Button 
          :disabled="false"
          @click="startChallenge"
          class="font-normal"
        >
          챌린지 시작하기
        </Button>
      </div>
    </div>

    <!-- Challenge Flow (Loading + Selection) -->
    <ChallengeFlow v-if="showChallengeFlow" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue';
import ChallengeFlow from './ChallengeFlow.vue';
import challengeService from '@/services/challengeService'; // ← 이 부분 추가

const router = useRouter(); // 추가
const showChallengeFlow = ref(false);

const startChallenge = () => {
  router.push('/challenge/loading');
};

// 페이지 로드 시 진척도 확인
const checkCurrentChallenge = async () => {
  try {
    const result = await challengeService.getProgress();
    
    if (result && result.challenge_id) {
      // 진행 중인 챌린지가 있으면 → ChallengeProgress.vue로 이동
      showChallengeFlow.value = true;
    } else {
      // 진행 중인 챌린지가 없으면 → 현재 화면 유지 (피그마 디자인)
      console.log('진행 중인 챌린지 없음');
    }
  } catch (error) {
    console.error('챌린지 상태 확인 실패:', error);
    // 에러 시에도 메인 화면 유지
  }
};

onMounted(() => {
  checkCurrentChallenge();
});
</script>

<style scoped>
/* 고정 크기 스타일 - 반응형 없음 */
</style> 