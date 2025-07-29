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
          {{ formatAmount(transaction.amount, transaction.type) }}
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

// 모든 아이콘 배경색은 #414141로 동일
const getCategoryBackgroundColor = () => {
  return 'transaction-icon-default';
};

// 카테고리별 폰트어썸 아이콘 매핑 (피그마 아이콘 기준)
const getCategoryIcon = (category) => {
  const iconMap = {
    편의점: 'fas fa-store', // store-solid (편의점)
    교통: 'fas fa-train-subway', // cart-outline (교통)
    식비: 'fas fa-utensils', // hamburger-line (식비)
    쇼핑: 'fas fa-bag-shopping', // 쇼핑
    그외: 'fas fa-ellipsis', // 기타
    수입: 'fas fa-coins', // 급여
    용돈: 'fas fa-hand-holding-usd', // 용돈
    부업: 'fas fa-briefcase', // 부업
    배달음식: 'fas fa-motorcycle', // 배달음식
    카페: 'fas fa-mug-saucer',
    택시: 'fas fa-taxi',
    문화: 'fas fa-clapperboard',
    술: 'fas fa-wine-bottle',
    의료: 'fas fa-suitcase-medical',
  };
  return iconMap[category] || 'fas fa-question-circle';
};

// 아이콘 스타일 (피그마 기준 색상)
const getIconStyle = (category) => {
  const colorMap = {
    배달음식: '#ff7376',
    카페: '#ff9595',
    쇼핑: '#ffa66f',
    택시: '#ffc457',
    편의점: '#ffe7ac',
    문화: '#cde897',
    술: '#72e39c',
    교통: '#8cc2ff',
    의료: '#8f95ec',
    생활: '#cf8fec',
    식비: '#f680db',
    그외: '#c9c9c9',
    수입: '#ffffff',
  };
  // 피그마에서 아이콘은 흰색(#ffffff)으로 표시
  return {
    fontSize: '20px',
    color: colorMap[category] || '#ffffff',
  };
};

// 금액 포맷팅
const formatAmount = (amount, type) => {
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(amount);
  const prefix = type === 'expense' ? '-' : '+';
  return `${prefix}${formattedAmount}원`;
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
