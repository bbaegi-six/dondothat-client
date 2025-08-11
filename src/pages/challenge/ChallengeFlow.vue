<template>
    <div>
      <!-- 2단계: Selection -->
      <ChallengeSelection 
        v-if="currentStep === 'selection'"
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
      
      <!-- 5단계: Failed -->
      <div v-else-if="currentStep === 'failed'" class="flex flex-col h-screen bg-default">
        <!-- Header -->
        <Header 
          :show-logo="true" 
          :show-points="true" 
          :points="1250" 
        />
  
        <!-- Challenge Icon & Title -->
        <div class="flex items-center justify-center mt-[70px] mb-4">
          <div class="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gray-1">
            <i class="fas fa-times text-xl text-white"></i>
          </div>
        </div>
  
        <!-- Challenge Title -->
        <h1 class="text-white text-2xl font-bold text-center mb-2 font-pretendard">
          {{ challengeStore.challengeMetadata.title || challengeTitle }}
        </h1>
  
        <!-- Progress Status -->
        <p class="text-white text-sm text-center mb-8 font-pretendard">
          도전 실패
        </p>
  
        <!-- Daily Progress Section -->
        <div class="mx-8 mb-6">
          <h3 class="text-white text-base font-semibold mb-4 font-pretendard">일일 성공 여부</h3>
          
          <div class="bg-gray-1 rounded-2xl p-4" style="width: 328px;">
            <div class="grid grid-cols-7" style="width: 296px; height: auto; gap: 12px;">
              <div 
                v-for="day in challengeDays" 
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
  
        <!-- Failed Amount Box -->
        <div class="mx-8 mb-6 bg-gray-1 rounded-2xl p-6 relative" style="width: 328px; height: 112px;">
          <p class="text-white text-base font-medium text-center mb-2 font-pretendard">
            저금할 수 있었던 금액
          </p>
          <p class="text-white text-4xl font-bold text-center font-pretendard">
            {{ getPotentialSavings().toLocaleString() }}원
          </p>
          <div class="absolute top-4 right-4">
            <i class="fas fa-info-circle text-gray-3 text-sm"></i>
          </div>
        </div>
  
        <!-- Spacer -->
        <div class="flex-1"></div>
  
        <!-- Failed transaction info -->
        <div class="mx-8 mb-6 text-center" style="width: 328px;">
          <p class="text-white text-base font-medium mb-4 font-pretendard">
            {{ challengeStore.challengeMetadata.categoryText || challengeCategoryText }} 결제 내역이 있습니다
          </p>
          
          <!-- Failed transaction display -->
          <div class="bg-gray-1 rounded-xl p-4 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                     :style="{ backgroundColor: challengeStore.challengeMetadata.color || challengeIconColor }">
                  <i :class="challengeStore.challengeMetadata.icon || challengeIcon" class="text-white text-sm"></i>
                </div>
                <div class="text-left">
                  <p class="text-white font-semibold text-sm">{{ currentFailedTransaction.merchant }}</p>
                  <p class="text-gray-3 text-xs">{{ challengeStore.challengeMetadata.categoryText || challengeCategoryText }}</p>
                  <p class="text-gray-3 text-xs">{{ currentFailedTransaction.time }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-brand font-bold text-base">{{ currentFailedTransaction.amount.toLocaleString() }}원</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="mx-8 mb-6 space-y-3" style="width: 328px;">
          <!-- Retry Button (Light Gray) -->
          <button class="w-full text-lg font-medium py-4 rounded-2xl font-pretendard"
                  style="background-color: #F1F1F1; color: #414141;"
                  @click="handleRetry">
            다시 도전하기
          </button>
          
          <!-- New Challenge Button (Red) -->
          <button class="w-full bg-brand text-white text-lg font-medium py-4 rounded-2xl font-pretendard"
                  @click="handleNewChallenge">
            다른 챌린지 도전하기
          </button>
        </div>
  
        <!-- Navigation Space -->
        <div class="pb-[90px]"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import ChallengeSelection from './ChallengeSelection.vue';
  import ChallengeDaysInput from './ChallengeDaysInput.vue';
  import ChallengeProgress from './ChallengeProgress.vue';
  import Header from '@/components/layout/Header.vue';
  import { useChallengeStore } from '@/stores/challenge';
  import api from '@/utils/api';
  
  // Router & Store
  const router = useRouter();
  const challengeStore = useChallengeStore();
  
  // 환경 변수
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // 플로우 상태
  const currentStep = ref('selection');
  const selectedChallenge = ref(null);
  const challengeDays = ref(0);
  
  // Store에서 필요한 값들
  const { activeChallenge, isFailed, isLoading, challengeMetadata } = challengeStore;
  
  // 실패 화면용 데이터
  const currentFailedTransaction = ref({});
  const failedDay = ref(30);
  
  // 실패한 거래 ID (computed)
  const failedTransactionId = computed(() => activeChallenge.failedTransactionId);
  
  // 챌린지 데이터 (백업용)
  const challengeData = {
    cafe: {
      title: '카페 금지 챌린지',
      icon: 'fas fa-coffee',
      color: '#FF9595',
      categoryText: '카페',
      sampleFailedTransactions: [
        { merchant: '스타벅스 강남점', amount: -4500, time: '14:32' },
        { merchant: '이디야커피 역삼점', amount: -3200, time: '09:15' },
        { merchant: '투썸플레이스 서초점', amount: -5800, time: '16:45' }
      ]
    },
    delivery: {
      title: '배달음식 금지 챌린지',
      icon: 'fas fa-motorcycle',
      color: '#FF7376',
      categoryText: '배달음식',
      sampleFailedTransactions: [
        { merchant: '배달의민족', amount: -18000, time: '18:59' },
        { merchant: '요기요', amount: -15500, time: '20:23' },
        { merchant: '쿠팡이츠', amount: -12800, time: '19:45' }
      ]
    },
    taxi: {
      title: '택시 금지 챌린지',
      icon: 'fas fa-taxi',
      color: '#FFC457',
      categoryText: '택시',
      sampleFailedTransactions: [
        { merchant: '카카오T', amount: -8200, time: '23:15' },
        { merchant: '택시', amount: -12500, time: '07:30' },
        { merchant: '우버', amount: -15300, time: '22:45' }
      ]
    }
  };
  
  // Computed properties (백업용)
  const challengeTitle = computed(() => {
    return challengeData[selectedChallenge.value]?.title || '챌린지';
  });
  
  const challengeIcon = computed(() => {
    return challengeData[selectedChallenge.value]?.icon || 'fas fa-circle';
  });
  
  const challengeIconColor = computed(() => {
    return challengeData[selectedChallenge.value]?.color || '#888888';
  });
  
  const challengeCategoryText = computed(() => {
    return challengeData[selectedChallenge.value]?.categoryText || '해당 카테고리';
  });
  
  // 달력 스타일 함수들
  const getDayBoxClass = (day) => {
    return day < failedDay.value ? 'bg-brand' : '';
  };
  
  const getDayBoxStyle = (day) => {
    return day >= failedDay.value ? { backgroundColor: '#626262' } : {};
  };
  
  // 플로우 핸들러들
  
  const handleChallengeSelected = (challenge) => {
    console.log('✅ 챌린지 선택됨:', challenge);
    selectedChallenge.value = challenge;
    currentStep.value = 'days-input';
  };
  
  const handleDateComplete = async (data) => {
    console.log('✅ 날짜 입력 완료:', data);
    selectedChallenge.value = data.challenge;
    challengeDays.value = data.days;
    
    // Store를 사용한 챌린지 참여
    const result = await challengeStore.joinChallenge(data.challenge, data.days);
    
    console.log('Store 결과:', result);
    console.log('Store 상태:', challengeStore.activeChallenge);
    
    if (result.success) {
      const challengeStatus = challengeStore.activeChallenge.status;
      
      if (challengeStatus === 'FAILED') {
        currentStep.value = 'failed';
        console.log('❌ 챌린지 실패 상태');
        
        // 실패 데이터 준비
        await fetchFailedTransaction();
      } else {
        currentStep.value = 'progress';
        console.log('✅ 챌린지 진행 상태');
      }
    } else {
      console.error('챌린지 참여 실패:', result.error);
      currentStep.value = 'progress';
    }
    
    console.log(`🎯 ${data.challenge} 챌린지 ${data.days}일 시작!`);
    console.log('현재 단계:', currentStep.value);
  };
  
  const handleRetry = () => {
    console.log('같은 챌린지 재도전:', selectedChallenge.value);
    currentStep.value = 'days-input';
    challengeStore.resetChallenge();
  };
  
  const handleNewChallenge = () => {
    console.log('새로운 챌린지 선택');
    currentStep.value = 'selection';
    selectedChallenge.value = null;
    challengeStore.resetChallenge();
  };
  
  // 실패 관련 함수들
  const fetchFailedTransaction = async () => {
    if (!failedTransactionId.value) {
      const sample = challengeData[selectedChallenge.value]?.sampleFailedTransactions || [];
      currentFailedTransaction.value = sample[0] || {
        merchant: '상점명',
        amount: -10000,
        time: '12:00'
      };
      return;
    }
  
    try {
      const response = await api.get(`/api/transactions/${failedTransactionId.value}`);
      currentFailedTransaction.value = {
        merchant: response.data.merchantName,
        amount: response.data.amount,
        time: response.data.transactionTime
      };
    } catch (error) {
      console.error('거래 내역 조회 실패:', error);
      const sample = challengeData[selectedChallenge.value]?.sampleFailedTransactions || [];
      currentFailedTransaction.value = sample[0] || {
        merchant: '상점명',
        amount: -10000,
        time: '12:00'
      };
    }
  };
  
  const getPotentialSavings = () => {
    return activeChallenge.potentialSavedAmount || 130400;
  };
  
  // 개발자 도구용 테스트 함수들
  if (isDevelopment) {
    window.testChallengeFailed = () => {
      challengeStore.activeChallenge.status = 'FAILED';
      currentStep.value = 'failed';
      fetchFailedTransaction();
      console.log('🧪 테스트: 챌린지 실패 상태로 변경');
    };
  
    window.testChallengeSuccess = () => {
      challengeStore.activeChallenge.status = 'IN_PROGRESS';
      currentStep.value = 'progress';
      console.log('🧪 테스트: 챌린지 성공 상태로 변경');
    };
  
    window.showCurrentState = () => {
      console.log('현재 상태:');
      console.log('- currentStep:', currentStep.value);
      console.log('- selectedChallenge:', selectedChallenge.value);
      console.log('- challengeDays:', challengeDays.value);
      console.log('- Store activeChallenge:', challengeStore.activeChallenge);
    };
  
    console.log('🧪 개발 모드: 테스트 함수들 등록완료');
    console.log('사용법: testChallengeFailed(), testChallengeSuccess(), showCurrentState()');
  }
  
  onMounted(() => {
    console.log('ChallengeFlow 마운트됨');
    
    // Store 상태 확인
    if (challengeStore.isFailed) {
      currentStep.value = 'failed';
    } else if (challengeStore.isActive) {
      currentStep.value = 'progress';
    }
    
    console.log('초기 상태:', {
      currentStep: currentStep.value,
      storeStatus: challengeStore.activeChallenge.status
    });
  });
  </script>
  
  <style scoped>
  /* 페이지 전환 애니메이션 */
  </style>