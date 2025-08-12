import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { expensesService } from '@/services/expensesService';
// API  서비스 import

export const useExpensesStore = defineStore('expenses', () => {
  // --- 상태 (State) ---
  const transactions = ref([]);
  const currentMonth = ref(new Date().getMonth() + 1);
  const loading = ref(false);
  const error = ref(null);

  // --- 게터 (Getters) ---
  // 현재 월의 거래내역 필터링
  const currentMonthTransactions = computed(() => {
    if (!Array.isArray(transactions.value)) return [];
    const currentYear = new Date().getFullYear();
    return transactions.value.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isCurrentMonth =
        transactionDate.getMonth() + 1 === currentMonth.value &&
        transactionDate.getFullYear() === currentYear;

      // 수입 카테고리 제외하고 지출만 반환
      const isExpense = transaction.category !== '수입';

      return isCurrentMonth && isExpense;
    });
  });

  const groupedTransactions = computed(() => {
    const groups = {};
    if (Array.isArray(currentMonthTransactions.value)) {
      currentMonthTransactions.value.forEach((transaction) => {
        const date = transaction.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(transaction);
      });
    }
    return groups;
  });

  const monthlyExpense = computed(() => {
    if (!Array.isArray(currentMonthTransactions.value)) return 0;
    return currentMonthTransactions.value.reduce((sum, t) => {
      // 지출만 합계 (수입은 이미 currentMonthTransactions에서 제외됨)
      return sum + Math.abs(t.amount);
    }, 0);
  });

  // 저금통 관련 computed 추가
  const totalSavings = computed(() => {
    // 저금통 데이터가 있다면 계산, 없으면 0
    return 0; // 실제 저금통 로직 구현 필요
  });

  const groupedSavingsData = computed(() => {
    // 저금통 데이터 그룹핑 로직
    return {}; // 실제 저금통 로직 구현 필요
  });

  // --- 액션 (Actions) ---

  // 지출 내역 불러오기
  async function fetchExpensesFromAPI() {
    loading.value = true;
    error.value = null;
    try {
      const dataFromBackend = await expensesService.fetchExpenses({
        month: currentMonth.value,
      });
      if (Array.isArray(dataFromBackend)) {
        // --- 데이터 변환 로직 ---
        const transformedData = dataFromBackend.map((item) => {
          const dateObj = item.expenditureDate
            ? new Date(item.expenditureDate)
            : new Date();
          return {
            id: item.expenditureId, // expenditureId -> id
            name: item.description || '거래내역', // description -> name
            category: item.categoryName || '기타', // categoryName -> category
            amount: item.amount || 0, // amount는 그대로 사용
            date: dateObj.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식
            time: dateObj.toTimeString().split(' ')[0].substring(0, 5), // 'HH:MM' 형식
          };
        });
        transactions.value = transformedData;
        // ------------------------------------------
      } else {
        transactions.value = []; // 데이터가 배열이 아니면 빈 배열로 초기화
      }
    } catch (err) {
      error.value = err.message;
      console.error(err);
      transactions.value = []; // 에러 발생 시에도 빈 배열로 초기화
    } finally {
      loading.value = false;
    }
  }

  // 지출 내역 추가
  async function addTransaction(transactionData) {
    try {
      await expensesService.createExpense(transactionData);
      await fetchExpensesFromAPI(); // 데이터 변경 후 전체 내역 다시 로드
      return true;
    } catch (error) {
      console.error('거래내역 추가 실패:', error);
      return false;
    }
  }

  // 지출 내역 수정
  async function updateTransaction(id, updatedData) {
    try {
      await expensesService.updateExpense(id, updatedData);
      await fetchExpensesFromAPI(); // 데이터 변경 후 전체 내역 다시 로드
      return true;
    } catch (error) {
      console.error('거래내역 수정 실패:', error);
      return false;
    }
  }

  // 지출 내역 삭제
  async function deleteTransaction(id) {
    try {
      await expensesService.deleteExpense(id);
      await fetchExpensesFromAPI(); // 데이터 변경 후 전체 내역 다시 로드
      return true;
    } catch (error) {
      console.error('거래내역 삭제 실패:', error);
      return false;
    }
  }

  function setCurrentMonth(month) {
    if (month >= 1 && month <= 12) {
      currentMonth.value = month;
    }
  }

  function previousMonth() {
    if (currentMonth.value > 1) setCurrentMonth(currentMonth.value - 1);
  }

  function nextMonth() {
    if (currentMonth.value < 12) setCurrentMonth(currentMonth.value + 1);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${
      ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    })`;
  };

  const getDailyTotal = (transactions) => {
    const expenseTransactions = transactions.filter(
      (t) => t.category !== '수입'
    );
    const total = expenseTransactions.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    );
    return total > 0 ? `-${total.toLocaleString()}원` : '0원';
  };

  // 누락된 함수들 추가
  const getDailySavingsTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    return `+${total.toLocaleString()}원`;
  };

  // 카테고리 목록 정의
  const categories = [
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
  ];

  // 카테고리 메타데이터 함수 추가
  const getCategoryMetadata = (category) => {
    const categoryMap = {
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
      기타: { icon: 'fas fa-ellipsis', color: '#c9c9c9' },
    };

    return categoryMap[category] || categoryMap['그외'];
  };

  // 금액 포맷팅 함수 추가
  const formatAmount = (amount, category = '') => {
    const formattedAmount = Math.abs(amount).toLocaleString();
    // 수입 카테고리인 경우
    if (category === '수입') {
      return `+${formattedAmount}원`;
    }
    return `-${formattedAmount}원`;
  };

  // ID로 거래내역 조회 함수 추가 (ExpenseEdit.vue에서 필요)
  const getTransactionById = (id) => {
    return transactions.value.find((transaction) => transaction.id == id);
  };

  return {
    transactions,
    currentMonth,
    loading,
    error,
    groupedTransactions,
    currentMonthTransactions,
    monthlyExpense,
    totalSavings,
    groupedSavingsData,
    categories,
    fetchExpensesFromAPI,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setCurrentMonth,
    previousMonth,
    nextMonth,
    formatDate,
    getDailyTotal,
    getDailySavingsTotal,
    getCategoryMetadata,
    formatAmount,
    getTransactionById,
  };
});
