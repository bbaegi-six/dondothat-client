<template>
    <div>
      <!-- 1단계: Loading -->
      <ChallengeLoading 
        v-if="currentStep === 'loading'"
        @loading-complete="handleLoadingComplete"
      />
      
      <!-- 2단계: Selection -->
      <ChallengeSelection 
        v-else-if="currentStep === 'selection'"
        @challenge-selected="handleChallengeSelected"
      />
      
      <!-- 3단계: Days Input -->
      <ChallengeDaysInput 
        v-else-if="currentStep === 'days-input'"
        :selected-challenge="selectedChallenge"
        @date-complete="handleDateComplete"
      />
      
      <!-- 4단계: Progress -->
      <ChallengeProgress 
        v-else-if="currentStep === 'progress'"
        :selected-challenge="selectedChallenge"
        :challenge-days="challengeDays"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ChallengeLoading from './ChallengeLoading.vue';
  import ChallengeSelection from './ChallengeSelection.vue';
  import ChallengeDaysInput from './ChallengeDaysInput.vue';
  import ChallengeProgress from './ChallengeProgress.vue';
  
  const currentStep = ref('loading');
  const selectedChallenge = ref(null);
  const challengeDays = ref(0);
  
  const handleLoadingComplete = () => {
    console.log('✅ 로딩 완료 → 선택 페이지로');
    currentStep.value = 'selection';
  };
  
  const handleChallengeSelected = (challenge) => {
    console.log('✅ 챌린지 선택됨:', challenge);
    selectedChallenge.value = challenge;
    currentStep.value = 'days-input';
  };
  
  const handleDateComplete = (data) => {
    console.log('✅ 날짜 입력 완료:', data);
    // 챌린지 데이터 저장
    selectedChallenge.value = data.challenge;
    challengeDays.value = data.days;
    
    // 진행 현황 페이지로 이동
    currentStep.value = 'progress';
    
    console.log(`🎯 ${data.challenge} 챌린지 ${data.days}일 시작!`);
  };
  </script>
  
  <style scoped>
  /* 페이지 전환 애니메이션 */
  </style>