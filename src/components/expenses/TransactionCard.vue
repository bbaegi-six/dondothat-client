<template>
  <div
    class="cursor-pointer"
    style="width: 328px; height: 80px; margin-top: 0px; display: flex; align-items: center;"
    @click="handleClick"
  >
    <!-- 카테고리 아이콘 배경 -->
    <div 
      :class="getCategoryColor(transaction.category)"
      style="width: 48px; height: 48px; border-radius: 50%; margin-right: 15px;"
    >
    </div>

    <!-- 거래 정보 -->
    <div style="flex: 1;">
      <div style="display: flex; justify-content: space-between;">
        <div 
          style="font-family: 'Pretendard'; font-style: normal; font-weight: 500; font-size: 16px; line-height: 24px; color: #ffffff;"
        >
          {{ transaction.name }}
        </div>
        <div 
          style="font-family: 'Pretendard'; font-style: normal; font-weight: 700; font-size: 14.125px; line-height: 24px; color: #ffffff; text-align: right; width: 80px;"
        >
          {{ formatAmount(transaction.amount, transaction.type) }}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <div 
          style="font-family: 'Pretendard'; font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; color: #c6c6c6; margin-top: 2px;"
        >
          {{ transaction.category }}
        </div>
        <div 
          style="font-family: 'Pretendard'; font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; color: #c6c6c6; text-align: right; width: 48px; margin-top: 2px;"
        >
          {{ transaction.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

// 클릭 이벤트 핸들러
const handleClick = () => {
  emit('click', props.transaction);
};

// 카테고리별 색상 매핑 (simple.html 스타일 기반)
const getCategoryColor = (category) => {
  // simple.html에서는 기본적으로 #414141 색상을 사용하고, 특별한 경우에만 #ffe7ac 사용
  const colorMap = {
    편의점: 'transaction-icon',
    교통: 'transaction-icon',
    식비: 'transaction-icon-highlighted', // 강조된 아이템
    쇼핑: 'transaction-icon',
    기타: 'transaction-icon',
    급여: 'transaction-icon',
    용돈: 'transaction-icon',
    부업: 'transaction-icon',
  };
  return colorMap[category] || 'transaction-icon';
};



// 금액 포맷팅
const formatAmount = (amount, type) => {
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(amount);
  const prefix = type === 'expense' ? '-' : '+';
  return `${prefix}${formattedAmount}원`;
};
</script>

<style scoped>
.transaction-icon {
  background-color: #414141;
}

.transaction-icon-highlighted {
  background-color: #ffe7ac;
}
</style>
