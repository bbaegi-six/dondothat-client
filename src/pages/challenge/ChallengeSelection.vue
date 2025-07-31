<template>
    <div class="flex flex-col h-screen bg-default">
      <!-- Header -->
      <Header 
        :show-logo="true" 
        :show-points="true" 
        :points="1250" 
      />
  
      <!-- Timer Circle - Top Section -->
      <div class="flex flex-col items-center pt-[60px] pb-4">
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
        <div class="text-white/90 text-sm text-center font-pretendard">
          <p>30초 후에 선택하지 않으면</p>
          <p>AI 추천 챌린지가 선택됩니다</p>
        </div>
      </div>
  
      <!-- Middle Spacer -->
      <div class="flex-1"></div>
  
      <!-- Challenge Cards - Bottom Section -->
      <div class="px-4 pb-4">
        <div class="space-y-4 flex flex-col items-center">
          <!-- 카페 금지 챌린지 -->
          <button 
            @click="selectChallenge('cafe')"
            :class="[
              'w-[328px] h-[98px] bg-default border-2 rounded-2xl p-4 flex items-center gap-4 transition-colors',
              selectedChallenge === 'cafe' ? 'border-brand' : 'border-gray-1'
            ]"
          >
            <div class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-cafe" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21V19H20V21H2M20,8V5L18,5V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"/>
              </svg>
            </div>
            <div class="flex-1 text-left">
              <h3 class="text-white text-base font-bold">카페 금지 챌린지</h3>
              <p class="text-gray-3 text-sm">카페에서 결제하지 않기</p>
            </div>
          </button>
  
          <!-- 배달 음식 금지 챌린지 -->
          <button 
            @click="selectChallenge('delivery')"
            :class="[
              'w-[328px] h-[98px] bg-default border-2 rounded-2xl p-4 flex items-center gap-4 transition-colors',
              selectedChallenge === 'delivery' ? 'border-brand' : 'border-gray-1'
            ]"
          >
            <div class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-delivery" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,7C19.74,7 20.38,7.37 20.73,7.93L23.73,12.93C23.9,13.21 24,13.53 24,13.86V18A1,1 0 0,1 23,19H21A3,3 0 0,1 18,22A3,3 0 0,1 15,19H9A3,3 0 0,1 6,22A3,3 0 0,1 3,19H1A1,1 0 0,1 0,18V6A1,1 0 0,1 1,5H17A1,1 0 0,1 18,6V7H19M18,9.5V13H22V13.86L19.5,9.5H18M6,17.5A1.5,1.5 0 0,0 4.5,19A1.5,1.5 0 0,0 6,20.5A1.5,1.5 0 0,0 7.5,19A1.5,1.5 0 0,0 6,17.5M18,17.5A1.5,1.5 0 0,0 16.5,19A1.5,1.5 0 0,0 18,20.5A1.5,1.5 0 0,0 19.5,19A1.5,1.5 0 0,0 18,17.5Z"/>
              </svg>
            </div>
            <div class="flex-1 text-left">
              <h3 class="text-white text-base font-bold">배달 음식 금지 챌린지</h3>
              <p class="text-gray-3 text-sm">배달 음식 시키지 않기</p>
            </div>
          </button>
  
          <!-- 택시 금지 챌린지 -->
          <button 
            @click="selectChallenge('taxi')"
            :class="[
              'w-[328px] h-[98px] bg-default border-2 rounded-2xl p-4 flex items-center gap-4 transition-colors',
              selectedChallenge === 'taxi' ? 'border-brand' : 'border-gray-1'
            ]"
          >
            <div class="w-12 h-12 bg-gray-1 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-taxi" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H15V4A2,2 0 0,0 13,2H11A2,2 0 0,0 9,4V5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,7H17.5L19,11H5L6.5,7M7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16M16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16Z"/>
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
              : 'bg-gray-5 text-gray-2'
          ]"
        >
          {{ selectedChallenge ? '선택한 챌린지 시작하기' : '챌린지를 선택해주세요' }}
        </button>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Header from '@/components/layout/Header.vue';

// Emit 이벤트 정의
const emit = defineEmits(['challenge-selected']);

const selectedChallenge = ref(null);
const timeLeft = ref(30);
const timerInterval = ref(null);

const circumference = 2 * Math.PI * 36.5; // 2πr

const dashOffset = computed(() => {
  const progress = timeLeft.value / 30;
  return circumference * (1 - progress);
});

const selectChallenge = (challenge) => {
  selectedChallenge.value = challenge;
};

const startChallenge = () => {
  if (selectedChallenge.value) {
    console.log(`선택된 챌린지: ${selectedChallenge.value}`);
    // 부모 컴포넌트(ChallengeFlow)에 이벤트 전달
    emit('challenge-selected', selectedChallenge.value);
  }
};

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    timeLeft.value--;
    
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval.value);
      // 시간 초과 시 랜덤 선택
      const challenges = ['cafe', 'delivery', 'taxi'];
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      selectedChallenge.value = randomChallenge;
      
      setTimeout(() => {
        startChallenge();
      }, 500);
    }
  }, 1000);
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
/* 추가 스타일 */
</style>