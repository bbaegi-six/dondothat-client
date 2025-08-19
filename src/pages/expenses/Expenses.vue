<template>
  <div
    class="min-h-screen w-full relative bg-[#2f2f2f] pt-20 px-8 pb-20"
  >
    <Header
      :showBack="false"
      title="내역"
      :showAddButton="true"
      :showBorder="false"
      @add-click="refreshExpenses"
    />

    <!-- 탭 -->
    <div class="w-full h-9 mt-1 flex">
      <div
        @click="switchTab('account')"
        class="flex-1 h-9 bg-[#2f2f2f] relative cursor-pointer"
      >
        <div
          class="font-pretendard font-medium text-base leading-8 text-center pt-0.5"
          :class="activeTab === 'account' ? 'text-[#ff5555]' : 'text-white'"
        >
          내 계좌
        </div>
        <div
          v-if="activeTab === 'account'"
          class="absolute bottom-0 w-full h-0 border border-[#ff5555]"
        ></div>
      </div>
      <div
        @click="switchTab('savings')"
        class="flex-1 h-9 bg-[#2f2f2f] relative cursor-pointer"
      >
        <div
          class="font-pretendard font-medium text-base leading-8 text-center pt-0.5"
          :class="activeTab === 'savings' ? 'text-[#ff5555]' : 'text-white'"
        >
          저금통
        </div>
        <div
          v-if="activeTab === 'savings'"
          class="absolute bottom-0 w-full h-0 border border-[#ff5555]"
        ></div>
      </div>
    </div>

    <!-- 내 계좌 섹션 -->
    <div v-if="activeTab === 'account'">
      <!-- 월별 요약 섹션 -->
      <div class="relative w-full h-30 bg-[#414141] rounded-2xl mt-2.5 p-4">
        <!-- 헤더 부분 -->
        <div class="flex items-center justify-center mb-2">
          <button
            @click="previousMonth"
            class="w-5 h-5 flex items-center justify-center bg-transparent border-none"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path
                d="M6 4L2 8L6 12"
                stroke="#C9C9C9"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          
          <div class="mx-4 text-center">
            <div class="font-pretendard font-bold text-sm text-white">
              {{ currentMonthDisplay }}월
            </div>
          </div>
          
          <button
            @click="nextMonth"
            class="w-5 h-5 flex items-center justify-center bg-transparent border-none"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path
                d="M4 4L8 8L4 12"
                stroke="#C9C9C9"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <!-- 총 지출 타이틀 -->
        <div class="text-center font-pretendard font-medium text-sm text-white mb-2">
          총 지출
        </div>

        <!-- 금액 -->
        <div class="text-center font-pretendard font-semibold text-2xl text-[#ff5555]">
          {{ monthlyExpense.toLocaleString() }}원
        </div>
      </div>
    </div>

    <!-- 저금통 섹션 -->
    <div v-if="activeTab === 'savings'">
      <!-- 저금통 요약 섹션 -->
      <div class="relative w-full h-30 bg-[#414141] rounded-2xl mt-2.5 p-4 flex flex-col justify-center">
        <!-- 저금통 타이틀 -->
        <div class="text-center font-pretendard font-medium text-base text-white mb-2">
          지금까지 절약한 금액
        </div>

        <!-- 금액 -->
        <div class="text-center font-pretendard font-semibold text-2xl text-[#ff5555]">
          {{ totalSavings.toLocaleString() }}원
        </div>
      </div>
    </div>

    <!-- 내 계좌 거래내역 리스트 -->
    <div v-if="activeTab === 'account'">
      <div
        v-if="currentMonthTransactions && currentMonthTransactions.length > 0"
      >
        <!-- 날짜별 그룹 -->
        <div v-for="(group, date) in groupedTransactions" :key="date">
          <!-- 날짜와 금액 -->
          <div class="mt-7 w-full flex justify-between items-center">
            <div class="font-pretendard font-medium text-base text-white">
              {{ formatDate(date) }}
            </div>
            <div class="font-pretendard font-semibold text-base text-white">
              {{ getDailyTotal(group) }}
            </div>
          </div>

          <!-- 구분선 -->
          <div class="w-full border-t border-[#414141]"></div>

          <!-- 거래내역 아이템들 -->
          <div>
            <TransactionCard
              v-for="transaction in group"
              :key="transaction.id"
              :transaction="transaction"
              @click="editTransaction"
            />
          </div>
        </div>
      </div>

      <!-- 데이터 없음 표시 -->
      <div v-else class="text-center py-16">
        <p style="color: #c6c6c6; font-size: 14px">
          {{ currentMonthDisplay }}월의 거래내역이 없습니다.
        </p>
      </div>
    </div>

    <!-- 저금통 거래내역 리스트 -->
    <div v-if="activeTab === 'savings'">
      <div v-if="savingStore.history.length > 0" style="margin-top: 28px">
        <!-- 단순 리스트 -->
        <div>
          <TransactionCard
            v-for="item in savingStore.history"
            :key="item.categoryId + item.date"
            :transaction="item"
          />
        </div>
      </div>

      <!-- 데이터 없음 표시 -->
      <div v-else class="text-center py-16">
        <p style="color: #c6c6c6; font-size: 14px">저금통 내역이 없습니다.</p>
      </div>
    </div>

    <!-- 내역추가 버튼 -->
    <button
      @click="addTransaction"
      class="fixed bottom-20 right-8 w-12 h-12 bg-[#ff5555] border-none rounded-full flex items-center justify-center cursor-pointer z-10 shadow-lg"
      :disabled="loading"
    >
      <!-- + 아이콘 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        width="20"
        height="20"
        fill="#ffffff"
      >
        <path
          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useExpensesStore } from '../../stores/expenses.js';
