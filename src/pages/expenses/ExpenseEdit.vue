<template>
  <div
    class="pt-[88px] px-[31px] pb-6 min-h-screen w-[390px] mx-auto"
    style="background-color: #2f2f2f"
  >
    <Header
      :showBack="true"
      :title="isNewTransaction ? '소비 내역 추가' : '소비 내역'"
    />

    <!-- 선 구분 -->
    <div class="border-t border-[#414141] mb-6"></div>

    <!-- 거래처명 -->
    <div class="mb-6">
      <input
        v-model="editableData.name"
        type="text"
        class="text-white text-2xl font-semibold bg-transparent border-none outline-none w-full"
        placeholder="이름을 입력하세요"
      />
    </div>

    <!-- 폼 필드들 -->
    <div class="space-y-6">
      <!-- 분류 -->
      <div class="pb-4 border-b border-[#575757]">
        <div class="flex items-center justify-between">
          <span class="text-white text-base font-medium">분류</span>
          <div class="flex gap-2">
            <button
              @click="editableData.type = 'income'"
              :class="[
                'px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 border hover:bg-white hover:text-[#2f2f2f] active:bg-white active:text-[#2f2f2f]',
                editableData.type === 'income'
                  ? 'bg-white text-[#2f2f2f] border-white'
                  : 'bg-[#2f2f2f] text-white border-white',
              ]"
            >
              수입
            </button>
            <button
              @click="editableData.type = 'expense'"
              :class="[
                'px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 border hover:bg-[#ff5555] hover:text-white active:bg-[#ff5555] active:text-white',
                editableData.type === 'expense'
                  ? 'bg-[#ff5555] text-white border-[#ff5555]'
                  : 'bg-[#2f2f2f] text-[#ff5555] border-[#ff5555]',
              ]"
            >
              지출
            </button>
          </div>
        </div>
      </div>

      <!-- 금액 -->
      <div class="pb-4 border-b border-[#575757]">
        <div class="flex items-center justify-between">
          <span class="text-white text-base font-medium">금액</span>
          <div class="flex items-center">
            <input
              v-model="editableData.amount"
              type="number"
              class="text-white text-base font-medium bg-transparent border-none outline-none text-right w-20"
              placeholder="0"
            />
            <span class="text-white text-base font-medium ml-2">원</span>
          </div>
        </div>
      </div>

      <!-- 카테고리 -->
      <div class="pb-4 border-b border-[#575757]">
        <div class="flex justify-between items-center">
          <span class="text-white text-base font-medium">카테고리</span>
          <button
            @click="showCategoryModal = true"
            class="text-white text-base font-medium text-right hover:text-[#ff5555] transition-colors flex items-center gap-2"
          >
            {{ editableData.category || '미선택' }}
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path
                d="M2 4L6 8L2 12"
                stroke="#FFFFFF"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 날짜 -->
      <div class="pb-4 border-b border-[#575757]">
        <div class="flex justify-between items-center">
          <span class="text-white text-base font-medium">날짜</span>
          <input
            v-model="editableData.date"
            type="date"
            class="text-white text-base font-medium bg-transparent border-none outline-none text-right"
          />
        </div>
      </div>

      <!-- 시간 -->
      <div class="pb-4 border-b border-[#575757]">
        <div class="flex justify-between items-center">
          <span class="text-white text-base font-medium">시간</span>
          <input
            v-model="editableData.time"
            type="time"
            class="text-white text-base font-medium bg-transparent border-none outline-none text-right"
          />
        </div>
      </div>
    </div>

    <!-- 버튼들 -->
    <div class="flex gap-3 mt-12 mb-16">
      <button
        @click="isNewTransaction ? cancelAdd : deleteTransaction"
        class="flex-shrink-0 w-24 h-14 bg-[#c9c9c9] text-[#414141] rounded-16 font-medium transition-colors duration-200 hover:bg-[#b5b5b5]"
      >
        {{ isNewTransaction ? '취소' : '삭제' }}
      </button>
      <button
        @click="saveTransaction"
        class="flex-1 h-14 bg-[#ff5555] text-white rounded-16 font-medium transition-colors duration-200 hover:bg-red-600"
      >
        저장
      </button>
    </div>

    <!-- 카테고리 선택 모달 -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-end z-[9999]"
    >
      <div
        class="bg-[#2f2f2f] w-full rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-white text-xl font-semibold">카테고리 선택</h3>
          <button
            @click="showCategoryModal = false"
            class="text-white text-2xl"
          >
            &times;
          </button>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectCategoryFromModal(category)"
            :class="[
              'p-4 rounded-lg text-left transition-colors',
              editableData.category === category
                ? 'bg-[#ff5555] text-white'
                : 'bg-[#414141] text-white hover:bg-[#575757]',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExpensesStore } from '../../stores/expenses.js';
