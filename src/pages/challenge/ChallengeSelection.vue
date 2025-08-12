<!-- challengeSelection.vue -->
<template>
    <div class="flex flex-col h-screen bg-default">
      <!-- Timer Circle - Top Section -->
      <div class="flex flex-col items-center pt-[120px] pb-4 challenge-card-animation" style="animation-delay: 0.1s;">
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

        <!-- Subtitle -->
        <div class="text-white/70 text-sm text-center font-pretendard">
          <p>30초 후에 선택하지 않으면</p>
          <p>AI 추천 챌린지가 선택됩니다</p>
        </div>
      </div>

      <!-- Middle Spacer to push content down -->
      <div class="flex-1"></div>
  
      <!-- Middle Spacer -->
  
      <!-- Challenge Cards - Bottom Section -->
      <div class="px-4 pb-4">
        <div class="space-y-4 flex flex-col items-center">
          <button 
            v-for="(challenge, index) in recommendedChallengesStore.challenges"
            :key="challenge.challengeId"
            @click="selectChallenge(challenge)"
            :class="[
              'w-[328px] h-[98px] bg-default border-2 rounded-2xl p-4 flex items-center gap-4 transition-colors',
              selectedChallenge && selectedChallenge.challengeId === challenge.challengeId ? 'border-brand' : 'border-gray-1',
              'challenge-card-animation'
            ]"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
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
          @click="selectChallenge('taxi')"
          :class="[
            'w-[328px] h-[56px] rounded-2xl font-normal transition',
            selectedChallenge 
              ? 'bg-brand text-white hover:bg-red-600' 
              : 'bg-gray-5 text-gray-2',
            'challenge-card-animation'
          ]"
          :style="{ 'animation-delay': '0.8s' }"
        >
          <div
            class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-taxi"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H15V4A2,2 0 0,0 13,2H11A2,2 0 0,0 9,4V5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,7H17.5L19,11H5L6.5,7M7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16M16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16Z"
              />
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="text-white text-base font-bold">택시 금지 챌린지</h3>
            <p class="text-gray-3 text-sm">택시 타지 않기</p>
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
            : 'bg-gray-5 text-gray-2',
        ]"
      >
        {{
          selectedChallenge ? '선택한 챌린지 시작하기' : '챌린지를 선택해주세요'
        }}
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
      // 시간 초과 시 랜덤 선택
      const challenges = ['cafe', 'delivery', 'taxi'];
      const randomChallenge =
        challenges[Math.floor(Math.random() * challenges.length)];
      selectedChallenge.value = randomChallenge;

      setTimeout(() => {
        startChallenge();
      }, 500);
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

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.challenge-card-animation {
  opacity: 0; /* Start invisible */
  animation: slide-up 0.5s ease-out forwards;
}
</style>
