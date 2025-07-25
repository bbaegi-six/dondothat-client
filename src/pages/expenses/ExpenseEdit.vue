<template>
  <div class="pt-[60px] px-6 pb-[90px] bg-dark-bg min-h-screen">
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
        <label class="text-white text-base font-medium block mb-4">금액</label>
        <div class="flex items-center justify-between">
          <input
            v-model="editableData.amount"
            type="number"
            class="text-white text-base font-medium bg-transparent border-none outline-none flex-1 text-right"
            placeholder="0"
          />
          <span class="text-white text-base font-medium ml-2">원</span>
        </div>
      </div>

      <!-- 카테고리 -->
      <div class="pb-4 border-b border-[#575757]">
        <label class="text-white text-base font-medium block mb-4"
          >카테고리</label
        >
        <div class="flex justify-between items-center">
          <span class="text-white">카테고리</span>
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
        <label class="text-white text-base font-medium block mb-4">날짜</label>
        <div class="flex justify-between items-center">
          <span class="text-white">날짜</span>
          <span class="text-white text-base font-medium">{{
            editableData.date
          }}</span>
        </div>
      </div>

      <!-- 시간 -->
      <div class="pb-4 border-b border-[#575757]">
        <label class="text-white text-base font-medium block mb-4">시간</label>
        <div class="flex justify-between items-center">
          <span class="text-white">시간</span>
          <input
            v-model="editableData.time"
            type="time"
            class="text-white text-base font-medium bg-transparent border-none outline-none text-right"
          />
        </div>
      </div>
    </div>

    <!-- 버튼들 -->
    <div class="flex gap-3 mt-12">
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '../../components/layout/Header.vue';

const router = useRouter();
const route = useRoute();

// 라우트 파라미터로 거래 ID를 받음
const transactionId = route.params.id;

// 샘플 거래내역 데이터 (실제로는 API에서 가져와야 함)
const sampleTransactions = {
  'gs25-1': {
    id: 'gs25-1',
    name: 'GS25 군자점',
    type: 'expense',
    amount: 5000,
    category: '편의점',
    date: '2025 / 07 / 08 (월)',
    time: '18:59',
  },
  'subway-1': {
    id: 'subway-1',
    name: '서울교통공사',
    type: 'expense',
    amount: 1500,
    category: '교통',
    date: '2025 / 07 / 08 (월)',
    time: '18:59',
  },
  'lotteria-1': {
    id: 'lotteria-1',
    name: '롯데리아 군자점',
    type: 'expense',
    amount: 18000,
    category: '식비',
    date: '2025 / 07 / 08 (월)',
    time: '18:59',
  },
};

// 거래내역 데이터
const transactionData = ref(
  sampleTransactions[transactionId] || {
    id: transactionId,
    name: '알 수 없는 거래',
    type: 'expense',
    amount: 0,
    category: '기타',
    date: '2025 / 07 / 08 (월)',
    time: '00:00',
  }
);

// 편집 가능한 데이터
const editableData = reactive({
  name: transactionData.value.name,
  type: transactionData.value.type,
  amount: transactionData.value.amount,
  category: transactionData.value.category,
  date: transactionData.value.date,
  time: transactionData.value.time,
});

// 카테고리 선택
const selectCategory = () => {
  const categories = ['편의점', '교통', '식비', '쇼핑', '기타'];
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  editableData.category = randomCategory;
  console.log('카테고리 변경:', randomCategory);
};

// 거래내역 저장
const saveTransaction = () => {
  console.log('저장할 데이터:', editableData);
  alert('저장되었습니다.');
  router.back();
};

// 거래내역 삭제
const deleteTransaction = () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    console.log('삭제할 거래내역 ID:', transactionId);
    alert('삭제되었습니다.');
    router.back();
  }
};

onMounted(() => {
  console.log('거래내역 수정 페이지 로드, ID:', transactionId);
  console.log('거래내역 데이터:', transactionData.value);
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
