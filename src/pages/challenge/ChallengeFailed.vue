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
      <div class="absolute top-4 right-4">
        <i class="fas fa-info-circle text-gray-3 text-sm"></i>
      </div>
    </div>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Challenge Info Text or Action Button -->
    <div class="mx-8 mb-6 text-center min-h-[86px]">
      <p class="text-brand text-xl font-semibold mb-2 font-pretendard">
        챌린지 실패
      </p>
      <p class="text-white text-base font-pretendard mb-4">
        {{ challengeCategoryText }} 결제 내역이 확인되었습니다
      </p>
      
      <!-- Failed transactions display (simplified) -->
      <div v-if="loading" class="text-white text-sm">
        지출 내역을 불러오는 중...
      </div>
      <div v-else-if="error" class="text-red-400 text-sm">
        {{ error }}
      </div>
      <div v-else-if="failedTransactions.length > 0" class="text-gray-3 text-sm">
        총 {{ failedTransactions.length }}건의 지출 내역이 있습니다
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useExpensesStore } from '@/stores/expenses';
import { useChallengeStore } from '@/stores/challenge';
import { calculatePotentialSavings } from '@/utils/challengeUtils';
import { challengeService } from '@/services/challengeService';

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

// Computed properties
const currentMetadata = computed(() => {
  const categoryData = Object.values(expensesStore.categoryMasterData).find(
    (category) => category.id === props.challengeData.type
  );

  if (categoryData) {
    return {
      icon: categoryData.icon,
      color: categoryData.color,
      categoryText: categoryData.name,
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
  potentialSavedAmount.value =
    props.challengeData.savedAmount * props.challengeData.days;
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
    const challengeType = props.challengeData.type;
    const days = props.challengeData.days;
    potentialSavings.value = calculatePotentialSavings(challengeType, days);
    
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
