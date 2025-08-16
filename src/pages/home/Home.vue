<template>
  <Header showLogo :show-border="false" />
  <div
    class="min-h-screen w-[390px] mx-auto bg-[#2f2f2f] pt-[88px] px-[31px] pb-[90px]"
  >
    <!-- 저금통 섹션 -->
    <div v-if="subAccount">
      <div
        class="w-[328px] h-[56px] bg-[#414141] rounded-2xl flex items-center px-6 cursor-pointer"
      >
        <div class="font-pretendard font-medium text-base text-white">
          지금까지 저금한 금액
        </div>
        <FontAwesomeIcon
          :icon="farCircleQuestion"
          class="text-[#c9c9c9] ml-1 mr-auto"
          @click.stop="isSavingGuideModalOpen = true"
        />
        <div
          class="font-pretendard font-medium text-base text-white ml-auto mr-2"
          @click="goToSavingTab"
        >
          {{ subAccount.balance.toLocaleString() }}원
        </div>
        <FontAwesomeIcon :icon="faAngleRight" class="text-white w-[10px] h-4" />
      </div>
    </div>
    <div
      v-else
      class="w-[328px] h-[56px] bg-[#414141] rounded-2xl flex items-center px-6 cursor-pointer"
      @click="goToAccountStep2"
    >
      <div class="font-pretendard font-medium text-base text-white">저금통</div>
      <FontAwesomeIcon
        :icon="farCircleQuestion"
        class="text-[#c9c9c9] ml-1 mr-auto"
        @click.stop="isSavingGuideModalOpen = true"
      />
      <div class="font-pretendard font-medium text-base text-white mr-2">
        연결하기
      </div>
      <FontAwesomeIcon :icon="faAngleRight" class="text-white w-[10px] h-4" />
    </div>

    <!-- 참여 중인 챌린지 섹션 -->
    <div
      v-if="
        challengeStore.userChallengeData &&
        challengeStore.userChallengeData.status !== 'closed'
      "
      class="w-[328px] h-24 rounded-2xl mt-4 flex flex-col justify-center px-6 cursor-pointer border-2 border-[#414141]"
      @click="goToChallenges"
    >
      <div class="flex items-center">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center mr-4"
          :class="
            challengeStore.userChallengeData.status === 'completed' || challengeStore.userChallengeData.status === 'failed'
              ? ''
              : 'bg-gray-1'
          "
          :style="
            challengeStore.userChallengeData.status === 'completed'
              ? { backgroundColor: '#414141' }
              : challengeStore.userChallengeData.status === 'failed'
              ? { backgroundColor: '#a1a1a1' }
              : {}
          "
        >
          <FontAwesomeIcon
            :icon="challengeIconClass"
            class="text-xl"
            :style="{ color: challengeIconColor }"
          />
        </div>
        <div class="flex-1 flex flex-col justify-center">
          <div class="flex items-center justify-between">
            <div class="font-pretendard font-medium text-base text-white">
              {{ challengeStore.userChallengeData.title }}
            </div>
            <div class="font-pretendard font-medium text-sm text-white ml-auto">
              {{ challengeStore.userChallengeData.progress }}/{{
                challengeStore.userChallengeData.period
              }}일
            </div>
          </div>
          <div class="w-full bg-gray-1 rounded-full h-2 mt-1">
            <div
              class="h-2 rounded-full"
              :class="
                challengeStore.userChallengeData.status === 'failed'
                  ? ''
                  : 'bg-brand'
              "
              :style="{
                width: `${(challengeStore.userChallengeData.progress / challengeStore.userChallengeData.period) * 100}%`,
                backgroundColor:
                  challengeStore.userChallengeData.status === 'failed'
                    ? '#858585'
                    : '',
              }"
            ></div>
          </div>
        </div>
        <FontAwesomeIcon
          :icon="faAngleRight"
          class="text-[#c6c6c6] w-[10px] h-4 ml-2"
        />
      </div>
    </div>

    <!-- 참여 중인 챌린지가 없습니다 섹션 -->
    <div
      v-else
      class="w-[328px] h-24 bg-[#2f2f2f] border-2 border-[#414141] rounded-2xl mt-4 flex items-center px-6 cursor-pointer"
      @click="goToChallenges"
    >
      <FontAwesomeIcon
        :icon="fasCircleQuestion"
        class="text-white w-12 h-12 mr-4"
      />
      <div class="font-pretendard font-medium text-base text-white flex-1">
        참여 중인 챌린지가 없습니다
      </div>
      <FontAwesomeIcon
        :icon="faAngleRight"
        class="text-[#c6c6c6] w-[10px] h-4"
      />
    </div>

    <!-- 차트 섹션 -->
    <div class="w-[328px] mt-10 flex flex-col items-center">
      <!-- 차트 컨테이너 -->
      <div class="w-[170px] h-[170px] mb-6">
        <canvas ref="chartCanvas" width="170" height="170"></canvas>
      </div>
    </div>

    <!-- 이번 달 지출 요약 타이틀 -->
    <div class="font-pretendard font-semibold text-xl text-white mb-4 mt-6">
      이번 달 지출 요약
    </div>

    <!-- 이번 달 지출 요약 박스 -->
    <div class="w-[328px] bg-[#414141] rounded-2xl p-6">
      <!-- 카테고리별 지출 리스트 -->
      <div v-if="chartData && chartData.length > 0">
        <div
          v-for="(category, index) in chartData"
          :key="category.name"
          class="flex items-center justify-between mb-2 last:mb-0"
        >
          <div class="flex items-center">
            <div
              class="w-5 h-5 rounded-full mr-3"
              :style="{
                backgroundColor: category.color,
              }"
            ></div>
            <div class="font-pretendard font-medium text-sm text-white">
              {{ category.name }}
            </div>
          </div>
          <div class="font-pretendard font-bold text-sm text-white">
            {{ category.amount.toLocaleString() }}원
          </div>
        </div>
      </div>

      <!-- 데이터 없음 표시 -->
      <div v-else class="text-center py-8">
        <p class="text-[#c6c6c6] text-sm">이번 달 지출 내역이 없습니다.</p>
      </div>
    </div>
    <!-- 저금통 사용 방법 모달 -->
    <SavingGuideModal
      :modelValue="isSavingGuideModalOpen"
      @close="isSavingGuideModalOpen = false"
    />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleQuestion as farCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleQuestion as fasCircleQuestion,
  faAngleRight,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { useExpensesStore } from '@/stores/expenses';
