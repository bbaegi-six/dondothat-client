<template>
  <div
    class="cursor-pointer w-full h-20 flex items-center"
    @click="handleClick"
  >
    <!-- 카테고리 아이콘 배경 -->
    <div
      :class="getCategoryBackgroundColor()"
      class="w-12 h-12 rounded-full mr-4 flex items-center justify-center flex-shrink-0"
    >
      <!-- 폰트어썸 아이콘 -->
      <i
        :class="getCategoryIcon(transaction.category)"
        :style="getIconStyle(transaction.category)"
      ></i>
    </div>

    <!-- 거래 정보 -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-center">
        <div class="font-pretendard font-medium text-base text-white truncate pr-2">
          {{ transaction.name }}
        </div>
        <div class="font-pretendard font-bold text-sm text-white text-right flex-shrink-0 min-w-20">
          {{ formatAmount(transaction.amount, transaction.category) }}
        </div>
      </div>
      <div class="flex justify-between items-center mt-0.5">
        <div class="font-pretendard font-normal text-sm text-[#c6c6c6] truncate pr-2">
          {{ transaction.categoryDisplay || transaction.category }}
        </div>
        <div class="font-pretendard font-normal text-sm text-[#c6c6c6] text-right flex-shrink-0 min-w-12">
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

// 모든 아이콘 배경색은 #414141로 동일
const getCategoryBackgroundColor = () => {
  return 'transaction-icon-default';
};

// 카테고리 메타데이터에서 아이콘 가져오기
const getCategoryIcon = (category) => {
  const metadata = expensesStore.getCategoryMetadata(category);
  console.log(
    `🎨 [DEBUG] Category "${category}" -> Icon: ${metadata.icon}, Color: ${metadata.color}`
  );
  return metadata.icon;
};

// 카테고리 메타데이터에서 색상 가져오기
const getIconStyle = (category) => {
  return {
    fontSize: '20px',
    color: expensesStore.getCategoryMetadata(category).color,
  };
};

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
/* 기본 아이콘 배경 (피그마: #414141) */
.transaction-icon-default {
  background-color: #414141;
}

/* 폰트어썸 아이콘 기본 스타일 */
.fas {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}
</style>
