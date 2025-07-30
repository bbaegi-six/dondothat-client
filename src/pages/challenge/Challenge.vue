<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <Header 
      :show-logo="true" 
      :show-points="true" 
      :points="1250" />

    <!-- Main Content Area -->
    <div class="flex-1 flex items-center justify-center pt-[60px] pb-[90px] px-5">
      <!-- Empty State Container - 328 × 296 -->
      <div class="w-[328px] h-[296px] text-center flex flex-col justify-center">
        <!-- Icon Circle - 하얀색 배경 -->
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
          <span class="text-primary-red text-3xl">🏆</span>
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
        label="챌린지 시작하기" 
        :disabled="false"
        @click="startChallenge"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Button from '@/components/Button.vue';

const router = useRouter();

const startChallenge = () => {
  // 챌린지 시작 로직 또는 다음 페이지로 이동
  console.log('챌린지 시작하기 클릭됨');
  // 예: router.push('/challenge/create');
  // 예: router.push('/challenge/list');
};
</script>

<style scoped>
/* 고정 크기 스타일 - 반응형 없음 */
</style>