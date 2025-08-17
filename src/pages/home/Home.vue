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

// 차트 데이터는 Expenses Store에서 가져오기 (로그인 시 미리 로드됨)
const chartData = computed(() => {
  // Expenses Store에서 현재월 집계 데이터 가져오기
  const currentMonthSummary = expensesStore.currentMonthSummary || {};
  
  if (!currentMonthSummary || Object.keys(currentMonthSummary).length === 0) {
    return [];
  }

  return Object.entries(currentMonthSummary)
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
    
    // 로그인된 상태라면 미리 로드된 데이터 사용, 아니면 직접 로드
    if (authStore.isLoggedIn) {
      // 계좌 정보가 없다면 로드 (로그인 시 미리 로드했지만 실패했을 경우)
      if (!accountStore.hasCache) {
        await loadAccounts();
      }
      // 차트 데이터가 없다면 로드 (로그인 시 미리 로드했지만 실패했을 경우)
      if (!expensesStore.currentMonthSummary || Object.keys(expensesStore.currentMonthSummary).length === 0) {
        await expensesService.fetchCurrentMonthSummary();
      }
    } else {
      // 로그인하지 않은 상태에서는 계좌 정보와 차트 데이터만 로드
      await Promise.all([
        loadAccounts(),
        expensesService.fetchCurrentMonthSummary()
      ]);
    }
  } catch (error) {
    console.error('Home 화면 데이터 로딩 오류:', error);
  }
});

onBeforeUnmount(() => {
  // 이벤트 리스너 제거
  window.removeEventListener('savingAccountUpdated', handleSavingAccountUpdate);
});

// 차트 인스턴스 정리는 ExpenseChart 컴포넌트에서 처리됨
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