import Header from '../../components/layout/Header.vue';

const router = useRouter();
const route = useRoute();
const expensesStore = useExpensesStore();

// 라우트 파라미터로 거래 ID를 받음
const transactionId = route.params.id;
const isNewTransaction = !transactionId || transactionId === 'new';

// 스토어에서 거래내역 데이터 가져오기
const transactionData = computed(() => {
  if (isNewTransaction) {
    // 새 거래 추가 모드
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return {
      id: 'new',
      name: '',
      type: 'expense',
      amount: 0,
      category: '그외',
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`,
    };
  }

  const transaction = expensesStore.getTransactionById(transactionId);
  return (
    transaction || {
      id: transactionId,
      name: '알 수 없는 거래',
      type: 'expense',
      amount: 0,
      category: '그외',
      date: '2025-07-08',
      time: '00:00',
    }
  );
});

// 편집 가능한 데이터
const editableData = reactive({
  name: '',
  type: 'expense',
  amount: 0,
  category: '그외',
  date: new Date().toISOString().split('T')[0], // 현재 날짜로 초기화
  time: '00:00',
});

// 모달 상태
const showCategoryModal = ref(false);

// 카테고리 목록 (스토어에서 가져오기)
const categories = expensesStore.categories;

// 카테고리 선택
const selectCategoryFromModal = (category) => {
  editableData.category = category;
  showCategoryModal.value = false;
  console.log('카테고리 변경:', category);
};

// 입력 유효성 검사
const validateInput = () => {
  if (!editableData.name.trim()) {
    alert('거래처명을 입력해주세요.');
    return false;
  }
  if (!editableData.amount || editableData.amount <= 0) {
    alert('올바른 금액을 입력해주세요.');
    return false;
  }
  if (!editableData.category) {
    alert('카테고리를 선택해주세요.');
    return false;
  }
  return true;
};

// 거래 데이터 생성
const createTransactionData = () => ({
  name: editableData.name,
  type: editableData.type,
  amount: Number(editableData.amount),
  category: editableData.category,
  date: editableData.date,
  time: editableData.time,
});

// 저장
const saveTransaction = () => {
  if (!validateInput()) return;

  const transactionData = createTransactionData();
  let success = false;

  if (isNewTransaction) {
    success = expensesStore.addTransaction(transactionData);
  } else {
    success = expensesStore.updateTransaction(transactionId, transactionData);
  }

  if (success) {
    console.log('저장할 데이터:', transactionData);
    alert(
      isNewTransaction
        ? '거래내역이 추가되었습니다.'
        : '거래내역이 수정되었습니다.'
    );
    router.back();
  } else {
    alert('저장에 실패했습니다. 다시 시도해주세요.');
  }
};

// 취소
const cancelAdd = () => {
  router.back();
};

// 거래내역 삭제
const deleteTransaction = () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    const success = expensesStore.deleteTransaction(transactionId);
    if (success) {
      console.log('삭제할 거래내역 ID:', transactionId);
      alert('거래내역이 삭제되었습니다.');
      router.back();
    } else {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }
};

onMounted(() => {
  console.log('거래내역 수정 페이지 로드, ID:', transactionId);
  console.log('거래내역 데이터:', transactionData.value);

  // 기존 거래 수정 시에만 데이터 초기화
  if (!isNewTransaction) {
    const data = transactionData.value;
    editableData.name = data.name;
    editableData.type = data.type;
    editableData.amount = data.amount;
    editableData.category = data.category;
    editableData.date = data.date;
    editableData.time = data.time;
  }
});
</script>

<style scoped>
/* Chrome에서 number input의 스피너 제거 */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox에서 number input의 스피너 제거 */
input[type='number'] {
  -moz-appearance: textfield;
}

/* 시간 입력 필드 스타일링 */
input[type='time'] {
  color-scheme: dark;
}

/* 날짜와 시간 입력 필드의 아이콘 숨기기 */
input[type='date']::-webkit-calendar-picker-indicator,
input[type='time']::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

input[type='date']::-webkit-inner-spin-button,
input[type='time']::-webkit-inner-spin-button {
  display: none;
  -webkit-appearance: none;
}

input[type='date']::-webkit-clear-button,
input[type='time']::-webkit-clear-button {
  display: none;
  -webkit-appearance: none;
}
</style>
