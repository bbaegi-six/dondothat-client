<!-- challengeFailed.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- Challenge Icon & Title -->
    <div class="flex items-center justify-center pt-20 mb-4">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-1"
      >
        <i class="fas fa-times text-xl text-white"></i>
      </div>
    </div>

    <!-- Challenge Title -->
    <h1 class="text-white text-2xl font-bold text-center mb-2 font-pretendard">
      {{ challengeData.title }}
    </h1>

    <!-- Progress Status -->
    <p class="text-white text-sm text-center mb-8 font-pretendard">도전 실패</p>

    <!-- Daily Progress Section -->
    <div class="mx-8 mb-6">
      <h3 class="text-white text-base font-semibold mb-4 font-pretendard">
        일일 성공 여부
      </h3>

      <div class="bg-gray-1 rounded-2xl p-4 w-full">
        <div class="grid grid-cols-7 gap-3 w-full">
          <div
            v-for="day in challengeData.days"
            :key="day"
            :class="getDayBoxClass(day)"
            :style="getDayBoxStyle(day)"
            class="aspect-square rounded-lg flex items-center justify-center transition-colors"
          >
            <span class="text-white text-sm font-bold font-pretendard">{{
              day
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Failed Amount Box -->
    <div class="mx-8 mb-6 bg-gray-1 rounded-2xl p-6 relative w-auto h-28">
      <p
        class="text-white text-base font-medium text-center mb-2 font-pretendard"
      >
        저금할 수 있었던 금액
      </p>
      <p class="text-white text-4xl font-bold text-center font-pretendard">
        {{ potentialSavedAmount.toLocaleString() }}원
      </p>
      <div 
        class="absolute top-4 right-4 p-2 -m-2 cursor-pointer hover:bg-gray-600 rounded-lg transition-colors"
        @click.stop="savedAmountInfoModalOpen = true"
      >
        <FontAwesomeIcon
          :icon="farCircleQuestion"
          class="text-[#c9c9c9] text-lg hover:text-white transition-colors"
        />
      </div>
    </div>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Challenge Info Text -->
    <div class="mx-8 mb-6 text-center">
      <p class="text-brand text-xl font-semibold mb-2 font-pretendard">
        챌린지 실패
      </p>
      <p class="text-white text-base font-pretendard mb-4">
        {{ challengeCategoryText }} 결제 내역이 있습니다
      </p>
    </div>

    <!-- Failed Transactions Section -->
    <div class="mx-8 mb-6">
      <h3 class="text-white text-base font-semibold mb-4 font-pretendard">
        관련 결제 내역
      </h3>
      
      <div v-if="loading" class="bg-gray-1 rounded-2xl p-4 text-center">
        <p class="text-white text-sm">결제 내역을 불러오는 중...</p>
      </div>
      
      <div v-else-if="error" class="bg-gray-1 rounded-2xl p-4 text-center">
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>
      
      <div v-else-if="failedTransactions.length > 0" class="space-y-3">
        <div 
          v-for="(transaction, index) in failedTransactions.slice(0, 3)" 
          :key="index"
          class="bg-gray-1 rounded-2xl p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h4 class="text-white font-medium text-sm mb-1">{{ transaction.content || '결제 내역' }}</h4>
              <p class="text-gray-3 text-xs">{{ formatTransactionDate(transaction.resUsedDate) }}</p>
            </div>
            <div class="text-right">
              <p class="text-brand font-semibold">{{ formatAmount(transaction.resUsedAmount) }}원</p>
            </div>
          </div>
        </div>
        
        <div v-if="failedTransactions.length > 3" class="bg-gray-1 rounded-2xl p-4 text-center">
          <p class="text-gray-3 text-sm">외 {{ failedTransactions.length - 3 }}건 더</p>
        </div>
        
        <div class="text-center mt-4">
          <p class="text-gray-3 text-sm">총 {{ failedTransactions.length }}건의 {{ challengeCategoryText }} 결제가 확인되었습니다</p>
        </div>
      </div>
      
      <div v-else class="bg-gray-1 rounded-2xl p-4 text-center">
        <p class="text-gray-3 text-sm">결제 내역을 불러올 수 없습니다</p>
      </div>
    </div>

    <!-- Action Button -->
    <div class="mx-8 mb-6">
      <button
        class="w-full bg-brand text-white text-lg font-semibold py-4 rounded-2xl font-pretendard"
        @click="handleNewChallenge"
      >
        다른 챌린지 도전하기
      </button>
    </div>

    <!-- Navigation Space -->
    <div class="pb-24"></div>

    <!-- SavedAmountInfoModal -->
    <SavedAmountInfoModal
      :modelValue="savedAmountInfoModalOpen"
      @close="savedAmountInfoModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useExpensesStore } from '@/stores/expenses';
import { useChallengeStore } from '@/stores/challenge';
import { calculatePotentialSavings } from '@/utils/challengeUtils';
import { challengeService } from '@/services/challengeService';
import { faCircleQuestion as farCircleQuestion } from '@fortawesome/free-regular-svg-icons';

// 모달을 동적 import로 로딩
const SavedAmountInfoModal = defineAsyncComponent(() => import('@/components/modals/SavedAmountInfoModal.vue'));

// Props
const props = defineProps({
  challengeData: {
    type: Object,
    required: true,
  },
});

// Router
const router = useRouter();

// Stores
const expensesStore = useExpensesStore();
const challengeStore = useChallengeStore();

// Reactive data
const potentialSavedAmount = ref(0);
const failedTransactions = ref([]);
const loading = ref(false);
const error = ref(null);
const savedAmountInfoModalOpen = ref(false);

// Computed properties
const currentMetadata = computed(() => {
  // categoryMasterData의 키들을 순회하면서 id가 일치하는 카테고리 찾기
  const categoryName = Object.keys(expensesStore.categoryMasterData).find(
    (name) => expensesStore.categoryMasterData[name].id === props.challengeData.type
  );
  
  const categoryData = categoryName ? expensesStore.categoryMasterData[categoryName] : null;

  if (categoryData) {
    return {
      icon: categoryData.icon,
      color: categoryData.color,
      categoryText: categoryName, // 카테고리 이름 (예: '배달음식', '카페', '편의점' 등)
      dailyAverage: categoryData.dailyAverage || 5000,
    };
  }

  // Default metadata if not found
  return {
    icon: 'fas fa-circle',
    color: '#888888',
    categoryText: '챌린지',
    dailyAverage: 5000,
  };
});

const challengeIcon = computed(() => {
  return currentMetadata.value.icon;
});

const challengeIconColor = computed(() => {
  return currentMetadata.value.color;
});

const challengeCategoryText = computed(() => {
  return currentMetadata.value.categoryText;
});

const currentDay = computed(() => {
  return props.challengeData.currentDay;
});

// Methods
const getDayBoxClass = (day) => {
  if (day <= currentDay.value) {
    // 실패 이전 날들은 성공 (빨간색)
    return 'bg-brand';
  }
  return ''; // 실패한 날부터는 회색
};

const getDayBoxStyle = (day) => {
  if (day > currentDay.value) {
    // 실패한 날부터 모두 회색
    return { backgroundColor: '#626262' };
  }
  return {};
};

const formatDateTime = (dateTimeString) => {
  try {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (e) {
    return dateTimeString;
  }
};

const formatTransactionDate = (dateTimeString) => {
  try {
    const date = new Date(dateTimeString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  } catch (e) {
    return dateTimeString;
  }
};

const formatAmount = (amount) => {
  if (!amount) return '0';
  return Number(amount).toLocaleString();
};

const handleNewChallenge = async () => {
  // closeChallenge API 호출 - userChallengeData의 user_challenge_id 사용
  if (challengeStore.userChallengeData?.user_challenge_id) {
    try {
      await challengeStore.closeChallenge(challengeStore.userChallengeData.user_challenge_id);
      console.log('챌린지 닫기 성공');
    } catch (error) {
      console.error('챌린지 닫기 실패:', error);
    }
  }
  
  // 다른 챌린지 선택하러 가기
  console.log('새로운 챌린지 선택');
  router.push('/challenge/flow');
};

const calculateLocalPotentialSavings = () => {
  // savedAmount와 days가 유효한지 확인
  const savedAmount = props.challengeData.savedAmount || 0;
  const days = props.challengeData.days || 0;
  
  console.log('계산 데이터:', {
    savedAmount,
    days,
    challengeData: props.challengeData
  });
  
  potentialSavedAmount.value = savedAmount * days;
  
  console.log('계산된 잠재 저축 금액:', potentialSavedAmount.value);
};

const fetchFailedTransactions = async () => {
  loading.value = true;
  error.value = null;

  try {
    // challengeData에서 challengeId를 가져옵니다 (props에 id가 있다고 가정)
    const challengeId = props.challengeData.type;

    if (!challengeId) {
      throw new Error('챌린지 ID를 찾을 수 없습니다');
    }

    // console.log(challengeId);
    const response = await challengeService.failChallenge(challengeId);
    // console.log(response);

    if (response && Array.isArray(response)) {
      failedTransactions.value = response;
    } else {
      failedTransactions.value = [];
    }
  } catch (err) {
    console.error('실패 내역 조회 오류:', err);
    error.value = '지출 내역을 불러올 수 없습니다';
    failedTransactions.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    // 병렬로 실행 가능한 작업들을 동시에 처리
    const tasks = [
      fetchFailedTransactions()
    ];
    
    // 즉시 실행 가능한 작업은 먼저 실행
    calculateLocalPotentialSavings();
    
    // API 호출들을 병렬로 처리 (현재는 하나지만 확장 가능)
    await Promise.allSettled(tasks);
  } catch (error) {
    console.error('챌린지 실패 페이지 초기화 오류:', error);
  }
});
</script>

<style scoped>
/* 추가 스타일 */
</style>
