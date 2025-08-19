<template>
  <div
    class="cursor-pointer w-full h-16 sm:h-20 flex items-center"
    @click="handleClick"
  >
    <!-- 카테고리 아이콘 배경 -->
    <div
      class="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 flex items-center justify-center flex-shrink-0 bg-[#414141]"
    >
      <!-- 폰트어썸 아이콘 -->
      <i
        :class="getCategoryIcon(transaction.category)"
        class="text-base sm:text-xl"
        :style="{ color: expensesStore.getCategoryMetadata(transaction.category).color }"
      ></i>
    </div>

    <!-- 거래 정보 -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <div class="font-pretendard font-medium text-sm sm:text-base text-white truncate pr-2">
          {{ transaction.name }}
        </div>
        <div class="font-pretendard font-bold text-xs sm:text-sm text-white text-right flex-shrink-0 min-w-16 sm:min-w-20">
          {{ formatAmount(transaction.amount, transaction.category) }}
        </div>
      </div>
      <div class="flex justify-between items-center mt-0.5">
        <div class="font-pretendard font-normal text-xs sm:text-sm text-[#c6c6c6] truncate pr-2">
          {{ transaction.categoryDisplay || transaction.category }}
        </div>
        <div class="font-pretendard font-normal text-xs sm:text-sm text-[#c6c6c6] text-right flex-shrink-0 min-w-10 sm:min-w-12">
          {{ transaction.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useExpensesStore } from '../../stores/expenses.js';

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      category: '',
      amount: 0,
      type: 'expense', // 'income' or 'expense'
      time: '',
      date: '',
    }),
  },
});

const emit = defineEmits(['click']);
const expensesStore = useExpensesStore();

// 클릭 이벤트 핸들러
const handleClick = () => {
  emit('click', props.transaction);
};

// 모든 아이콘 배경색은 #414141로 동일 (테일윈드 클래스로 이동)

// 카테고리 메타데이터에서 아이콘 가져오기
const getCategoryIcon = (category) => {
  const metadata = expensesStore.getCategoryMetadata(category);
  console.log(
    `🎨 [DEBUG] Category "${category}" -> Icon: ${metadata.icon}, Color: ${metadata.color}`
  );
  return metadata.icon;
};

// getIconStyle 함수 제거 - 테일윈드 클래스로 대체

// 금액 포맷팅 (저금통 데이터는 + 표시)
const formatAmount = (amount, category) => {
  const formattedAmount = Math.abs(amount).toLocaleString();
  // 저금통 데이터인 경우 + 표시
  if (props.transaction.isSaving) {
    return `+${formattedAmount}원`;
  }
  return expensesStore.formatAmount(amount, category);
};
</script>

<style scoped>
/* 폰트어썸 아이콘 기본 스타일 */
.fas {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}
</style>
