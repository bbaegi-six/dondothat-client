<template>
  <div class="pt-[60px] px-6 pb-6 bg-dark-bg min-h-screen">
    <Header :showBack="true" title="소비 내역" />

    <!-- 선 구분 -->
    <div class="border-t border-[#414141] mt-5 mb-6"></div>

    <!-- 거래처명 -->
    <div class="mb-6">
      <h1 class="text-white text-2xl font-semibold">
        {{ transactionData.name || '거래처명 없음' }}
      </h1>
    </div>

    <!-- 폼 필드들 -->
    <div class="space-y-6">
      <!-- 분류 -->
      <div class="pb-4 border-b border-[#575757]">
        <label class="text-white text-base font-medium block mb-4">분류</label>
        <div class="flex gap-2">
          <button
            @click="editableData.type = 'income'"
            :class="[
              'px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200',
              editableData.type === 'income'
                ? 'bg-white text-black border border-white'
                : 'bg-transparent text-white border border-white',
            ]"
          >
            수입
          </button>
          <button
            @click="editableData.type = 'expense'"
            :class="[
              'px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200',
              editableData.type === 'expense'
                ? 'bg-[#ff5555] text-white border border-[#ff5555]'
                : 'bg-transparent text-[#ff5555] border border-[#ff5555]',
            ]"
          >
            지출
          </button>
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
            @click="selectCategory"
            class="text-white text-base font-medium text-right hover:text-[#ff5555] transition-colors"
          >
            {{ editableData.category || '미선택' }}
          </button>
        </div>
      </div>

      <!-- 날짜 -->
      <div class="pb-4 border-b border-[#575757]">
        <div class="flex justify-between items-center">
          <span class="text-white text-base font-medium">날짜</span>
          <span class="text-white text-base font-medium">{{
            editableData.date
          }}</span>
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
        @click="deleteTransaction"
        class="flex-shrink-0 w-24 h-14 bg-[#c9c9c9] text-[#414141] rounded-16 font-medium transition-colors duration-200 hover:bg-[#b5b5b5]"
      >
        삭제
      </button>
      <button
        @click="saveTransaction"
        class="flex-1 h-14 bg-[#ff5555] text-white rounded-16 font-medium transition-colors duration-200 hover:bg-red-600"
      >
        저장
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExpensesStore } from '../../stores/expenses.js';
import Header from '../../components/layout/Header.vue';

const router = useRouter();
const route = useRoute();
const expensesStore = useExpensesStore();

// 라우트 파라미터로 거래 ID를 받음
const transactionId = route.params.id;

// 스토어에서 거래내역 데이터 가져오기
const transactionData = computed(() => {
  const transaction = expensesStore.getTransactionById(transactionId);
  return (
    transaction || {
      id: transactionId,
      name: '알 수 없는 거래',
      type: 'expense',
      amount: 0,
      category: '기타',
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
  category: '기타',
  date: '',
  time: '00:00',
});

// 카테고리 선택
const selectCategory = () => {
  const randomCategory =
    expensesStore.categories[
      Math.floor(Math.random() * expensesStore.categories.length)
    ];
  editableData.category = randomCategory;
  console.log('카테고리 변경:', randomCategory);
};

// 거래내역 저장
const saveTransaction = () => {
  const success = expensesStore.updateTransaction(transactionId, {
    name: editableData.name,
    type: editableData.type,
    amount: Number(editableData.amount),
    category: editableData.category,
    date: editableData.date,
    time: editableData.time,
  });

  if (success) {
    console.log('저장할 데이터:', editableData);
    alert('저장되었습니다.');
    router.back();
  } else {
    alert('저장에 실패했습니다.');
  }
};

// 거래내역 삭제
const deleteTransaction = () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    const success = expensesStore.deleteTransaction(transactionId);
    if (success) {
      console.log('삭제할 거래내역 ID:', transactionId);
      alert('삭제되었습니다.');
      router.back();
    } else {
      alert('삭제에 실패했습니다.');
    }
  }
};

onMounted(() => {
  console.log('거래내역 수정 페이지 로드, ID:', transactionId);
  console.log('거래내역 데이터:', transactionData.value);

  // 편집 가능한 데이터 초기화
  const data = transactionData.value;
  editableData.name = data.name;
  editableData.type = data.type;
  editableData.amount = data.amount;
  editableData.category = data.category;
  editableData.date = data.date;
  editableData.time = data.time;
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

input[type='time']::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
