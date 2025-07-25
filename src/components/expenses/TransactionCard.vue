<template>
  <div 
    class="flex items-center py-4 cursor-pointer hover:bg-[#414141] hover:bg-opacity-30 rounded-lg transition-colors duration-200" 
    @click="handleClick"
  >
    <!-- 카테고리 아이콘 -->
    <div 
      :class="[
        'w-12 h-12 rounded-full flex items-center justify-center mr-4',
        getCategoryColor(transaction.category)
      ]"
    >
      <div v-html="getCategoryIcon(transaction.category)" class="w-6 h-6 text-white"></div>
    </div>
    
    <!-- 거래 정보 -->
    <div class="flex-1">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-white text-base font-medium">{{ transaction.name }}</p>
          <p class="text-[#c6c6c6] text-sm">{{ transaction.category }}</p>
        </div>
        <div class="text-right">
          <p class="text-white text-sm font-bold">
            {{ formatAmount(transaction.amount, transaction.type) }}
          </p>
          <p class="text-[#c6c6c6] text-sm">{{ transaction.time }}</p>
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
      date: ''
    })
  }
})

const emit = defineEmits(['click'])

// 클릭 이벤트 핸들러
const handleClick = () => {
  emit('click', props.transaction)
}

// 카테고리별 색상 매핑 (스토어에서 가져오기)
const getCategoryColor = (category) => {
  const colorMap = {
    '편의점': 'bg-[#ffe7ac]',
    '교통': 'bg-[#ffc457]', 
    '식비': 'bg-[#ff9595]',
    '쇼핑': 'bg-[#95c7ff]',
    '기타': 'bg-[#c9c9c9]',
    '급여': 'bg-[#95ffb3]',
    '용돈': 'bg-[#ffb395]',
    '부업': 'bg-[#d795ff]'
  }
  return colorMap[category] || 'bg-[#c9c9c9]'
}

// 카테고리별 아이콘 매핑 (스토어에서 가져오기)
const getCategoryIcon = (category) => {
  const iconMap = {
    '편의점': `<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
    </svg>`,
    '교통': `<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2C8 2 5 5 5 9V15C5 16.1 5.9 17 7 17H8L9.5 19.5C9.8 19.9 10.4 20 10.8 19.7C10.9 19.6 11 19.5 11 19.4L12 17.5L13 19.4C13.2 19.8 13.8 19.9 14.2 19.7C14.3 19.6 14.4 19.5 14.5 19.5L16 17H17C18.1 17 19 16.1 19 15V9C19 5 16 2 12 2M7.5 11C6.7 11 6 10.3 6 9.5S6.7 8 7.5 8 9 8.7 9 9.5 8.3 11 7.5 11M16.5 11C15.7 11 15 10.3 15 9.5S15.7 8 16.5 8 18 8.7 18 9.5 17.3 11 16.5 11Z"/>
    </svg>`,
    '식비': `<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18.21 9.21L15.93 6.93C15.54 6.54 14.91 6.54 14.52 6.93L12.4 9.05L8.5 5.15C8.11 4.76 7.48 4.76 7.09 5.15L4.81 7.43C4.42 7.82 4.42 8.45 4.81 8.84L8.71 12.74L6.59 14.86C6.2 15.25 6.2 15.88 6.59 16.27L8.87 18.55C9.26 18.94 9.89 18.94 10.28 18.55L12.4 16.43L16.3 20.33C16.69 20.72 17.32 20.72 17.71 20.33L19.99 18.05C20.38 17.66 20.38 17.03 19.99 16.64L16.09 12.74L18.21 10.62C18.6 10.23 18.6 9.6 18.21 9.21ZM9.58 13.45L5.68 9.55L7.09 8.14L11 12.04L12.4 10.63L14.52 12.75L13.11 14.16L9.21 10.26L7.8 11.67L11.7 15.57L10.29 16.98L6.39 13.08L5.68 13.79L9.58 17.69L8.17 19.1L4.27 15.2L2.86 13.79L6.76 9.89L8.17 8.48L12.07 12.38L13.48 10.97L17.38 14.87L19.99 12.26L16.09 8.36L14.68 9.77L10.78 5.87L12.19 4.46L16.09 8.36L17.5 6.95L13.6 3.05L15.01 1.64L18.91 5.54L20.32 4.13L16.42 0.23C16.03 -0.16 15.4 -0.16 15.01 0.23L12.73 2.51C12.34 2.9 12.34 3.53 12.73 3.92L16.63 7.82L15.22 9.23L11.32 5.33L9.91 6.74L13.81 10.64L12.4 12.05L8.5 8.15L7.09 9.56L11 13.46L9.58 14.87Z"/>
    </svg>`,
    '쇼핑': `<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.58 17.3 11.97L20.88 5H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/>
    </svg>`,
    '급여': `<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L19 8L21 9M15 18.25V21.5L12 20L9 21.5V18.25C9.24 18.31 9.61 18.36 10 18.39V19.61L12 18.84L14 19.61V18.39C14.39 18.36 14.76 18.31 15 18.25ZM5 11H19C19.55 11 20 11.45 20 12V16C20 16.55 19.55 17 19 17H5C4.45 17 4 16.55 4 16V12C4 11.45 4.45 11 5 11ZM12 15.5C13.38 15.5 14.5 14.38 14.5 13S13.38 10.5 12 10.5 9.5 11.62 9.5 13 10.62 15.5 12 15.5Z"/>
    </svg>`,
    '기타': `<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M13 17H11V15H13V17M13 13H11V7H13V13Z"/>
    </svg>`
  }
  return iconMap[category] || iconMap['기타']
}

// 금액 포맷팅
const formatAmount = (amount, type) => {
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(amount)
  const prefix = type === 'expense' ? '-' : '+'
  return `${prefix}${formattedAmount}원`
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>