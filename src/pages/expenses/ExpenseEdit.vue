<template>
  <div
    class="pt-20 px-8 pb-6 min-h-screen w-98 mx-auto"
    style="background-color: #2f2f2f"
  >
    <Header
      :showBack="true"
      :title="isNewTransaction ? '내역 추가' : '내역 수정'"
    />

    <div class="mb-6">
      <input
        v-model="editableData.name"
        type="text"
        class="text-white text-2xl font-semibold bg-transparent border-none outline-none w-full"
        placeholder="이름을 입력하세요"
      />
    </div>

    <div class="space-y-6">
      <div class="pb-4 border-b border-[#575757]">
        <div class="flex items-center justify-between">
          <span class="text-white text-base font-medium">분류</span>
          <div class="flex gap-2">
            <button
              v-show="false"
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

      <div class="pb-4 border-b border-[#575757]">
        <div class="flex justify-between items-center">
          <span class="text-white text-base font-medium">날짜</span>
          <button
            @click="showDateModal = true"
            class="text-white text-base font-medium bg-transparent border-none outline-none text-right flex items-center gap-2"
          >
            {{ expensesStore.formatDisplayDate(editableData.date) }}
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

    <div class="flex gap-3 mt-12 mb-16">
      <button
        @click="handleButtonClick"
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

    <div
      v-if="showDateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-end z-[9999]"
    >
      <div
        class="bg-[#2f2f2f] w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-white text-xl font-semibold">날짜 선택</h3>
          <button @click="showDateModal = false" class="text-white text-2xl">
            &times;
          </button>
        </div>

        <div class="flex justify-between items-center mb-4">
          <button
            @click="changeMonth(-1)"
            class="text-white p-2 rounded-lg hover:bg-[#414141]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <h4 class="text-white text-lg font-medium">
            {{ currentYear }}년 {{ currentMonth }}월
          </h4>
          <button
            @click="changeMonth(1)"
            class="text-white p-2 rounded-lg hover:bg-[#414141]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in ['일', '월', '화', '수', '목', '금', '토']"
            :key="day"
            class="text-center text-gray-400 text-sm py-2"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="n in startDayOfMonth"
            :key="`empty-${n}`"
            class="h-12"
          ></div>

          <button
            v-for="day in daysInMonth"
            :key="day"
            @click="selectDate(day)"
            :class="[
              'h-12 rounded-lg flex items-center justify-center text-white transition-colors',
              isSelectedDate(day)
                ? 'bg-[#ff5555] text-white'
                : 'hover:bg-[#414141]',
              isToday(day) && !isSelectedDate(day) ? 'bg-[#575757]' : '',
            ]"
          >
            {{ day }}
          </button>
        </div>

        <div class="mt-6">
          <button
            @click="showDateModal = false"
            class="w-full h-14 bg-[#ff5555] text-white rounded-16 font-medium"
          >
            확인
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
const transactionId = computed(() => route.params.id);
const isNewTransaction = computed(
  () => !transactionId.value || transactionId.value === 'new'
);

// 스토어에서 거래내역 데이터 가져오기
const transactionData = computed(() => {
  if (isNewTransaction.value) {
    // 새 거래 추가 모드
    return expensesStore.createNewTransactionTemplate();
  }

  const transaction = expensesStore.getTransactionById(transactionId.value);
  return (
    transaction || {
      id: transactionId.value,
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
const showDateModal = ref(false);

// 캘린더 관련 상태
const currentCalendarDate = ref(new Date());

// 캘린더 computed 속성들
const currentYear = computed(() => currentCalendarDate.value.getFullYear());
const currentMonth = computed(() => currentCalendarDate.value.getMonth() + 1);
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate();
});
const startDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value - 1, 1).getDay();
});

// 카테고리 목록 (스토어에서 가져오기)
const categories = expensesStore.categories;

// 카테고리 선택
const selectCategoryFromModal = (category) => {
  editableData.category = category;
  showCategoryModal.value = false;
  console.log('카테고리 변경:', category);
};

const changeMonth = (direction) => {
  const newDate = new Date(currentCalendarDate.value);
  newDate.setMonth(newDate.getMonth() + direction);
  currentCalendarDate.value = newDate;
};

const selectDate = (day) => {
  const selectedDate = new Date(currentYear.value, currentMonth.value - 1, day);
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');

  editableData.date = `${year}-${month}-${dayStr}`;
};

const isSelectedDate = (day) => {
  if (!editableData.date) return false;

  const selectedDate = new Date(editableData.date);
  return (
    selectedDate.getFullYear() === currentYear.value &&
    selectedDate.getMonth() + 1 === currentMonth.value &&
    selectedDate.getDate() === day
  );
};

const isToday = (day) => {
  const today = new Date();
  return (
    today.getFullYear() === currentYear.value &&
    today.getMonth() + 1 === currentMonth.value &&
    today.getDate() === day
  );
};

// 입력 유효성 검사 (store 함수 사용)
const validateInput = () => {
  const validation = expensesStore.validateTransaction(editableData);

  if (!validation.isValid) {
    console.error('입력 유효성 검사 실패:', validation.errors[0]);
    return false;
  }

  return true;
};

// 저장
const saveTransaction = async () => {
  if (!validateInput()) return;

  let success = false;

  if (isNewTransaction.value) {
    // 이제 editableData를 직접 전달합니다.
    success = await expensesStore.addTransaction(editableData);
  } else {
    // 이제 editableData를 직접 전달합니다.
    success = await expensesStore.updateTransaction(
      transactionId.value,
      editableData
    );
  }

  if (success) {
    console.log(
      isNewTransaction.value
        ? '거래내역이 추가되었습니다.'
        : '거래내역이 수정되었습니다.'
    );
    router.back();
  } else {
    console.error('저장에 실패했습니다.');
  }
};

// 버튼 클릭 핸들러
const handleButtonClick = () => {
  if (isNewTransaction.value) {
    cancelAdd();
  } else {
    deleteTransaction();
  }
};

// 취소
const cancelAdd = () => {
  router.back();
};

// 거래내역 삭제
const deleteTransaction = async () => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    const success = await expensesStore.deleteTransaction(transactionId.value);
    if (success) {
      console.log('삭제할 거래내역 ID:', transactionId.value);
      console.log('거래내역이 삭제되었습니다.');
      router.back();
    } else {
      console.error('삭제에 실패했습니다.');
    }
  }
};

onMounted(() => {
  console.log('거래내역 수정 페이지 로드, ID:', transactionId.value);
  console.log('거래내역 데이터:', transactionData.value);

  // 기존 거래 수정 시에만 데이터 초기화
  if (!isNewTransaction.value) {
    const data = transactionData.value;
    editableData.name = data.name;
    editableData.type = data.type;
    editableData.amount = data.amount;
    editableData.category = data.category;
    editableData.date = data.date;
    editableData.time = data.time;
  }

  // 캘린더 초기 날짜를 선택된 날짜로 설정
  if (editableData.date) {
    currentCalendarDate.value = new Date(editableData.date);
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
