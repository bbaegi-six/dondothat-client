<template>
  <Header showLogo :show-border="false" />
  <div
    class="min-h-screen w-[390px] mx-auto bg-[#2f2f2f] pt-[88px] px-[31px] pb-[90px]"
  >
    <!-- 저금통 섹션 -->
    <SavingAccountSection
      :saving-total="savingTotal"
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
import { useSavingStore } from '@/stores/saving';
import { expensesService } from '@/services/expensesService';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const accountStore = useAccountStore();
const expensesStore = useExpensesStore();
const challengeStore = useChallengeStore();
const savingStore = useSavingStore();

// Store에서 반응성 있는 데이터 가져오기 (정석적인 storeToRefs 사용)
const { mainAccount } = storeToRefs(accountStore);
const { total: savingTotal } = storeToRefs(savingStore);

const isSavingGuideModalOpen = ref(false);
const router = useRouter();

// 🏠 홈페이지 전용: 항상 현재 월 차트 데이터 (내역 페이지 월 선택과 독립적)
const chartData = computed(() => expensesStore.homeChartData);


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
      // 거래내역이 없다면 로드 (로그인 시 미리 로드했지만 실패했을 경우)
      if (!expensesStore.transactions || expensesStore.transactions.length === 0) {
        await expensesStore.fetchExpensesFromAPI();
      }
      // 저금통 데이터가 없다면 로드 (로그인 시 미리 로드했지만 실패했을 경우)
      if (savingTotal.value === null || savingTotal.value === undefined) {
        await savingStore.fetchAll();
      }
    } else {
      // 로그인하지 않은 상태에서는 모든 데이터 로드
      await Promise.all([
        loadAccounts(),
        expensesStore.fetchExpensesFromAPI(),
        savingStore.fetchAll()
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
