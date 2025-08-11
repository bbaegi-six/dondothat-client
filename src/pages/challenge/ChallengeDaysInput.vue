<template>
    <div class="flex flex-col h-screen bg-default">
  
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
          원하는 날짜를 입력해주세요
        </h1>
  
        <!-- Subtitle -->
        <div class="text-white/90 text-sm text-center font-pretendard">
          <p>30초 후에 선택하지 않으면</p>
          <p>랜덤으로 배정됩니다</p>
        </div>
      </div>
  
      <!-- Middle Content - 날짜 입력 중앙 배치 -->
      <div class="flex-1 flex flex-col items-center justify-center">
        <!-- Date Input Field -->
        <div class="flex items-baseline justify-center mb-8">
          <input
            v-model="selectedDays"
            type="number"
            min="7"
            max="35"
            class="text-white text-6xl font-semibold font-pretendard bg-transparent border-none outline-none text-center w-32"
            @input="validateInput"
            @blur="handleBlur"
            placeholder=""
          />
          <span class="text-white text-3xl font-semibold font-pretendard ml-2">일</span>
        </div>
  
        <!-- Date Constraints -->
        <div class="text-gray-3 text-xs text-center font-pretendard">
          * 최소 7일, 최대 35일
        </div>
      </div>
  
      <!-- Complete Button -->
      <div class="px-8 pb-[90px]">
        <button
          @click="completeInput"
          :disabled="!isValidInput"
          :class="[
            'w-[328px] h-[56px] rounded-2xl font-normal transition font-pretendard',
            isValidInput 
              ? 'bg-brand text-white hover:bg-red-600' 
              : 'bg-gray-5 text-gray-2 cursor-not-allowed'
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
      type: String,
      required: true
    }
  });
  
  // Emits
  const emit = defineEmits(['dateComplete']);
  
  // Reactive data
  const selectedDays = ref(''); // 빈 문자열로 시작
  const timeLeft = ref(30);
  const timerInterval = ref(null);
  
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
    selectedDays.value = selectedDays.value.replace(/[^0-9]/g, '');
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
        challenge: props.selectedChallenge,
        days: Number(selectedDays.value)
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
  });
  
  onUnmounted(() => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }
  });
  </script>
  
  <style scoped>
  /* 숫자 입력 필드 스타일 */
  input[type="number"] {
    -webkit-appearance: none;
    -moz-appearance: textfield;
  }
  
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"]:focus {
    outline: none;
    border-bottom: 2px solid #FF5555;
  }
  </style>