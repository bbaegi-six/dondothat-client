<!-- ChallengeProgress.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- 기존 챌린지 화면 -->
    <div>
      <!-- Challenge Icon & Title -->
      <div class="flex items-center justify-center mt-[70px] mb-4">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center"
          :class="isCompleted ? '' : 'bg-gray-1'"
          :style="isCompleted ? { backgroundColor: '#FF5555' } : {}"
        >
          <i v-if="isCompleted" class="fas fa-check text-xl text-white"></i>
          <i
            v-else
            :class="challengeIcon"
            class="text-4xl"
            :style="{ color: challengeIconColor }"
          ></i>
        </div>
      </div>

      <!-- Challenge Title -->
      <h1
        class="text-white text-2xl font-bold text-center mb-2 font-pretendard"
      >
        {{ challengeData.title }}
      </h1>

      <!-- Progress Status -->
      <p class="text-white text-sm text-center mb-8 font-pretendard">
        {{ progressStatusText }}
      </p>

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

      <!-- Saved Amount Box -->
      <div
        class="mx-8 mb-6 bg-gray-1 rounded-2xl p-6 relative"
        style="width: 328px; height: 112px"
      >
        <p
          class="text-white text-base font-medium text-center mb-2 font-pretendard"
        >
          지금까지 아낀 금액
        </p>
        <p class="text-white text-4xl font-bold text-center font-pretendard">
          {{ challengeData.savedAmount.toLocaleString() }}원
        </p>
        <div class="absolute top-4 right-4">
          <i class="fas fa-info-circle text-gray-3 text-sm"></i>
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Challenge Info Text or Success Button -->
      <div v-if="isCompleted" class="mx-8 mb-6" style="width: 328px">
        <!-- Success Button -->
        <button
          class="w-full bg-brand text-white text-lg font-semibold py-4 rounded-2xl font-pretendard"
          @click="handleSaving"
        >
          저금 하기
        </button>
      </div>
      <div
        v-else
        class="mx-8 mb-6 text-center"
        style="width: 328px; height: 86px"
      >
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

    <!-- First Modal -->
    <ModalFirst
      v-model="isSavingCompleted"
      :amount="challengeData.saving * challengeData.progress"
      @next="handleNextClick"
      @close="handleModalClose"
    />

    <!-- Second Modal -->
    <ModalSecond
      v-model="isSecondModal"
      @next="handleSecondNextClick"
      @close="handleSecondModalClose"
    />

    <!-- Third Modal -->
    <ModalThird v-model="isThirdModal" @close="handleThirdModalClose" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import { useSavingStore } from '@/stores/saving';
import { useExpensesStore } from '@/stores/expenses';
import ModalFirst from './ModalFirst.vue';
import ModalSecond from './ModalSecond.vue';
import ModalThird from './ModalThird.vue';

const router = useRouter();
const savingStore = useSavingStore();

// Props - 백엔드 데이터 받기
const props = defineProps({
  challengeData: {
    type: Object,
    required: true,
    validator: (value) => {
      const requiredFields = [
        'id',
        'type',
        'title',
        'status',
        'days',
        'currentDay',
        'savedAmount',
      ];
      return requiredFields.every(
        (field) => value && value.hasOwnProperty(field)
      );
    },
  },
});

// Reactive data
const isSavingCompleted = ref(false);
const isSecondModal = ref(false);
const isThirdModal = ref(false);

// Challenge metadata (기존 데이터 - 아이콘/색상용)
const challengeMetadata = {
  '카페 금지 챌린지': {
    type: 'cafe',
    icon: 'fas fa-coffee',
    color: '#FF9595',
    categoryText: '카페',
  },
  '배달음식 금지 챌린지': {
    type: 'delivery',
    icon: 'fas fa-motorcycle',
    color: '#FF7376',
    categoryText: '배달음식',
  },
  '택시 금지 챌린지': {
    type: 'taxi',
    icon: 'fas fa-taxi',
    color: '#FFC457',
    categoryText: '택시',
  },
};

const expensesStore = useExpensesStore();


// Computed properties
const isCompleted = computed(() => {
  return props.challengeData.status === 'completed';
});

const progressStatusText = computed(() => {
  if (props.challengeData.status === 'completed') {
    return '도전 성공';
  } else {
    return `${props.challengeData.currentDay + 1}일차 도전 중`;
  }
});

const currentMetadata = computed(() => {
  const categoryName = Object.keys(expensesStore.categoryMasterData).find(
    (name) =>
      expensesStore.categoryMasterData[name].id === props.challengeData.type
  );

  const categoryData = categoryName
    ? expensesStore.categoryMasterData[categoryName]
    : null;

  if (categoryData) {
    return {
      icon: categoryData.icon,
      color: categoryData.color,
      categoryText: categoryName, // Use the found categoryName (the key)
    };
  }

  // Default metadata if not found
  return {
    icon: 'fas fa-circle',
    color: '#888888',
    categoryText: '챌린지',
  };
});

const challengeIcon = computed(() => {
  return currentMetadata.value.icon;
});

const challengeIconColor = computed(() => {
  return currentMetadata.value.color;
});

const challengeStatusText = computed(() => {
  if (props.challengeData.currentDay === 1) {
    return '지금부터 챌린지를 시작합니다';
  } else {
    return `${props.challengeData.currentDay}일까지 성공`;
  }
});

const challengeDescriptionText = computed(() => {
  const categoryText = currentMetadata.value.categoryText;
  if (props.challengeData.currentDay === 1) {
    return `매일 ${categoryText} 결제내역을 체크합니다`;
  } else {
    return `지금까지 ${categoryText} 결제 내역이 없습니다`;
  }
});

// Methods
const getDayBoxClass = (day) => {
  if (isCompleted.value && day <= props.challengeData.days) {
    // 완료된 챌린지는 모든 날이 성공 (빨간색)
    return 'bg-brand';
  } else if (day <= props.challengeData.currentDay) {
    // 현재 진행된 일차까지는 성공 (빨간색)
    return 'bg-brand';
  } else {
    return '';
  }
};

const getDayBoxStyle = (day) => {
  if (isCompleted.value && day <= props.challengeData.days) {
    return {};
  } else if (day > props.challengeData.currentDay) {
    return { backgroundColor: '#626262' };
  }
  return {};
};

const handleSaving = async () => {
  try {
    await savingStore.save(props.challengeData.userChallengeId);
    isSavingCompleted.value = true;
  } catch (error) {
    console.error('저금 처리 중 오류:', error);
    // 에러가 발생해도 모달은 열어줌
    isSavingCompleted.value = true;
  }
};

const handleModalClose = () => {
  isSavingCompleted.value = false;
};

const handleNextClick = () => {
  isSavingCompleted.value = false;
  isSecondModal.value = true;
};

const handleSecondModalClose = () => {
  isSecondModal.value = false;
};

const handleSecondNextClick = () => {
  isSecondModal.value = false;
  isThirdModal.value = true;
};

const handleThirdModalClose = () => {
  isThirdModal.value = false;
  router.push('/');
};

onMounted(() => {
  console.log('✅ ChallengeProgress 마운트됨');
  console.log('📊 챌린지 데이터:', props.challengeData);
});
</script>

<style scoped>
/* 기존 스타일 유지 */
</style>
