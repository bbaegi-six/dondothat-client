<template>
  <Header showLogo :show-border="false" />
  <div
    class="min-h-screen w-[390px] mx-auto bg-[#2f2f2f] pt-[88px] px-[31px] pb-[90px]"
  >
    <!-- 저금통 섹션 -->
    <SavingAccountSection
      :sub-account="subAccount"
      @show-guide="isSavingGuideModalOpen = true"
      @go-to-saving="goToSavingTab"
      @connect-account="goToAccountStep2"
    />

    <!-- 챌린지 섹션 -->
    <ChallengeSection
      :challenge-data="challengeStore.userChallengeData"
      :category-master-data="expensesStore.categoryMasterData"
      @go-to-challenge="goToChallenges"
    />

    <!-- 차트 섹션 -->
    <ExpenseChart
      :chart-data="chartData"
      :is-initialized="isChartInitialized"
      @chart-initialized="handleChartInitialized"
    />

    <!-- 지출 요약 섹션 -->
    <ExpenseSummary :chart-data="chartData" />

    <!-- 저금통 사용 방법 모달 -->
    <SavingGuideModal
      :modelValue="isSavingGuideModalOpen"
      @close="isSavingGuideModalOpen = false"
    />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import SavingAccountSection from '@/components/sections/SavingAccountSection.vue';
import ChallengeSection from '@/components/sections/ChallengeSection.vue';
import ExpenseChart from '@/components/charts/ExpenseChart.vue';
import ExpenseSummary from '@/components/sections/ExpenseSummary.vue';
import SavingGuideModal from '@/components/modals/SavingGuideModal.vue';

import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useExpensesStore } from '@/stores/expenses';
import { useAccountStore } from '@/stores/account';
import { useAuthStore } from '@/stores/auth';
import { useChallengeStore } from '@/stores/challenge';
import { authAPI } from '@/utils/api';
import { expensesService } from '@/services/expensesService';

const authStore = useAuthStore();
const accountStore = useAccountStore();
const expensesStore = useExpensesStore();
const challengeStore = useChallengeStore();

const isSavingGuideModalOpen = ref(false);
const router = useRouter();

// 저금통 계좌 정보
const subAccount = ref(null);

// 독립적인 현재월 지출 데이터
const currentMonthSummary = ref({});
const chartLoading = ref(false);

// 차트 초기화 상태 관리
const isChartInitialized = ref(false);

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

// 차트 초기화 완료 핸들러
const handleChartInitialized = () => {
  isChartInitialized.value = true;
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
    
    // 차트는 ExpenseChart 컴포넌트에서 자동으로 초기화됨
  } catch (error) {
    console.error('Home 화면 데이터 로딩 예상치 못한 오류:', error);
  }
});

// 차트 인스턴스 정리는 ExpenseChart 컴포넌트에서 처리됨
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
