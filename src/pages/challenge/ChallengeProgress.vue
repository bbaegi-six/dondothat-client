<!-- ChallengeProgress.vue -->
<template>
  <div class="flex flex-col h-screen bg-default">
    <!-- 저금 완료 상태 -->
    <div
      v-if="isSavingCompleted"
      class="flex flex-col items-center justify-center flex-1"
    >
      <!-- Success Icon -->
      <div
        class="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style="background-color: #ff5555"
      >
        <i class="fas fa-check text-3xl text-white"></i>
      </div>

      <!-- Amount -->
      <p class="text-white text-3xl font-bold text-center mb-2 font-pretendard">
        {{ challengeData.saving.toLocaleString() }}원
      </p>

      <!-- Status Text -->
      <p class="text-white text-xl font-medium text-center font-pretendard">
        저금 완료
      </p>
    </div>

    <!-- Next Button - 네비게이션 바로 위 -->
    <div v-if="isSavingCompleted" class="mx-8 mb-6" style="width: 328px">
      <button
        class="w-full bg-brand text-white text-lg font-medium py-4 rounded-2xl font-pretendard"
        @click="handleNext"
      >
        다음
      </button>
    </div>

    <!-- 기존 챌린지 화면 -->
    <div v-else>
      <!-- Challenge Icon & Title -->
      <div class="flex items-center justify-center mt-[70px] mb-4">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center"
          :class="isCompleted ? '' : 'bg-gray-1'"
          :style="isCompleted ? { backgroundColor: '#FF5555' } : {}"
        >
          <i v-if="isCompleted" class="fas fa-check text-4xl text-white"></i>
          <i
            v-else
            :class="challengeIcon"
            class="text-3xl"
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
          {{
            (challengeData.saving * challengeData.progress).toLocaleString()
          }}원
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useExpensesStore } from '@/stores/expenses';

// Props - 백엔드 데이터 받기
const props = defineProps({
  challengeData: {
    type: Object,
    required: true,
    validator: (value) => {
      // 필수 필드 검증
      const requiredFields = [
        'userChallengeId',
        'challengeId',
        'title',
        'status',
        'period',
        'progress',
        'saving',
      ];
      return requiredFields.every(
        (field) => value && value.hasOwnProperty(field)
      );
    },
  },
});

// Reactive data
const isSavingCompleted = ref(false);
const expensesStore = useExpensesStore();

// Computed properties
const isCompleted = computed(() => {
  return props.challengeData.status === 'completed';
});

const progressStatusText = computed(() => {
  if (props.challengeData.status === 'completed') {
    return '도전 성공';
  } else {
    return `${props.challengeData.progress + 1}일차 도전 중`;
  }
});

const currentMetadata = computed(() => {
  const categoryName = Object.keys(expensesStore.categoryMasterData).find(
    (name) =>
      expensesStore.categoryMasterData[name].id ===
      props.challengeData.challengeId
  );
  const categoryData = categoryName
    ? expensesStore.categoryMasterData[categoryName]
    : null;

  if (categoryData) {
    return {
      icon: categoryData.icon,
      color: categoryData.color,
      categoryText: categoryName,
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
  if (props.challengeData.progress === 1) {
    return '지금부터 챌린지를 시작합니다';
  } else {
    return `${props.challengeData.progress}일까지 성공`;
  }
});

const challengeDescriptionText = computed(() => {
  const categoryText = currentMetadata.value.categoryText;
  if (props.challengeData.progress === 1) {
    return `매일 ${categoryText} 결제내역을 체크합니다`;
  } else {
    return `지금까지 ${categoryText} 결제 내역이 없습니다`;
  }
});

// Methods
const getDayBoxClass = (day) => {
  if (isCompleted.value && day <= props.challengeData.period) {
    // 완료된 챌린지는 모든 날이 성공 (빨간색)
    return 'bg-brand';
  } else if (day <= props.challengeData.progress) {
    // 현재 진행된 일차까지는 성공 (빨간색)
    return 'bg-brand';
  } else {
    // 아직 진행되지 않은 날은 회색
    return '';
  }
};

const getDayBoxStyle = (day) => {
  if (isCompleted.value && day <= props.challengeData.period) {
    return {};
  } else if (day > props.challengeData.progress) {
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
  console.log('저금 완료 - 다음 단계로 이동');
  // 실제로는 router.push('/') 등으로 메인 페이지로 이동
};

onMounted(() => {
  console.log('✅ ChallengeProgress 마운트됨');
  console.log('📊 챌린지 데이터:', props.challengeData);
});
</script>

<style scoped>
/* 기존 스타일 유지 */
</style>