import { useAccountStore } from '@/stores/account';
import { useAuthStore } from '@/stores/auth';
import SavingGuideModal from '@/components/modals/SavingGuideModal.vue';
import { useChallengeStore } from '@/stores/challenge';
import { useSavingStore } from '@/stores/saving';
import { authAPI } from '@/utils/api';
import { expensesService } from '@/services/expensesService';

const authStore = useAuthStore();
const accountStore = useAccountStore();
const savingStore = useSavingStore();

const isSavingGuideModalOpen = ref(false);
const router = useRouter();
const chartCanvas = ref(null);
const expensesStore = useExpensesStore();
const challengeStore = useChallengeStore();
const chartInstance = ref(null);

// 저금통 계좌 정보
const subAccount = ref(null);

// 독립적인 현재월 지출 데이터
const currentMonthSummary = ref({});
const chartLoading = ref(false);

const challengeIconClass = computed(() => {
  if (!challengeStore.userChallengeData) return '';
  
  // failed 상태일 때 xmark 아이콘 표시
  if (challengeStore.userChallengeData.status === 'failed') {
    return faXmark;
  }
  
  const categoryId = challengeStore.userChallengeData.challenge_id;

  const foundEntry = Object.entries(expensesStore.categoryMasterData).find(
    ([name, cat]) => cat.id === categoryId
  );

  let iconClass = '';
  if (foundEntry) {
    const categoryData = foundEntry[1];
    iconClass = categoryData.icon;
  }
  return iconClass;
});

