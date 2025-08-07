<template>
    <div>
      <!-- 실패한 경우 실패 화면 표시 -->
      <ChallengeFailed 
        v-if="isFailed"
        :selected-challenge="selectedChallenge"
        :challenge-days="challengeDays"
        :failed-day="currentDay"
        :failed-transaction-id="failedTransactionId"
      />
      
      <!-- 성공 또는 진행 중인 경우 기존 화면 표시 -->
      <div v-else class="flex flex-col h-screen bg-default">
        <!-- Header -->
        <Header 
          :show-logo="true" 
          :show-points="true" 
          :points="1250" 
        />
    
        <!-- 저금 완료 상태 -->
        <div v-if="isSavingCompleted" class="flex flex-col items-center justify-center flex-1">
          <!-- Success Icon -->
          <div class="w-12 h-12 rounded-full flex items-center justify-center mb-8" 
               style="background-color: #FF5555;">
            <i class="fas fa-check text-xl text-white"></i>
          </div>
          
          <!-- Amount -->
          <p class="text-white text-3xl font-bold text-center mb-2 font-pretendard">
            {{ savedAmount.toLocaleString() }}원
          </p>
          
          <!-- Status Text -->
          <p class="text-white text-xl font-medium text-center font-pretendard">
            저금 완료
          </p>
        </div>
        
        <!-- Next Button - 네비게이션 바로 위 -->
        <div v-if="isSavingCompleted" class="mx-8 mb-6" style="width: 328px;">
          <button class="w-full bg-brand text-white text-lg font-medium py-4 rounded-2xl font-pretendard"
                  @click="handleNext">
            다음
          </button>
        </div>
    
        <!-- 기존 챌린지 화면 -->
        <div v-else>
          <!-- Challenge Icon & Title -->
          <div class="flex items-center justify-center mt-[70px] mb-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4" 
                 :class="isCompleted ? '' : 'bg-gray-1'"
                 :style="isCompleted ? { backgroundColor: '#FF5555' } : {}">
              <i v-if="isCompleted" class="fas fa-check text-xl text-white"></i>
              <i v-else :class="challengeIcon" class="text-xl" :style="{ color: challengeIconColor }"></i>
            </div>
          </div>
      
          <!-- Challenge Title -->
          <h1 class="text-white text-2xl font-bold text-center mb-2 font-pretendard">
            {{ challengeTitle }}
          </h1>
      
          <!-- Progress Status -->
          <p class="text-white text-sm text-center mb-8 font-pretendard">
            {{ isCompleted ? '도전 성공' : `${currentDay}일차 도전 중` }}
          </p>
      
          <!-- Daily Progress Section - 328px 고정, 높이 동적 -->
          <div class="mx-8 mb-6">
            <h3 class="text-white text-base font-semibold mb-4 font-pretendard">일일 성공 여부</h3>
            
            <!-- Progress Grid - 너비 고정, 높이 동적 -->
            <div class="bg-gray-1 rounded-2xl p-4" style="width: 328px;">
              <!-- Grid Container - 동적 행 수, 한 줄 296x32 -->
              <div class="grid grid-cols-7" style="width: 296px; height: auto; gap: 12px;">
                <div 
                  v-for="day in totalDays" 
                  :key="day"
                  :class="getDayBoxClass(day)"
                  :style="getDayBoxStyle(day)"
                  class="rounded-lg flex items-center justify-center transition-colors"
                  style="width: 32px; height: 32px;"
                >
                  <span class="text-white text-sm font-bold font-pretendard">{{ day }}</span>
                </div>
              </div>
            </div>
          </div>
      
          <!-- Saved Amount Box - 328 x 112 -->
          <div class="mx-8 mb-6 bg-gray-1 rounded-2xl p-6 relative" style="width: 328px; height: 112px;">
            <p class="text-white text-base font-medium text-center mb-2 font-pretendard">
              지금까지 아낀 금액
            </p>
            <p class="text-white text-4xl font-bold text-center font-pretendard">
              {{ savedAmount.toLocaleString() }}원
            </p>
            <!-- Info Icon -->
            <div class="absolute top-4 right-4">
              <i class="fas fa-info-circle text-gray-3 text-sm"></i>
            </div>
          </div>
      
          <!-- Spacer -->
          <div class="flex-1"></div>
      
          <!-- Challenge Info Text or Success Button -->
          <div v-if="isCompleted" class="mx-8 mb-6" style="width: 328px;">
            <!-- Success Button -->
            <button class="w-full bg-brand text-white text-lg font-semibold py-4 rounded-2xl font-pretendard"
                    @click="handleSaving">
              저금 하기
            </button>
          </div>
          <div v-else class="mx-8 mb-6 text-center" style="width: 328px; height: 86px;">
            <p class="text-brand text-xl font-semibold mb-2 font-pretendard">
              {{ challengeStatusText }}
            </p>
            <p class="text-white text-base font-pretendard">
              {{ challengeDescriptionText }}
            </p>
          </div>
        </div>
    
        <!-- Navigation Space -->
        <div class="pb-[90px]"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import Header from '@/components/layout/Header.vue';
  import ChallengeFailed from './ChallengeFailed.vue';
  import challengeService from '@/services/challengeService';
  
  // Props
  const props = defineProps({
    selectedChallenge: {
      type: String,
      required: true
    },
    challengeDays: {
      type: Number,
      required: true
    },
    // 실패 여부와 실패 시점을 외부에서 제어할 수 있도록 추가
    isChallengeFailedProp: {
      type: Boolean,
      default: false
    },
    failedTransactionId: {
      type: String,
      default: null
    }
  });
  
  // Reactive data
  const currentDay = ref(1); // 시작은 1일차부터
  const savedAmount = ref(0);
  const dailyProgress = ref({}); // { 1: 'success', 2: 'fail', 3: 'pending' }
  const isSavingCompleted = ref(false); // 저금 완료 상태
  
  // 실패 여부 확인 - 실제로는 API에서 거래 내역을 체크해서 판단
  const isFailed = ref(props.isChallengeFailedProp);
  
  // Computed properties
  const isCompleted = computed(() => {
    return currentDay.value > props.challengeDays && !isFailed.value;
  });
  
  // Challenge metadata
  const challengeData = {
    cafe: {
      title: '카페 금지 챌린지',
      icon: 'fas fa-coffee', 
      color: '#FF9595',
      categoryText: '카페'
    },
    delivery: {
      title: '배달음식 금지 챌린지',
      icon: 'fas fa-motorcycle',
      color: '#FF7376', 
      categoryText: '배달음식'
    },
    taxi: {
      title: '택시 금지 챌린지',
      icon: 'fas fa-taxi',
      color: '#FFC457',
      categoryText: '택시'
    }
  };
  
  const challengeTitle = computed(() => {
    return challengeData[props.selectedChallenge]?.title || '챌린지';
  });
  
  const challengeIcon = computed(() => {
    return challengeData[props.selectedChallenge]?.icon || 'fas fa-circle';
  });
  
  const challengeIconColor = computed(() => {
    return challengeData[props.selectedChallenge]?.color || '#888888';
  });
  
  const challengeCategoryText = computed(() => {
    return challengeData[props.selectedChallenge]?.categoryText || '해당 카테고리';
  });
  
  const challengeStatusText = computed(() => {
    if (currentDay.value === 1) {
      return '지금부터 챌린지를 시작합니다';
    } else {
      const successDays = currentDay.value - 1;
      return `${successDays}일까지 성공`;
    }
  });
  
  const challengeDescriptionText = computed(() => {
    if (currentDay.value === 1) {
      return `매일 ${challengeCategoryText.value} 결제내역을 체크합니다`;
    } else {
      return `지금까지 ${challengeCategoryText.value} 결제 내역이 없습니다`;
    }
  });
  
  const totalDays = computed(() => {
    return props.challengeDays;
  });
  
  // Methods
  const getDayBoxClass = (day) => {
    if (isCompleted.value && day <= props.challengeDays) {
      // 완료된 챌린지는 모든 날이 성공 (빨간색)
      return 'bg-brand'; // #FF5555
    } else if (day < currentDay.value) {
      // 현재 일차 이전은 모두 성공 (빨간색)
      return 'bg-brand'; // #FF5555
    } else {
      // 현재 일차 이후는 모두 미완료 (회색, 인라인 스타일 사용)
      return '';
    }
  };
  
  const getDayBoxStyle = (day) => {
    if (isCompleted.value && day <= props.challengeDays) {
      // 완료된 챌린지는 모든 날이 성공이므로 스타일 없음
      return {};
    } else if (day >= currentDay.value) {
      // 현재 일차 이후는 #626262 (회색)
      return { backgroundColor: '#626262' };
    }
    return {};
  };
  
  const handleSaving = () => {
    // 저금 하기 버튼 클릭 시 저금 완료 화면으로 전환
    isSavingCompleted.value = true;
  };
  
  const handleNext = () => {
    // 다음 버튼 클릭 시 처리 (예: 다른 페이지로 이동)
    console.log('다음 단계로 이동');
  };
  
  // 실제 구현에서는 API로 거래 내역을 체크하는 함수
  const checkChallengeStatus = async () => {
    try {
      // API 호출로 현재 챌린지 상태 확인
      // const response = await api.checkChallengeStatus(challengeId);
      // 
      // if (response.data.hasFailedTransaction) {
      //   isFailed.value = true;
      //   currentDay.value = response.data.failedDay;
      //   return;
      // }
      // 
      // currentDay.value = response.data.currentDay;
      
      // 임시로 상태 시뮬레이션 - 실제로는 위의 API 호출로 대체
      // 30일차에 실패한 것으로 가정 (테스트용)
      if (props.isChallengeFailedProp) {
        isFailed.value = true;
        currentDay.value = 30; // 실패한 날짜
      }
      
    } catch (error) {
      console.error('챌린지 상태 확인 실패:', error);
    }
  };
  
  const simulateDailyProgress = () => {
    // 현재 일차 이전까지는 모두 성공으로 처리
    const dailyAverage = calculateDailyAverage();
    
    const maxDay = isCompleted.value ? props.challengeDays : currentDay.value - 1;
    
    // 성공한 날짜까지만 계산
    for (let day = 1; day <= maxDay; day++) {
      dailyProgress.value[day] = 'success';
      savedAmount.value += dailyAverage;
    }
  };
  
  const calculateDailyAverage = () => {
    // 지난 3개월 해당 카테고리 소비의 평균치를 내서 하루치 계산
    // 실제로는 API에서 가져와야 하지만, 시뮬레이션으로 대체
    const categoryAverages = {
      cafe: 4500,      // 카페 하루 평균
      delivery: 12000, // 배달음식 하루 평균  
      taxi: 8000       // 택시 하루 평균
    };
    
    return categoryAverages[props.selectedChallenge] || 5000;
  };
  
  onMounted(async () => {
    await checkChallengeStatus();
    if (!isFailed.value) {
      simulateDailyProgress();
    }
  });
  </script>
  
  <style scoped>
  /* 추가 스타일 */
  </style>