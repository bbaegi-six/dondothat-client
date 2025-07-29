import { defineStore } from 'pinia';

// 상수 정의
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  SAVINGS: 'savings',
};

const COLORS = {
  INCOME: '#72e39c',
  EXPENSE: '#ff5555',
  DEFAULT: '#c9c9c9',
};

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    // 전체 거래내역 데이터 (월별로 구분)
    allTransactions: {
      6: [
        {
          id: 'jun-1',
          name: '스타벅스',
          category: '카페',
          amount: 4500,
          type: 'expense',
          time: '14:30',
          date: '2025-06-30',
        },
        {
          id: 'jun-2',
          name: '지하철',
          category: '교통',
          amount: 1370,
          type: 'expense',
          time: '09:15',
          date: '2025-06-30',
        },
      ],
      7: [
        {
          id: 'gs25-1',
          name: 'GS25 군자점',
          category: '편의점',
          amount: 5000,
          type: 'expense',
          time: '18:59',
          date: '2025-07-08',
        },
        {
          id: 'subway-1',
          name: '서울교통공사',
          category: '교통',
          amount: 1500,
          type: 'expense',
          time: '18:59',
          date: '2025-07-08',
        },
        {
          id: 'lotteria-1',
          name: '롯데리아 군자점',
          category: '배달음식',
          amount: 18000,
          type: 'expense',
          time: '18:59',
          date: '2025-07-08',
        },
        {
          id: 'gs25-2',
          name: 'GS25 군자점',
          category: '편의점',
          amount: 5000,
          type: 'expense',
          time: '18:59',
          date: '2025-07-07',
        },
        {
          id: 'subway-2',
          name: '서울교통공사',
          category: '교통',
          amount: 1500,
          type: 'expense',
          time: '18:59',
          date: '2025-07-07',
        },
      ],
      8: [
        {
          id: 'aug-1',
          name: '카카오페이',
          category: '그외',
          amount: 50000,
          type: 'income',
          time: '10:00',
          date: '2025-08-01',
        },
        {
          id: 'aug-2',
          name: '맥도날드',
          category: '식비',
          amount: 8900,
          type: 'expense',
          time: '12:30',
          date: '2025-08-01',
        },
      ],
    },
    // 현재 선택된 월
    currentMonth: 7,
    // 로딩 상태
    loading: false,
    // 에러 상태
    error: null,
    // 카테고리 목록과 메타데이터
    categories: [
      '배달음식',
      '카페',
      '쇼핑',
      '택시',
      '편의점',
      '문화',
      '술',
      '교통',
      '의료',
      '생활',
      '식비',
      '그외',
      '수입',
    ],
    // 카테고리별 메타데이터 (아이콘, 색상 등)
    categoryMetadata: {
      배달음식: { icon: 'fas fa-motorcycle', color: '#ff7376' },
      카페: { icon: 'fas fa-mug-saucer', color: '#ff9595' },
      쇼핑: { icon: 'fas fa-bag-shopping', color: '#ffa66f' },
      택시: { icon: 'fas fa-taxi', color: '#ffc457' },
      편의점: { icon: 'fas fa-store', color: '#ffe7ac' },
      문화: { icon: 'fas fa-clapperboard', color: '#cde897' },
      술: { icon: 'fas fa-wine-bottle', color: '#72e39c' },
      교통: { icon: 'fas fa-train-subway', color: '#8cc2ff' },
      의료: { icon: 'fas fa-suitcase-medical', color: '#8f95ec' },
      생활: { icon: 'fas fa-home', color: '#cf8fec' },
      식비: { icon: 'fas fa-utensils', color: '#f680db' },
      그외: { icon: 'fas fa-ellipsis', color: '#c9c9c9' },
      수입: { icon: 'fas fa-coins', color: '#ffffff' },
    },
    // 저금통 데이터
    savingsData: [
      {
        id: 'savings-1',
        name: '편의점 금지 챌린지',
        category: '편의점',
        amount: 5000,
        type: 'savings',
        time: '18:59',
        date: '2025-07-12',
      },
      {
        id: 'savings-2',
        name: '배달음식 금지 챌린지',
        category: '배달음식',
        amount: 18000,
        type: 'savings',
        time: '18:59',
        date: '2025-07-25',
      },
    ],
  }),

  getters: {
    // 현재 월의 거래내역
    currentMonthTransactions: (state) => {
      return state.allTransactions[state.currentMonth] || [];
    },

    // 날짜별로 그룹화된 거래내역
    groupedTransactions: (state) => {
      const transactions = state.allTransactions[state.currentMonth] || [];
      const groups = {};
      transactions.forEach((transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(transaction);
      });
      return groups;
    },

    // 월별 수입 총액
    monthlyIncome: (state) => {
      const transactions = state.allTransactions[state.currentMonth] || [];
      return transactions
        .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
    },

    // 월별 지출 총액
    monthlyExpense: (state) => {
      const transactions = state.allTransactions[state.currentMonth] || [];
      return transactions
        .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
    },

    // 특정 거래내역 조회
    getTransactionById: (state) => {
      return (id) => {
        for (const month in state.allTransactions) {
          const transaction = state.allTransactions[month].find(
            (t) => t.id === id
          );
          if (transaction) {
            return transaction;
          }
        }
        return null;
      };
    },

    // 총 저금 금액
    totalSavings: (state) => {
      return state.savingsData.reduce((sum, item) => sum + item.amount, 0);
    },

    // 날짜별로 그룹화된 저금통 데이터
    groupedSavingsData: (state) => {
      const groups = {};
      state.savingsData.forEach((item) => {
        const date = item.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(item);
      });
      return groups;
    },
  },

  actions: {
    // 월 변경
    setCurrentMonth(month) {
      if (month >= 1 && month <= 12) {
        this.currentMonth = month;
      }
    },

    // 이전 월로 이동
    previousMonth() {
      if (this.currentMonth > 1) {
        this.currentMonth--;
      }
    },

    // 다음 월로 이동
    nextMonth() {
      if (this.currentMonth < 12) {
        this.currentMonth++;
      }
    },

    // 거래내역 추가
    addTransaction(transaction) {
      try {
        const month = new Date(transaction.date).getMonth() + 1;
        if (!this.allTransactions[month]) {
          this.allTransactions[month] = [];
        }
        this.allTransactions[month].push({
          ...transaction,
          id: this.generateId(),
        });
        return true;
      } catch (error) {
        console.error('거래내역 추가 실패:', error);
        return false;
      }
    },

    // 거래내역 수정
    updateTransaction(id, updatedData) {
      for (const month in this.allTransactions) {
        const index = this.allTransactions[month].findIndex((t) => t.id === id);
        if (index !== -1) {
          this.allTransactions[month][index] = {
            ...this.allTransactions[month][index],
            ...updatedData,
          };
          return true;
        }
      }
      return false;
    },

    // 거래내역 삭제
    deleteTransaction(id) {
      for (const month in this.allTransactions) {
        const index = this.allTransactions[month].findIndex((t) => t.id === id);
        if (index !== -1) {
          this.allTransactions[month].splice(index, 1);
          return true;
        }
      }
      return false;
    },

    // 날짜별 지출 총액 계산
    getDailyTotal(transactions) {
      const total = transactions
        .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
      return total > 0
        ? this.formatAmount(total, TRANSACTION_TYPES.EXPENSE)
        : '0원';
    },

    // 날짜 포맷팅
    formatDate(dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weekday = weekdays[date.getDay()];
      return `${month}월 ${day}일 (${weekday})`;
    },

    // ID 생성 (간단한 구현)
    generateId() {
      return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    // API 호출 시뮬레이션 (향후 실제 API로 교체)
    async fetchTransactions() {
      this.loading = true;
      try {
        // 실제 API 호출 로직이 들어갈 자리
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // this.allTransactions = response.data
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // 에러 초기화
    clearError() {
      this.error = null;
    },

    // 날짜별 저금 총액 계산
    getDailySavingsTotal(items) {
      const total = items.reduce((sum, item) => sum + item.amount, 0);
      return total > 0
        ? this.formatAmount(total, TRANSACTION_TYPES.INCOME)
        : '0원';
    },

    // 카테고리 메타데이터 조회
    getCategoryMetadata(category) {
      return (
        this.categoryMetadata[category] || {
          icon: 'fas fa-question-circle',
          color: COLORS.DEFAULT,
        }
      );
    },

    // 금액 포맷팅 (공통 유틸리티)
    formatAmount(amount, type = TRANSACTION_TYPES.EXPENSE) {
      const formattedAmount = new Intl.NumberFormat('ko-KR').format(
        Math.abs(amount)
      );
      const prefix = type === TRANSACTION_TYPES.EXPENSE ? '-' : '+';
      return `${prefix}${formattedAmount}원`;
    },

    // 거래 유형별 색상 반환
    getTransactionTypeColor(type) {
      return type === TRANSACTION_TYPES.INCOME ? COLORS.INCOME : COLORS.EXPENSE;
    },
  },
});
