<!-- challengeDaysInput.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- Timer Circle - Top Section -->
    <div class="flex flex-col items-center pt-30 pb-4">
      <div class="relative mb-6">
        <div class="w-24 h-24 relative">
          <!-- Background Circle -->
          <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 80 80">
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
            <span class="text-white text-4xl font-normal font-pretendard">{{
              timeLeft
            }}</span>
          </div>
        </div>
      </div>

      <!-- Main Title -->
      <h1 class="text-white text-xl font-bold text-center mb-2 font-pretendard">
        원하는 날짜를 입력해주세요
      </h1>

      <!-- Subtitle -->
      <div class="text-white/90 text-sm text-center font-pretendard">
        <p>30초 후에 선택하지 않으면</p>
        <p>랜덤으로 배정됩니다</p>
      </div>
    </div>

    <!-- Middle Content - 날짜 입력 중앙 배치 -->
    <div class="flex-1 flex flex-col items-center justify-center fade-in">
      <!-- Date Input Field -->
      <div class="flex items-baseline justify-center mb-8">
        <input
          v-model="selectedDays"
          type="number"
          min="7"
          max="35"
          class="text-white text-6xl font-semibold font-pretendard bg-transparent border-none outline-none text-center w-24"
          @input="validateInput"
          @blur="handleBlur"
          placeholder=""
          ref="daysInputRef"
        />
        <span class="text-white text-3xl font-semibold font-pretendard ml-2"
          >일</span
        >
      </div>

      <!-- Date Constraints -->
      <div class="text-gray-3 text-xs text-center font-pretendard">
        * 최소 7일, 최대 35일
      </div>
    </div>

    <!-- Complete Button -->
    <div class="px-8 pb-20 fade-in fade-in-delay-1">
      <button
        @click="completeInput"
        :disabled="!isValidInput"
        :class="[
          'w-full h-14 rounded-2xl font-normal transition font-pretendard',
          isValidInput
            ? 'bg-brand text-white hover:bg-red-600'
            : 'bg-gray-5 text-gray-2 cursor-not-allowed',
        ]"
      >
        입력 완료
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Props
const props = defineProps({
  selectedChallenge: {
    type: Object, // Changed from String to Object
    required: true,
  },
});

// Emits
const emit = defineEmits(['dateComplete']);

// Reactive data
const selectedDays = ref(''); // 빈 문자열로 시작
const timeLeft = ref(30);
const timerInterval = ref(null);
const daysInputRef = ref(null); // Ref for the input element

// Timer calculations
const circumference = 2 * Math.PI * 36.5; // 2πr

const dashOffset = computed(() => {
  const progress = timeLeft.value / 30;
  return circumference * (1 - progress);
});

// 입력값 유효성 검사
const isValidInput = computed(() => {
  const num = Number(selectedDays.value);
  return !isNaN(num) && num >= 7 && num <= 35;
});

// Methods
const validateInput = () => {
  // 숫자가 아닌 문자 제거
  let value = selectedDays.value.replace(/[^0-9]/g, '');
  // 두 자리로 제한
  if (value.length > 2) {
    value = value.slice(0, 2);
  }
  selectedDays.value = value;
};

const handleBlur = () => {
  // 포커스를 잃었을 때는 아무것도 하지 않음 (강제 수정 안함)
  if (selectedDays.value === '') {
    // 빈 값일 때는 그대로 두기
    return;
  }
};

const completeInput = () => {
  if (isValidInput.value) {
    emit('dateComplete', {
      challengeId: props.selectedChallenge.challengeId, // Access challengeId from the object
      days: Number(selectedDays.value),
    });
  }
};

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    timeLeft.value--;

    if (timeLeft.value <= 0) {
      clearInterval(timerInterval.value);
      // 시간 초과 시 랜덤 날짜 선택 (7-35일 사이)
      const randomDays = Math.floor(Math.random() * (35 - 7 + 1)) + 7;
      selectedDays.value = randomDays.toString();

      setTimeout(() => {
        if (isValidInput.value) {
          completeInput();
        }
      }, 500);
    }
  }, 1000);
};

onMounted(() => {
  startTimer();
  // Auto-focus the input field
  if (daysInputRef.value) {
    daysInputRef.value.focus();
  }
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style scoped>
/* 숫자 입력 필드 스타일 */
input[type='number'] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number']:focus {
  outline: none;
  border-bottom: 2px solid #ff5555;
}

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

.fade-in {
  opacity: 0; /* Ensure it starts invisible */
  animation: fadeIn 0.6s ease-out forwards;
}

.fade-in-delay-1 {
  animation-delay: 0.3s;
}
</style>