import { useSavingStore } from '../../stores/saving.js';
import Header from '../../components/layout/Header.vue';
import TransactionCard from '../../components/expenses/TransactionCard.vue';

const expensesStore = useExpensesStore();
const savingStore = useSavingStore();

// 탭 상태 관리
const activeTab = ref('account'); // 'account' 또는 'savings'

// 탭 전환 함수
const switchTab = (tab) => {
  activeTab.value = tab;
};

// 최초 진입 시 데이터 로드
onMounted(async () => {
  // 쿼리 파라미터 확인해서 탭 설정
  const route = useRoute();
  if (route.query.tab === 'savings') {
    activeTab.value = 'savings';
  }
  
  await Promise.all([
    expensesStore.fetchExpensesFromAPI(),
    savingStore.fetchAll(),
  ]);
});

// 계산된 속성들 (스토어에서 가져옴)
const currentMonthDisplay = computed(() => expensesStore.currentMonth);
const currentMonthTransactions = computed(
  () => expensesStore.currentMonthTransactions
);
const groupedTransactions = computed(() => expensesStore.groupedTransactions);
const monthlyExpense = computed(() => expensesStore.monthlyExpense);

// ✅ 저금통 계산값 연결
const totalSavings = computed(() => savingStore.total);

// 메서드들 (스토어 액션 사용)
const previousMonth = () => {
  expensesStore.previousMonth();
  console.log(`${expensesStore.currentMonth}월로 이동`);
};

const nextMonth = () => {
  expensesStore.nextMonth();
  console.log(`${expensesStore.currentMonth}월로 이동`);
};

const formatDate = (dateString) => {
  return expensesStore.formatDate(dateString);
};

const getDailyTotal = (transactions) => {
  return expensesStore.getDailyTotal(transactions);
};

const editTransaction = (transaction) => {
  expensesStore.navigateToExpenseEdit(transaction.id);
};

const addTransaction = () => {
  expensesStore.navigateToExpenseAdd();
  console.log('새 거래 추가 페이지로 이동');
};

// 새로고침 버튼 관련
const loading = computed(() => expensesStore.loading);

const refreshExpenses = async () => {
  console.log('Codef 거래내역 및 메인 계좌 새로고침 시작');
  try {
    // 거래내역과 메인 계좌 정보를 병렬로 새로고침
    const tasks = [
      expensesStore.refreshFromCodef(),
      // 메인 계좌 캐시 무효화 및 새로고침
      refreshMainAccount()
    ];
    
    const results = await Promise.allSettled(tasks);
    
    // 결과 확인
    const [expensesResult, mainAccountResult] = results;
    
    if (expensesResult.status === 'fulfilled' && expensesResult.value) {
      console.log('Codef 거래내역 새로고침 완룼');
    } else {
      console.error('Codef 거래내역 새로고침 실패');
    }
    
    if (mainAccountResult.status === 'fulfilled') {
      console.log('메인 계좌 새로고침 완료');
    } else {
      console.error('메인 계좌 새로고침 실패:', mainAccountResult.reason);
    }
    
  } catch (error) {
    console.error('새로고침 오류:', error);
  }
};

// 메인 계좌 정보 새로고침 (Account Store 사용)
const refreshMainAccount = async () => {
  try {
    const { useAccountStore } = await import('@/stores/account');
    const accountStore = useAccountStore();
    
    // 메인 계좌만 새로고침 (서브 계좌는 보존)
    await accountStore.fetchMainAccountOnly();
    
    return accountStore.mainAccount;
  } catch (error) {
    console.error('메인 계좌 정보 새로고침 실패:', error);
    throw error;
  }
};
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
