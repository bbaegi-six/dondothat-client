<template>
  <div
    class="pt-[60px] px-[31px] pb-[90px] min-h-screen w-[390px] mx-auto"
    style="background-color: #2f2f2f"
  >
    <Header
      :showBack="false"
      title="소비 내역"
      :showAddButton="true"
      @add-click="addTransaction"
    />

    <!-- 월별 요약 섹션 -->
    <div
      class="bg-[#414141] rounded-2xl mb-6 relative"
      style="margin-top: 20px; width: 328px; height: 131px; padding: 16px 18px"
    >
      <!-- 월 선택 헤더 -->
      <div class="flex items-center justify-start mb-4 gap-8">
        <button
          @click="previousMonth"
          class="w-[10px] h-4 flex items-center justify-center"
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
        <h2
          class="text-white font-bold text-left"
          style="font-family: Pretendard; font-size: 20px; line-height: 32px"
        >
          {{ currentMonthDisplay }}월
        </h2>
        <button
          @click="nextMonth"
          class="w-[10px] h-4 flex items-center justify-center"
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

      <!-- 수입/지출 요약 -->
      <div class="flex" style="gap: 38px">
        <div class="flex flex-col" style="width: 145px">
          <p
            class="text-white font-medium text-center"
            style="
              font-family: Pretendard;
              font-size: 16px;
              line-height: 21px;
              margin-bottom: 3px;
            "
          >
            수입
          </p>
          <p
            class="text-white font-bold text-center"
            style="font-family: Pretendard; font-size: 20px; line-height: 28px"
          >
            {{ monthlyIncome.toLocaleString() }}원
          </p>
        </div>
        <div class="flex flex-col" style="width: 145px">
          <p
            class="text-[#FF5555] font-medium text-center"
            style="
              font-family: Pretendard;
              font-size: 16px;
              line-height: 21px;
              margin-bottom: 3px;
            "
          >
            지출
          </p>
          <p
            class="text-[#FF5555] font-bold text-center"
            style="font-family: Pretendard; font-size: 20px; line-height: 28px"
          >
            {{ monthlyExpense.toLocaleString() }}원
          </p>
        </div>
      </div>
    </div>

    <!-- 거래내역 리스트 -->
    <div class="space-y-0" v-if="currentMonthTransactions.length > 0">
      <!-- 날짜별 그룹 -->
      <div
        v-for="(group, date) in groupedTransactions"
        :key="date"
        class="mb-4"
      >
        <div class="flex justify-between items-center mb-3 px-4">
          <p class="text-white text-sm font-medium">{{ formatDate(date) }}</p>
          <p class="text-[#ff6b6b] text-sm font-semibold">
            {{ getDailyTotal(group) }}
          </p>
        </div>
        <div class="border-t border-[#414141] mx-4 mb-2"></div>

        <!-- 거래내역 아이템들 -->
        <div class="space-y-0">
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
      <p class="text-[#9ca3af] text-sm">
        {{ currentMonthDisplay }}월의 거래내역이 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useExpensesStore } from '../../stores/expenses.js';
import Header from '../../components/layout/Header.vue';
import TransactionCard from '../../components/expenses/TransactionCard.vue';

const router = useRouter();
const expensesStore = useExpensesStore();

// 계산된 속성들 (스토어에서 가져옴)
const currentMonthDisplay = computed(() => expensesStore.currentMonth);
const currentMonthTransactions = computed(
  () => expensesStore.currentMonthTransactions
);
const groupedTransactions = computed(() => expensesStore.groupedTransactions);
const monthlyIncome = computed(() => expensesStore.monthlyIncome);
const monthlyExpense = computed(() => expensesStore.monthlyExpense);

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
  router.push(`/expenses/edit/${transaction.id}`);
};

const addTransaction = () => {
  // TODO: 새 거래 추가 페이지로 이동
  console.log('새 거래 추가 버튼 클릭');
  alert('새 거래 추가 기능은 추후 구현 예정입니다.');
};
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