const challengeIconColor = computed(() => {
  if (!challengeStore.userChallengeData) return '';
  
  // failed 상태일 때 흰색 표시
  if (challengeStore.userChallengeData.status === 'failed') {
    return '#ffffff';
  }
  
  const categoryId = challengeStore.userChallengeData.challenge_id;
  const foundEntry = Object.entries(expensesStore.categoryMasterData).find(
    ([name, cat]) => cat.id === categoryId
  );
  return foundEntry ? foundEntry[1].color : ''; // Return the color property
});

// 현재월 지출 집계 로드
const loadCurrentMonthSummary = async () => {
  chartLoading.value = true;
  try {
    const summary = await expensesService.fetchCurrentMonthSummary();
    currentMonthSummary.value = summary || {};
  } catch (error) {
    console.error('현재월 지출 집계 조회 오류:', error);
    currentMonthSummary.value = {};
  } finally {
    chartLoading.value = false;
  }
};

// 집계 데이터를 차트 데이터로 변환
const chartData = computed(() => {
  if (
    !currentMonthSummary.value ||
    Object.keys(currentMonthSummary.value).length === 0
  ) {
    return [];
  }

  return Object.entries(currentMonthSummary.value)
    .map(([name, amount]) => ({
      name,
      amount,
      color: expensesStore.getCategoryColorByName(name),
    }))
    .sort((a, b) => b.amount - a.amount);
});

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value || !chartData.value.length) return;

  // 기존 차트 인스턴스가 있다면 제거
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  // 카테고리별 색상 배열
  const colors = chartData.value.map((item) => item.color);

  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: chartData.value.map((item) => item.name),
      datasets: [
        {
          data: chartData.value.map((item) => item.amount),
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false, // 범례 숨기기 (아래 리스트에서 표시)
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${percentage}%`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        duration: 1000,
      },
    },
  });
};

// 페이지 이동 함수들
const goToAccountStep2 = () => {
  accountStore.setAccount('sub', false);
  router.push('/account');
};

const goToChallenges = () => {
  router.push('/challenge');
};

const goToSavingTab = () => {
  router.push('/expenses?tab=savings');
};

// 저금통 계좌 정보 로드
const loadSavingAccount = async () => {
  try {
    const response = await authAPI.getMyPageAccounts();
    subAccount.value = response.subAccount;
  } catch (error) {
    console.error('저금통 계좌 정보 조회 오류:', error);
    subAccount.value = null;
  }
};

// chartData가 변경될 때 차트 재생성
watch(
  chartData,
  () => {
    nextTick(() => {
      createChart();
    });
  },
  { deep: true }
);

onMounted(async () => {
  try {
    // API 호출을 병렬로 처리하여 성능 개선 (Promise.allSettled 사용)
    const apiCalls = [
      { name: 'loadCurrentMonthSummary', fn: loadCurrentMonthSummary }
    ];
    
    if (authStore.isLoggedIn) {
      apiCalls.push({ name: 'loadSavingAccount', fn: loadSavingAccount });
      apiCalls.push({ name: 'fetchChallengeProgress', fn: challengeStore.fetchChallengeProgress });
    }
    
    // 모든 API를 병렬로 실행 (개별 실패 허용)
    const promises = apiCalls.map(api => api.fn());
    const results = await Promise.allSettled(promises);
    
    // 개별 API 실패 로깅
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`${apiCalls[index].name} API 실패:`, result.reason);
      }
    });
    
    // 차트 데이터 로딩 완료 후 차트 생성
    await nextTick();
    createChart();
  } catch (error) {
    console.error('Home 화면 데이터 로딩 예상치 못한 오류:', error);
  }
});
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
