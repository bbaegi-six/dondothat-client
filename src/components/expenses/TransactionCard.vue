<template>
  <div
    class="cursor-pointer"
    style="
      width: 328px;
      height: 80px;
      margin-top: 0px;
      display: flex;
      align-items: center;
    "
    @click="handleClick"
  >
    <!-- 카테고리 아이콘 배경 -->
    <div
      :class="getCategoryBackgroundColor()"
      style="
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <!-- 폰트어썸 아이콘 -->
      <i
        :class="getCategoryIcon(transaction.category)"
        :style="getIconStyle(transaction.category)"
      ></i>
    </div>

    <!-- 거래 정보 -->
    <div style="flex: 1">
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            color: #ffffff;
          "
        >
          {{ transaction.name }}
        </div>
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 700;
            font-size: 14.125px;
            line-height: 24px;
            color: #ffffff;
            text-align: right;
            width: 80px;
          "
        >
          {{ formatAmount(transaction.amount) }}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            color: #c6c6c6;
            margin-top: 2px;
          "
        >
          {{ transaction.category }}
        </div>
        <div
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            color: #c6c6c6;
            text-align: right;
            width: 48px;
            margin-top: 2px;
          "
        >
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
  console.log(`🎨 [DEBUG] Category "${category}" -> Icon: ${metadata.icon}, Color: ${metadata.color}`);
  return metadata.icon;
};

// 카테고리 메타데이터에서 색상 가져오기
const getIconStyle = (category) => {
  return {
    fontSize: '20px',
    color: expensesStore.getCategoryMetadata(category).color,
  };
};

// 스토어의 공통 포맷팅 메서드 사용 (type 파라미터 제거)
const formatAmount = (amount) => {
  return expensesStore.formatAmount(amount);
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
