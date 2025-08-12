<template>
  <div
    class="min-h-screen w-[390px] mx-auto relative"
    style="
      background-color: #2f2f2f;
      padding-top: 88px;
      padding-left: 31px;
      padding-right: 31px;
      padding-bottom: 90px;
    "
  >
    <Header
      :showBack="false"
      title="내역"
      :showAddButton="true"
      @add-click="refreshExpenses"
    />

    <!-- 탭 -->
    <div style="width: 328px; height: 38px; margin-top: 4px; display: flex">
      <div
        @click="switchTab('account')"
        style="
          width: 164px;
          height: 37px;
          background-color: #2f2f2f;
          position: relative;
          cursor: pointer;
        "
      >
        <div
          :style="{
            fontFamily: 'Pretendard',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '16px',
            lineHeight: '32px',
            textAlign: 'center',
            color: activeTab === 'account' ? '#ff5555' : '#ffffff',
            paddingTop: '2px',
          }"
        >
          내 계좌
        </div>
        <div
          v-if="activeTab === 'account'"
          style="
            position: absolute;
            bottom: 0;
            width: 164px;
            height: 0px;
            border: 1px solid #ff5555;
          "
        ></div>
      </div>
      <div
        @click="switchTab('savings')"
        style="
          width: 164px;
          height: 37px;
          background-color: #2f2f2f;
          position: relative;
          cursor: pointer;
        "
      >
        <div
          :style="{
            fontFamily: 'Pretendard',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '16px',
            lineHeight: '32px',
            textAlign: 'center',
            color: activeTab === 'savings' ? '#ff5555' : '#ffffff',
            paddingTop: '2px',
          }"
        >
          저금통
        </div>
        <div
          v-if="activeTab === 'savings'"
          style="
            position: absolute;
            bottom: 0;
            width: 164px;
            height: 0px;
            border: 1px solid #ff5555;
          "
        ></div>
      </div>
    </div>

    <!-- 내 계좌 섹션 -->
    <div v-if="activeTab === 'account'">
      <!-- 월별 요약 섹션 -->
      <div
        class="relative"
        style="
          width: 328px;
          height: 120px;
          background-color: #414141;
          border-radius: 16px;
          margin-top: 10px;
        "
      >
        <!-- 월 표시 -->
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 700;
            font-size: 14px;
            line-height: 32px;
            text-align: center;
            color: #ffffff;
            position: absolute;
            left: 149px;
            top: 4px;
            width: 30px;
            height: 32px;
          "
        >
          {{ currentMonthDisplay }}월
        </div>

        <!-- 총 지출 타이틀 -->
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 32px;
            text-align: center;
            color: #ffffff;
            position: absolute;
            left: 136px;
            top: 40px;
            width: 58px;
            height: 21px;
          "
        >
          총 지출
        </div>

        <!-- 금액 -->
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            text-align: center;
            color: #ff5555;
            position: absolute;
            left: 13px;
            top: 75px;
            width: 302px;
            height: 28px;
          "
        >
          {{ monthlyExpense.toLocaleString() }}원
        </div>

        <!-- 월 변경 버튼들 -->
        <button
          @click="previousMonth"
          class="absolute w-[20px] h-[20px] flex items-center justify-center bg-transparent border-none"
          style="left: 120px; top: 10px"
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
        <button
          @click="nextMonth"
          class="absolute w-[20px] h-[20px] flex items-center justify-center bg-transparent border-none"
          style="right: 120px; top: 10px"
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
    </div>

    <!-- 저금통 섹션 -->
    <div v-if="activeTab === 'savings'">
      <!-- 저금통 요약 섹션 -->
      <div
        class="relative"
        style="
          width: 328px;
          height: 120px;
          background-color: #414141;
          border-radius: 16px;
          margin-top: 10px;
        "
      >
        <!-- 저금통 타이틀 -->
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 32px;
            text-align: center;
            color: #ffffff;
            position: absolute;
            left: 88px;
            top: 35px;
            width: 153px;
            height: 21px;
          "
        >
          지금까지 절약한 금액
        </div>

        <!-- 금액 -->
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            text-align: center;
            color: #ff5555;
            position: absolute;
            left: 13px;
            top: 60px;
            width: 302px;
            height: 28px;
          "
        >
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
          <div
            style="
              margin-top: 28px;
              width: 328px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div
              style="
                font-family: 'Pretendard';
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 32px;
                color: #ffffff;
              "
            >
              {{ formatDate(date) }}
            </div>
            <div
              style="
                font-family: 'Pretendard';
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 24px;
                color: #ffffff;
              "
            >
              {{ getDailyTotal(group) }}
            </div>
          </div>

          <!-- 구분선 -->
          <div
            style="
              width: 328px;
              height: 0px;
              border: 1px solid #414141;
              margin-top: 0px;
            "
          ></div>

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
      class="fixed"
      style="
        bottom: 80px;
        right: calc((100vw - 390px) / 2 + 31px);
        width: 48px;
        height: 48px;
        background-color: #ff5555;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      "
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
import { useRouter } from 'vue-router';
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
  console.log('지출 내역 새로고침 시작');
  try {
    await expensesStore.fetchExpensesFromAPI();
    console.log('지출 내역 새로고침 완료');
  } catch (error) {
    console.error('지출 내역 새로고침 실패:', error);
  }
};
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
