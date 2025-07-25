<template>
  <div
    class="flex items-center py-3 px-4 cursor-pointer hover:bg-[#414141] hover:bg-opacity-30 transition-colors duration-200"
    @click="handleClick"
  >
    <!-- 카테고리 아이콘 배경 -->
    <div class="mr-3">
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center',
          getCategoryColor(transaction.category),
        ]"
      >
        <div
          v-html="getCategoryIcon(transaction.category)"
          class="w-5 h-5 text-white"
        ></div>
      </div>
    </div>

    <!-- 거래 정보 -->
    <div class="flex-1">
      <div class="flex justify-between items-center">
        <div class="flex-1">
          <p class="text-white text-sm font-medium leading-tight">
            {{ transaction.name }}
          </p>
          <p class="text-[#9ca3af] text-xs mt-0.5">
            {{ transaction.category }}
          </p>
        </div>
        <div class="text-right ml-4">
          <p class="text-white text-sm font-semibold leading-tight">
            {{ formatAmount(transaction.amount, transaction.type) }}
          </p>
          <p class="text-[#9ca3af] text-xs mt-0.5">{{ transaction.time }}</p>
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

// 카테고리별 색상 매핑 (스토어에서 가져오기)
const getCategoryColor = (category) => {
  const colorMap = {
    편의점: 'bg-[#ffe7ac]',
    교통: 'bg-[#ffc457]',
    식비: 'bg-[#ff9595]',
    쇼핑: 'bg-[#95c7ff]',
    기타: 'bg-[#c9c9c9]',
    급여: 'bg-[#95ffb3]',
    용돈: 'bg-[#ffb395]',
    부업: 'bg-[#d795ff]',
  };
  return colorMap[category] || 'bg-[#c9c9c9]';
};

// 카테고리별 아이콘 반환 (피그마 디자인 기반 - 검은색 stroke)
const getCategoryIcon = (category) => {
  const iconMap = {
    편의점: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>`,
    교통: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <path d="m15 2 5 5-5 5"></path>
    </svg>`,
    식비: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v20m8-9H4"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`,
    쇼핑: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>`,
    급여: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>`,
    용돈: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>`,
    부업: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>`,
    기타: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <path d="M12 17h.01"></path>
    </svg>`,
  };
  return iconMap[category] || iconMap['기타'];
};

// 금액 포맷팅
const formatAmount = (amount, type) => {
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(amount);
  const prefix = type === 'expense' ? '-' : '+';
  return `${prefix}${formattedAmount}원`;
};
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
