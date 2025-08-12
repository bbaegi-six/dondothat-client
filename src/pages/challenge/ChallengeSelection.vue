<template>
    <div class="flex flex-col h-screen bg-default">
      <!-- Header -->
      <Header 
        :show-logo="true" 
        :show-points="true" 
        :points="1250" 
      />
  
      <!-- Main Title -->
      <div class="flex flex-col items-center pt-[60px] pb-4">
        <h1 class="text-white text-xl font-bold text-center mb-2 font-pretendard">
          원하는 챌린지를 선택해주세요
        </h1>
      </div>
  
      <!-- Middle Spacer -->
      <div class="flex-1"></div>
  
      <!-- Challenge Cards - Bottom Section -->
      <div class="px-4 pb-4">
        <div class="space-y-4 flex flex-col items-center">
          <button 
            v-for="challenge in recommendedChallengesStore.challenges"
            :key="challenge.challengeId"
            @click="selectChallenge(challenge)"
            :class="[
              'w-[328px] h-[98px] bg-default border-2 rounded-2xl p-4 flex items-center gap-4 transition-colors',
              selectedChallenge && selectedChallenge.challengeId === challenge.challengeId ? 'border-brand' : 'border-gray-1'
            ]"
          >
            <div class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center">
              <i :class="[getCategoryIcon(challenge.categoryId), 'text-white', 'text-2xl']"></i>
            </div>
            <div class="flex-1 text-left">
              <h3 class="text-white text-base font-bold">{{ challenge.title }}</h3>
              <p class="text-gray-3 text-sm">{{ challenge.summary }}</p>
            </div>
          </button>
        </div>
      </div>
  
      <!-- Selection Button - Just above nav -->
      <div class="px-8 pb-[90px]">
        <button
          :disabled="!selectedChallenge"
          @click="startChallenge"
          :class="[
            'w-[328px] h-[56px] rounded-2xl font-normal transition',
            selectedChallenge 
              ? 'bg-brand text-white hover:bg-red-600' 
              : 'bg-gray-5 text-gray-2'
          ]"
        >
          {{ selectedChallenge ? '선택한 챌린지 시작하기' : '챌린지를 선택해주세요' }}
        </button>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/layout/Header.vue';
import { useRecommendedChallengesStore } from '@/stores/recommendedChallenges';
import { useExpensesStore } from '@/stores/expenses';

const recommendedChallengesStore = useRecommendedChallengesStore();
const expensesStore = useExpensesStore();
const selectedChallenge = ref(null);

const getCategoryIcon = (categoryId) => {
  const category = Object.values(expensesStore.categoryMasterData).find(cat => cat.id === categoryId);
  return category ? category.icon : 'fas fa-question-circle';
};

const selectChallenge = (challenge) => {
  selectedChallenge.value = challenge;
};

const startChallenge = () => {
  if (selectedChallenge.value) {
    console.log(`선택된 챌린지: ${selectedChallenge.value.title}`);
    // Here you would typically navigate to the next step of the challenge flow,
    // passing the selected challenge's ID or data.
    // For example: router.push({ name: 'ChallengeDaysInput', params: { challengeId: selectedChallenge.value.challengeId } });
  }
};
</script>