<template>
  <Header showLogo :show-border="false" />
  <div
    class="min-h-screen w-[390px] mx-auto bg-[#2f2f2f] pt-[88px] px-[31px] pb-[90px]"
  >
    <!-- 저금통 섹션 -->
    <SavingAccountSection
      :sub-account="accountStore.subAccount"
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

import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useExpensesStore } from '@/stores/expenses';
import { useAccountStore } from '@/stores/account';
import { useAuthStore } from '@/stores/auth';
import { useChallengeStore } from '@/stores/challenge';
import { expensesService } from '@/services/expensesService';

const authStore = useAuthStore();
const accountStore = useAccountStore();
const expensesStore = useExpensesStore();
const challengeStore = useChallengeStore();

const isSavingGuideModalOpen = ref(false);
const router = useRouter();

// 독립적인 현재월 지출 데이터
const currentMonthSummary = ref({});
const chartLoading = ref(false);


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

// 계좌 정보 로드 (Account Store 사용)
const loadAccounts = async () => {
  try {
    await accountStore.fetchAccounts();
  } catch (error) {
    console.error('계좌 정보 조회 오류:', error);
  }
};


// 저금통 계좌 정보 업데이트 이벤트 리스너 (Account Store 사용)
const handleSavingAccountUpdate = (event) => {
  // Account Store의 subAccount 데이터 직접 업데이트
  if (accountStore.accounts) {
    accountStore.accounts.subAccount = event.detail;
    console.log('홈페이지: Account Store 저금통 계좌 정보 업데이트됨');
  }
};

onMounted(async () => {
  try {
    // 저금통 업데이트 이벤트 리스너 등록
    window.addEventListener('savingAccountUpdated', handleSavingAccountUpdate);
    
    // 1. 중요한 차트 데이터를 우선적으로 로드 (사용자가 바로 볼 수 있는 데이터)
    await loadCurrentMonthSummary();
    
    // 2. 로그인 상태에서만 필요한 API들을 백그라운드에서 병렬 처리
    if (authStore.isLoggedIn) {
      const backgroundTasks = [
        loadAccounts(),
        challengeStore.fetchChallengeProgress()
      ];
      
      // 백그라운드 API는 실패해도 홈 화면 로딩을 방해하지 않음
      Promise.allSettled(backgroundTasks).then(results => {
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const taskNames = ['loadAccounts', 'fetchChallengeProgress'];
            console.error(`${taskNames[index]} API 실패:`, result.reason);
          }
        });
      });
    }
  } catch (error) {
    console.error('Home 화면 핵심 데이터 로딩 오류:', error);
    // 차트 데이터 로딩 실패 시에도 빈 배열로 초기화하여 화면 표시
    currentMonthSummary.value = {};
  }
};

onBeforeUnmount(() => {
  // 이벤트 리스너 제거
  window.removeEventListener('savingAccountUpdated', handleSavingAccountUpdate);
});

// 차트 인스턴스 정리는 ExpenseChart 컴포넌트에서 처리됨
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
