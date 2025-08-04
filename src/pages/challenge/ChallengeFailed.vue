<template>
    <div class="flex flex-col h-screen bg-default">
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
        {{ challengeTitle }}
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
  
      <!-- Failed Amount Box -->
      <div class="mx-8 mb-6 bg-gray-1 rounded-2xl p-6 relative" style="width: 328px; height: 112px;">
        <p class="text-white text-base font-medium text-center mb-2 font-pretendard">
          저금할 수 있었던 금액
        </p>
        <p class="text-white text-4xl font-bold text-center font-pretendard">
          {{ potentialSavedAmount.toLocaleString() }}원
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
          {{ challengeCategoryText }} 결제 내역이 있습니다
        </p>
        
        <!-- Failed transaction display -->
        <div class="bg-gray-1 rounded-xl p-4 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                   :style="{ backgroundColor: challengeIconColor }">
                <i :class="challengeIcon" class="text-white text-sm"></i>
              </div>
              <div class="text-left">
                <p class="text-white font-semibold text-sm">{{ failedTransaction.merchant }}</p>
                <p class="text-gray-3 text-xs">{{ challengeCategoryText }}</p>
                <p class="text-gray-3 text-xs">{{ failedTransaction.time }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-brand font-bold text-base">{{ failedTransaction.amount.toLocaleString() }}원</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="mx-8 mb-6 space-y-3" style="width: 328px;">
        <!-- Retry Button (Gray) -->
        <button class="w-full bg-gray-2 text-white text-lg font-medium py-4 rounded-2xl font-pretendard"
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
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Header from '@/components/layout/Header.vue';
  import { useUserStore } from '@/stores/profile';
  
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
    failedDay: {
      type: Number,
      default: 5 // 5일차에 실패했다고 가정
    }
  });
  
  // Router & Store
  const router = useRouter();
  const userStore = useUserStore();
  
  // Reactive data
  const currentDay = ref(props.failedDay);
  const potentialSavedAmount = ref(0);
  const dailyProgress = ref({});
  
  // Challenge metadata
  const challengeData = {
    cafe: {
      title: '카페 금지 챌린지',
      icon: 'fas fa-coffee', 
      color: '#FF9595',
      categoryText: '카페',
      failedTransactions: [
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
      failedTransactions: [
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
      failedTransactions: [
        { merchant: '카카오T', amount: -8200, time: '23:15' },
        { merchant: '택시', amount: -12500, time: '07:30' },
        { merchant: '우버', amount: -15300, time: '22:45' }
      ]
    }
  };
  
  // Computed properties
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
  
  const totalDays = computed(() => {
    return props.challengeDays;
  });
  
  const failedTransaction = computed(() => {
    const transactions = challengeData[props.selectedChallenge]?.failedTransactions || [];
    return transactions[0] || { merchant: '상점명', amount: -10000, time: '12:00' };
  });
  
  // Methods
  const getDayBoxClass = (day) => {
    if (day < currentDay.value) {
      // 실패 이전 날들은 성공 (빨간색)
      return 'bg-brand';
    } else if (day === currentDay.value) {
      // 실패한 날은 회색
      return '';
    } else {
      // 실패 이후 날들은 회색
      return '';
    }
  };
  
  const getDayBoxStyle = (day) => {
    if (day >= currentDay.value) {
      // 실패한 날부터 모두 회색
      return { backgroundColor: '#626262' };
    }
    return {};
  };
  
  const handleRetry = () => {
    // 같은 챌린지 다시 시작
    console.log('같은 챌린지 재도전');
    router.push('/challenge');
  };
  
  const handleNewChallenge = () => {
    // 다른 챌린지 선택하러 가기
    console.log('새로운 챌린지 선택');
    router.push('/challenge');
  };
  
  const simulatePotentialSavings = () => {
    const dailyAverage = calculateDailyAverage();
    
    // 성공했다면 얻을 수 있었던 금액 (전체 기간)
    potentialSavedAmount.value = dailyAverage * props.challengeDays;
    
    // 실패 이전까지의 성공 기록
    for (let day = 1; day < currentDay.value; day++) {
      dailyProgress.value[day] = 'success';
    }
    
    // 실패한 날 기록
    dailyProgress.value[currentDay.value] = 'failed';
  };
  
  const calculateDailyAverage = () => {
    const categoryAverages = {
      cafe: 4500,
      delivery: 12000,
      taxi: 8000
    };
    
    return categoryAverages[props.selectedChallenge] || 5000;
  };
  
  onMounted(() => {
    simulatePotentialSavings();
  });
  </script>
  
  <style scoped>
  /* 추가 스타일 */
  </style>