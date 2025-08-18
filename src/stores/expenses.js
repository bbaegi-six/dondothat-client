import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { expensesService } from '@/services/expensesService';
import router from '@/router';
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
            name: item.description, // description -> name
            category: item.categoryName, // categoryName -> category
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

  // Codef 거래내역 새로고침
  async function refreshFromCodef() {
    loading.value = true;
    error.value = null;
    try {
      await expensesService.refreshExpensesFromCodef();
      // 새로고침 후 데이터 다시 로드
      await fetchExpensesFromAPI();
      return true;
    } catch (err) {
      error.value = err.message;
      console.error('Codef 새로고침 실패:', err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 지출 내역 추가
  async function addTransaction(transactionData) {
    try {
      // 스토어에서 직접 데이터 변환
      const apiData = transformTransactionToApiFormat(transactionData);
      await expensesService.createExpense(apiData);
      return true;
    } catch (error) {
      console.error('거래내역 추가 실패:', error);
      return false;
    }
  }

  // 지출 내역 수정
  async function updateTransaction(id, updatedData) {
    try {
      // 스토어에서 직접 데이터 변환
      const apiData = transformTransactionToApiFormat(updatedData);
      await expensesService.updateExpense(id, apiData);
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

  // 카테고리 마스터 데이터 통합 (ID, 아이콘, 색상 포함)
  const categoryMasterData = {
    배달음식: { id: 1, icon: 'fas fa-motorcycle', color: '#ff7376' },
    카페: { id: 2, icon: 'fas fa-mug-saucer', color: '#ff9595' },
    쇼핑: { id: 3, icon: 'fas fa-bag-shopping', color: '#ffa66f' },
    택시: { id: 4, icon: 'fas fa-taxi', color: '#ffc457' },
    편의점: { id: 5, icon: 'fas fa-store', color: '#ffe7ac' },
    문화: { id: 6, icon: 'fas fa-clapperboard', color: '#cde897' },
    술: { id: 7, icon: 'fas fa-wine-bottle', color: '#72e39c' },
    교통: { id: 8, icon: 'fas fa-train-subway', color: '#8cc2ff' },
    의료: { id: 9, icon: 'fas fa-suitcase-medical', color: '#8f95ec' },
    생활: { id: 10, icon: 'fas fa-home', color: '#cf8fec' },
    식비: { id: 11, icon: 'fas fa-utensils', color: '#f680db' },
    그외: { id: 12, icon: 'fas fa-ellipsis', color: '#c9c9c9' },
    수입: { id: 13, icon: 'fas fa-coins', color: '#ffffff' },
    기타: { id: 12, icon: 'fas fa-ellipsis', color: '#c9c9c9' }, // 그외와 동일
  };

  // 카테고리 목록 (순서 유지)
  const categories = Object.keys(categoryMasterData).filter(
    (key) => key !== '기타'
  );

  // 카테고리 관련 유틸리티 함수들
  const getCategoryMetadata = (category) => {
    return categoryMasterData[category] || categoryMasterData['그외'];
  };

  const getCategoryIdByName = (categoryName) => {
    return categoryMasterData[categoryName]?.id || 12;
  };

  const getCategoryNameById = (categoryId) => {
    return (
      Object.keys(categoryMasterData).find(
        (name) => categoryMasterData[name].id === categoryId
      ) || '그외'
    );
  };

  const getCategoryColorByName = (categoryName) => {
    return categoryMasterData[categoryName]?.color || '#c9c9c9';
  };

  // 🏠 홈페이지 전용: 항상 현재 월 데이터 (expenses 페이지 월 선택과 독립적)
  const homeCurrentMonthTransactions = computed(() => {
    if (!Array.isArray(transactions.value)) return [];
    const actualCurrentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    return transactions.value.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const isCurrentMonth =
        transactionDate.getMonth() + 1 === actualCurrentMonth &&
        transactionDate.getFullYear() === currentYear;

      // 수입 카테고리 제외하고 지출만 반환
      const isExpense = transaction.category !== '수입';

      return isCurrentMonth && isExpense;
    });
  });

  // 🏠 홈페이지 전용: 현재 월 지출 요약
  const homeMonthlyExpense = computed(() => {
    if (!Array.isArray(homeCurrentMonthTransactions.value)) return 0;
    return homeCurrentMonthTransactions.value.reduce((sum, t) => {
      return sum + Math.abs(t.amount);
    }, 0);
  });

  // 🏠 홈페이지 전용: 차트 데이터 (항상 현재 월)
  const homeChartData = computed(() => {
    const categoryMap = new Map();

    homeCurrentMonthTransactions.value
      .filter((transaction) => transaction.category !== '수입')
      .forEach((transaction) => {
        const categoryName = transaction.category || '기타';
        const amount = transaction.amount || 0;
        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + amount
        );
      });

    return Array.from(categoryMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        color: getCategoryColorByName(name),
      }))
      .sort((a, b) => b.amount - a.amount);
  });

  // 📊 expenses 페이지용: 차트 데이터 (선택된 월)
  const chartData = computed(() => {
    const categoryMap = new Map();

    currentMonthTransactions.value
      .filter((transaction) => transaction.category !== '수입')
      .forEach((transaction) => {
        const categoryName = transaction.category || '기타';
        const amount = transaction.amount || 0;
        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + amount
        );
      });

    return Array.from(categoryMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        color: getCategoryColorByName(name),
      }))
      .sort((a, b) => b.amount - a.amount);
  });

  // 금액 포맷팅 함수들 통합
  const formatAmount = (amount, category = null) => {
    const formattedAmount = Math.abs(amount).toLocaleString();
    // 수입 카테고리인 경우
    if (category === '수입') {
      return `+${formattedAmount}원`;
    }
    return `-${formattedAmount}원`;
  };

  const formatCurrency = (amount, options = {}) => {
    const { showSign = false, showPlus = false } = options;
    const formattedAmount = Math.abs(amount).toLocaleString();

    if (showSign && amount < 0) return `-${formattedAmount}원`;
    if (showPlus && amount > 0) return `+${formattedAmount}원`;
    if (showSign || showPlus) return `${formattedAmount}원`;
    return `${formattedAmount}원`;
  };

  // 네비게이션 액션들
  const navigateToExpenseEdit = (transactionId) => {
    router.push(`/expenses/${transactionId}`);
  };

  const navigateToExpenseAdd = () => {
    router.push('/expenses/new');
  };

  const navigateToExpenses = () => {
    router.push('/expenses');
  };

  const navigateToHome = () => {
    router.push('/');
  };

  // API 데이터 변환 함수들
  const transformApiResponseToTransaction = (apiItem) => {
    const dateObj = apiItem.expenditureDate
      ? new Date(apiItem.expenditureDate)
      : new Date();
    return {
      id: apiItem.expenditureId,
      name: apiItem.description || '거래내역',
      category: getCategoryNameById(apiItem.categoryId) || '기타',
      amount: apiItem.amount || 0,
      date: dateObj.toISOString().split('T')[0],
      time: dateObj.toTimeString().slice(0, 5),
    };
  };

  const transformTransactionToApiFormat = (formData) => {
    // 날짜와 시간이 없으면 현재 값으로 대체하지 않고 그대로 사용
    const date = formData.date;
    const time = formData.time;

    return {
      amount: parseFloat(formData.amount),
      categoryId: getCategoryIdByName(formData.category),
      description: formData.name, // 기본값 제거
      expenditureDate: `${date} ${time}:00`,
      // assetId는 백엔드에서 자동으로 main 계좌 ID 설정
    };
  };

  // ID로 거래내역 조회 함수 추가 (ExpenseEdit.vue에서 필요)
  const getTransactionById = (id) => {
    return transactions.value.find((transaction) => transaction.id == id);
  };

  // 날짜 유틸리티 함수들
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[date.getDay()];
    return `${month}월 ${day}일 (${dayName})`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
    };
  };

  const formatDateForApi = (date, time = '00:00') => {
    return `${date} ${time}:00`;
  };

  // 거래 내역 유효성 검사
  const validateTransaction = (data) => {
    const errors = [];

    if (!data.name?.trim()) {
      errors.push('거래처명을 입력해주세요.');
    }

    if (!data.amount || data.amount <= 0) {
      errors.push('올바른 금액을 입력해주세요.');
    }

    if (!data.category) {
      errors.push('카테고리를 선택해주세요.');
    }

    // 날짜 검증 강화 (undefined, null, 빈 문자열 체크)
    if (!data.date || data.date === 'undefined' || data.date.trim() === '') {
      errors.push('날짜를 선택해주세요.');
    }

    // 날짜 형식 검증 (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (data.date && !datePattern.test(data.date)) {
      errors.push('올바른 날짜 형식이 아닙니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // 새 거래 템플릿 생성
  const createNewTransactionTemplate = () => {
    const { date, time } = getCurrentDateTime();
    return {
      id: 'new',
      name: '',
      type: 'expense',
      amount: 0,
      category: '그외',
      date,
      time,
    };
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
    categoryMasterData, // Exposed for external use
    chartData,
    fetchExpensesFromAPI,
    refreshFromCodef,
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
    getCategoryIdByName,
    getCategoryNameById,
    getCategoryColorByName,
    formatAmount,
    formatCurrency,
    navigateToExpenseEdit,
    navigateToExpenseAdd,
    navigateToExpenses,
    navigateToHome,
    transformApiResponseToTransaction,
    transformTransactionToApiFormat,
    getTransactionById,
    formatDisplayDate,
    getCurrentDateTime,
    formatDateForApi,
    validateTransaction,
    createNewTransactionTemplate,
  };
});
