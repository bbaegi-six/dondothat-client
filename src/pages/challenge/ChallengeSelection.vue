<template>
    <div class="flex flex-col h-screen bg-default">
  
      <!-- Timer Circle - Top Section -->
      <div class="flex flex-col items-center pt-[120px] pb-4">
        <div class="relative mb-6">
          <div class="w-20 h-20 relative">
            <!-- Background Circle -->
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle 
                cx="40" 
                cy="40" 
                r="36.5" 
                stroke="#414141" 
                stroke-width="7" 
                fill="none"
              />
              <!-- Progress Circle -->
              <circle 
                cx="40" 
                cy="40" 
                r="36.5" 
                stroke="#FF5555" 
                stroke-width="7" 
                fill="none"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
                stroke-linecap="round"
                class="transition-all duration-1000 ease-linear"
              />
            </svg>
            <!-- Timer Number -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white text-2xl font-normal font-pretendard">{{ timeLeft }}</span>
            </div>
          </div>
        </div>

        <!-- Main Title -->
        <h1 class="text-white text-xl font-bold text-center mb-2 font-pretendard">
          원하는 챌린지를 선택해주세요
        </h1>
      </div>

      <!-- Middle Spacer to push content down -->
      <div class="flex-1"></div>
  
      <!-- Middle Spacer -->
  
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
              <i :class="[getCategoryIcon(challenge.categoryId).icon, 'text-2xl']" :style="{ color: getCategoryIcon(challenge.categoryId).color }"></i>
            </div>
            <div class="flex-1 text-left">
              <h3 class="text-white text-base font-bold">{{ challenge.title }}</h3>
              <p class="text-gray-3 text-sm">{{ challenge.summary }}</p>
            </div>
          </button>
        </div>
      </div>
  
      <!-- Selection Button - Just above nav -->
      <div class="px-8 pb-8">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Header from '@/components/layout/Header.vue';
import { useRecommendedChallengesStore } from '@/stores/recommendedChallenges';
import { useExpensesStore } from '@/stores/expenses';

const recommendedChallengesStore = useRecommendedChallengesStore();
const expensesStore = useExpensesStore();
const selectedChallenge = ref(null);

// Timer related state and logic
const timeLeft = ref(30);
const timerInterval = ref(null);
const circumference = 2 * Math.PI * 36.5; // 2πr for the circle

const dashOffset = computed(() => {
  const progress = timeLeft.value / 30;
  return circumference * (1 - progress);
});

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval.value);
      // Handle timer expiration here, e.g., select a default challenge or navigate
      console.log('Timer expired! No challenge selected.');
      // Optionally, you could automatically select the first challenge or navigate away
      // if (!selectedChallenge.value && recommendedChallengesStore.challenges.length > 0) {
      //   selectChallenge(recommendedChallengesStore.challenges[0]);
      //   startChallenge();
      // }
    }
  }, 1000);
};

const getCategoryIcon = (categoryId) => {
  if (!expensesStore.categoryMasterData) return { icon: 'fas fa-question-circle', color: '#c9c9c9' };
  const category = Object.values(expensesStore.categoryMasterData).find(cat => cat.id === categoryId);
  return category ? { icon: category.icon, color: category.color } : { icon: 'fas fa-question-circle', color: '#c9c9c9' };
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

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>