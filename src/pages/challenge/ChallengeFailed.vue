<!-- challengeFailed.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- Challenge Icon & Title -->
    <div class="flex items-center justify-center mt-[70px] mb-4">
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

      <div class="bg-gray-1 rounded-2xl p-4" style="width: 328px">
        <div
          class="grid grid-cols-7"
          style="width: 296px; height: auto; gap: 12px"
        >
          <div
            v-for="day in challengeData.days"
            :key="day"
            :class="getDayBoxClass(day)"
            :style="getDayBoxStyle(day)"
            class="rounded-lg flex items-center justify-center transition-colors"
            style="width: 32px; height: 32px"
          >
            <span class="text-white text-sm font-bold font-pretendard">{{
              day
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Failed Amount Box -->
    <div
      class="mx-8 mb-6 bg-gray-1 rounded-2xl p-6 relative"
      style="width: 328px; height: 112px"
    >
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

    <!-- Failed transaction info -->
    <div class="mx-8 mb-6 text-center" style="width: 328px">
      <p class="text-white text-base font-medium mb-4 font-pretendard">
        {{ challengeCategoryText }} 결제 내역이 있습니다
      </p>

      <!-- Loading state -->
      <div v-if="loading" class="bg-gray-1 rounded-xl p-4 mb-6">
        <div class="flex items-center justify-center">
          <p class="text-white text-sm">지출 내역을 불러오는 중...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-gray-1 rounded-xl p-4 mb-6">
        <div class="flex items-center justify-center">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Failed transactions display -->
      <div v-else-if="failedTransactions.length > 0" class="space-y-3 mb-6">
        <div
          v-for="transaction in failedTransactions"
          :key="transaction.expenditureDate + transaction.amount"
          class="rounded-xl p-2"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                :style="{ backgroundColor: challengeIconColor }"
              >
                <i :class="challengeIcon" class="text-white text-sm"></i>
              </div>
              <div class="text-left">
                <p class="text-white font-semibold text-sm">
                  {{ transaction.description }}
                </p>
                <p class="text-gray-3 text-xs">{{ challengeCategoryText }}</p>
                <p class="text-gray-3 text-xs">
                  {{ formatDateTime(transaction.expenditureDate) }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-brand font-bold text-base">
                {{ transaction.amount.toLocaleString() }}원
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No transactions found -->
      <div v-else class="bg-gray-1 rounded-xl p-4 mb-6">
        <div class="flex items-center justify-center">
          <p class="text-gray-3 text-sm">지출 내역이 없습니다</p>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="mx-8 mb-6" style="width: 328px">
      <!-- New Challenge Button (Red) -->
      <button
        class="w-full bg-brand text-white text-lg font-medium py-4 rounded-2xl font-pretendard"
        @click="handleNewChallenge"
      >
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
import { useExpensesStore } from '@/stores/expenses';
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

const handleNewChallenge = () => {
  // 다른 챌린지 선택하러 가기
  console.log('새로운 챌린지 선택');
  router.push('/challenge/flow');
};

const calculatePotentialSavings = () => {
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
  calculatePotentialSavings();
  await fetchFailedTransactions();
});
</script>

<style scoped>
/* 추가 스타일 */
</style>
