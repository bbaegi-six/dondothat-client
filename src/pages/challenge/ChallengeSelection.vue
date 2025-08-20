<template>
  <div class="flex flex-col h-screen bg-default" ref="selectionContainer">
    <!-- Top Section (Timer, Title, Subtitle) -->
    <div class="flex flex-col items-center pt-20 sm:pt-24 md:pt-30 pb-4 fade-in">
      <div class="relative mb-6">
        <div class="w-20 h-20 sm:w-24 sm:h-24 relative">
          <!-- Background Circle -->
          <svg class="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90" viewBox="0 0 80 80">
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
            <span class="text-white text-3xl sm:text-4xl font-normal font-pretendard">{{
              timeLeft
            }}</span>
          </div>
        </div>
      </div>

      <!-- Main Title -->
      <h1 class="text-white text-lg sm:text-xl font-bold text-center mb-2 font-pretendard px-4">
        원하는 챌린지를 선택해주세요
      </h1>

      <!-- Subtitle -->
      <div class="text-white/90 text-xs sm:text-sm text-center font-pretendard mb-6 sm:mb-8 px-4">
        <p>30초 후에 선택하지 않으면</p>
        <p>AI 추천 챌린지가 선택됩니다</p>
      </div>
    </div>

    <!-- Spacer to push content to bottom -->
    <div class="flex-grow"></div>

    <!-- Fixed Bottom Section (Challenge Cards + Button) -->
    <div>
      <!-- Challenge Cards - Bottom Section -->
      <div class="px-4 sm:px-6 pb-4">
        <div
          :class="[
            'space-y-4 flex flex-col items-center',
            { 'fade-out': isLeaving },
          ]"
        >
          <button
            v-for="(challenge, index) in challenges"
            :key="challenge.challengeId"
            @click="selectChallenge(challenge.challengeId)"
            :class="[
              'w-full max-w-md h-20 sm:h-24 bg-default border-2 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-colors fade-in mx-auto',
              selectedChallenge === challenge.challengeId
                ? 'border-brand'
                : 'border-gray-1',
            ]"
            :style="{ 'animation-delay': `${0.1 * index}s` }"
          >
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-1 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i
                :class="getCategoryIconByTitle(challenge.title)"
                :style="{ color: getCategoryColorByTitle(challenge.title) }"
              ></i>
            </div>
            <div class="flex-1 text-left min-w-0">
              <h3 class="text-white text-sm sm:text-base font-bold">
                {{ challenge.title }}
                <span v-if="index === 0" class="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white bg-[#ff5555] rounded-full">AI 추천</span>
              </h3>
              <p class="text-gray-3 text-xs sm:text-sm truncate">{{ challenge.summary }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Selection Button - Just above nav -->
      <div
        :class="[
          'px-4 sm:px-6 pt-0 pb-20 fade-in fade-in-delay-1',
          { 'fade-out': isLeaving },
        ]"
      >
        <button
          :disabled="!selectedChallenge"
          @click="startChallenge"
          :class="[
            'w-full max-w-md h-12 sm:h-14 rounded-2xl font-normal transition mx-auto block',
            selectedChallenge
              ? 'bg-brand text-white hover:bg-red-600'
              : 'bg-gray-5 text-gray-2',
          ]"
        >
          <span class="text-sm sm:text-base">{{
            selectedChallenge
              ? '선택한 챌린지 시작하기'
              : '챌린지를 선택해주세요'
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useExpensesStore } from '@/stores/expenses';

const props = defineProps({
  challenges: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['challenge-selected']);

const expensesStore = useExpensesStore();
const selectedChallenge = ref(null);
const timeLeft = ref(30);
const timerInterval = ref(null);
const selectionContainer = ref(null);
const isLeaving = ref(false);

const circumference = 2 * Math.PI * 36.5;

const dashOffset = computed(() => {
  const progress = timeLeft.value / 30;
  return circumference * (1 - progress);
});

const getCategoryData = (categoryId) => {
  const categoryName = Object.keys(expensesStore.categoryMasterData).find(
    (name) => expensesStore.categoryMasterData[name].id === categoryId
  );
  return (
    expensesStore.categoryMasterData[categoryName] ||
    expensesStore.categoryMasterData['그외']
  );
};

const getCategoryByTitle = (challengeTitle) => {
  // 챌린지 제목을 기반으로 카테고리 매핑
  const titleToCategoryMap = {
    '카페': '카페',
    '배달': '배달음식',
    '쇼핑': '쇼핑',
    '택시': '택시',
    '편의점': '편의점',
    '마트': '생활',
    '온라인': '쇼핑',
    '술': '술',
    '담배': '술',
    '버스': '교통',
    '문화': '문화',
    '영화': '문화',
    '공연': '문화',
    '도서': '문화',
    '전시': '문화',
    '교통': '교통',
    '지하철': '교통',
    '기차': '교통',
    '의료': '의료',
    '병원': '의료',
    '약국': '의료',
    '생활': '생활',
    '마트': '생활',
    '식비': '식비',
    '음식': '식비',
    '식당': '식비'
  };
  
  // 챌린지 제목에서 키워드를 찾아 매핑
  for (const [keyword, category] of Object.entries(titleToCategoryMap)) {
    if (challengeTitle.includes(keyword)) {
      return category;
    }
  }
  
  return '그외'; // 기본값
};

const getCategoryIconByTitle = (challengeTitle) => {
  const categoryName = getCategoryByTitle(challengeTitle);
  const data = expensesStore.categoryMasterData[categoryName] || expensesStore.categoryMasterData['그외'];
  return data ? `${data.icon} text-lg sm:text-xl` : 'fas fa-question-circle text-lg sm:text-xl';
};

const getCategoryColorByTitle = (challengeTitle) => {
  const categoryName = getCategoryByTitle(challengeTitle);
  const data = expensesStore.categoryMasterData[categoryName] || expensesStore.categoryMasterData['그외'];
  return data ? data.color : '#ffffff';
};

const getCategoryIcon = (categoryId) => {
  const data = getCategoryData(categoryId);
  return data ? `${data.icon} text-lg sm:text-xl` : 'fas fa-question-circle text-lg sm:text-xl';
};

const getCategoryColor = (categoryId) => {
  const data = getCategoryData(categoryId);
  return data ? data.color : '#ffffff';
};

const selectChallenge = (challengeId) => {
  selectedChallenge.value = challengeId;
};

const startChallenge = () => {
  if (selectedChallenge.value) {
    isLeaving.value = true; // Trigger fade-out animation
    setTimeout(() => {
      emit('challenge-selected', selectedChallenge.value);
    }, 500); // Match this duration with the fade-out animation duration
  }
};

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    timeLeft.value--;

    if (timeLeft.value <= 0) {
      clearInterval(timerInterval.value);
      if (props.challenges && props.challenges.length > 0) {
        // Select the first challenge (AI recommended)
        selectedChallenge.value = props.challenges[0].challengeId;

        setTimeout(() => {
          startChallenge();
        }, 500);
      }
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

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fade-in {
  opacity: 0; /* Ensure it starts invisible */
  animation: fadeIn 0.6s ease-out forwards;
}

.fade-in-delay-1 {
  animation-delay: 0.3s;
}

.fade-out {
  animation: fadeOut 0.5s ease-out forwards;
}
</style>
