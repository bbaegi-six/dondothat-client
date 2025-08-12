<!-- challengeFailed.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- Challenge Icon & Title -->
    <div class="flex items-center justify-center mt-[70px] mb-4">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gray-1"
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
            v-for="day in challengeData.period"
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

      <!-- Failed transaction display -->
      <div class="bg-gray-1 rounded-xl p-4 mb-6">
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
                {{ mockFailedTransaction.merchant }}
              </p>
              <p class="text-gray-3 text-xs">{{ challengeCategoryText }}</p>
              <p class="text-gray-3 text-xs">
                {{ mockFailedTransaction.time }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-brand font-bold text-base">
              {{ mockFailedTransaction.amount.toLocaleString() }}원
            </p>
          </div>
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

// Props
const props = defineProps({
  challengeData: {
    type: Object,
    required: true,
  },
});

// Router
const router = useRouter();

// Reactive data
const potentialSavedAmount = ref(0);

// Challenge type mapping
const challengeMetadata = {
  카페: {
    icon: 'fas fa-coffee',
    color: '#FF9595',
    categoryText: '카페',
    mockTransaction: {
      merchant: '스타벅스 강남점',
      amount: -4500,
      time: '14:32',
    },
    dailyAverage: 4500,
  },
  배달: {
    icon: 'fas fa-motorcycle',
    color: '#FF7376',
    categoryText: '배달음식',
    mockTransaction: { merchant: '배달의민족', amount: -18000, time: '18:59' },
    dailyAverage: 12000,
  },
  택시: {
    icon: 'fas fa-taxi',
    color: '#FFC457',
    categoryText: '택시',
    mockTransaction: { merchant: '카카오T', amount: -8200, time: '23:15' },
    dailyAverage: 8000,
  },
};

// Computed properties
const challengeType = computed(() => {
  const title = props.challengeData.title || '';
  if (title.includes('카페')) return '카페';
  if (title.includes('배달')) return '배달';
  if (title.includes('택시')) return '택시';
  return '카페'; // default
});

const challengeIcon = computed(() => {
  return challengeMetadata[challengeType.value]?.icon || 'fas fa-circle';
});

const challengeIconColor = computed(() => {
  return challengeMetadata[challengeType.value]?.color || '#888888';
});

const challengeCategoryText = computed(() => {
  return (
    challengeMetadata[challengeType.value]?.categoryText || '해당 카테고리'
  );
});

const mockFailedTransaction = computed(() => {
  return (
    challengeMetadata[challengeType.value]?.mockTransaction || {
      merchant: '상점명',
      amount: -10000,
      time: '12:00',
    }
  );
});

const currentDay = computed(() => {
  return props.challengeData.progress;
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

const handleNewChallenge = () => {
  // 다른 챌린지 선택하러 가기
  console.log('새로운 챌린지 선택');
  router.push('/challenge');
};

const calculatePotentialSavings = () => {
  potentialSavedAmount.value =
    props.challengeData.saving * props.challengeData.period;
  // console.log('Calculated Potential Savings:', potentialSavedAmount.value);
};

onMounted(() => {
  calculatePotentialSavings();
});
</script>

<style scoped>
/* 추가 스타일 */
</style>
