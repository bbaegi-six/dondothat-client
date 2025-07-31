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
      
      <!-- 3단계: Days Input - 실제 컴포넌트 사용 -->
      <ChallengeDaysInput 
        v-if="currentStep === 'days-input'"
        :selected-challenge="selectedChallenge"
        @date-complete="handleDateComplete"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ChallengeLoading from './ChallengeLoading.vue';
  import ChallengeSelection from './ChallengeSelection.vue';
  import ChallengeDaysInput from './ChallengeDaysInput.vue'; // 주석 해제!
  
  const currentStep = ref('loading');
  const selectedChallenge = ref(null);
  
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
    // 여기서 다음 단계로 이동하거나 완료 처리
  };
  </script>