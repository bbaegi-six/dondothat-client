<template>
  <div class="pt-[60px] px-6 pb-[90px] bg-dark-bg min-h-screen">
    <Header :showBack="false" title="소비 내역" />
    
    <!-- 월별 요약 섹션 -->
    <div class="bg-[#414141] rounded-16 p-4 mb-6" style="margin-top: 20px;">
      <!-- 월 선택 헤더 -->
      <div class="flex items-center justify-between mb-4">
        <button 
          @click="previousMonth" 
          class="text-[#c9c9c9] hover:text-white transition-colors p-2"
        >
          <svg width="10" height="16" viewBox="0 0 320 512" fill="currentColor">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
          </svg>
        </button>
        <h2 class="text-white text-xl font-bold">{{ currentMonthDisplay }}월</h2>
        <button 
          @click="nextMonth" 
          class="text-[#c9c9c9] hover:text-white transition-colors p-2"
        >
          <svg width="10" height="16" viewBox="0 0 320 512" fill="currentColor">
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
          </svg>
        </button>
      </div>
      
      <!-- 수입/지출 요약 -->
      <div class="flex justify-between items-center">
        <div class="text-center">
          <p class="text-white text-base font-medium mb-1">수입</p>
          <p class="text-white text-xl font-bold">{{ monthlyIncome.toLocaleString() }}원</p>
        </div>
        <div class="text-center">
          <p class="text-[#ff5555] text-base font-medium mb-1">지출</p>
          <p class="text-[#ff5555] text-xl font-bold">{{ monthlyExpense.toLocaleString() }}원</p>
        </div>
      </div>
    </div>

    <!-- 거래내역 리스트 -->
    <div class="space-y-0" v-if="currentMonthTransactions.length > 0">
      <!-- 날짜별 그룹 -->
      <div v-for="(group, date) in groupedTransactions" :key="date" class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <p class="text-white text-base font-medium">{{ formatDate(date) }}</p>
          <p class="text-[#ff5555] text-base font-semibold">{{ getDailyTotal(group) }}</p>
        </div>
        <div class="border-t border-[#414141]"></div>
        
        <!-- 거래내역 아이템들 -->
        <div class="space-y-0">
          <TransactionCard 
            v-for="transaction in group" 
            :key="transaction.id"
            :transaction="transaction" 
            @click="editTransaction"
          />
        </div>
      </div>
    </div>

    <!-- 데이터 없음 표시 -->
    <div v-else class="text-center py-12">
      <p class="text-[#c6c6c6] text-base">{{ currentMonthDisplay }}월의 거래내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../../components/layout/Header.vue'
import TransactionCard from '../../components/TransactionCard.vue'

const router = useRouter()

// 현재 선택된 월 (1-12)
const currentMonth = ref(7)

// 전체 거래내역 데이터 (월별로 구분)
const allTransactions = ref({
  6: [
    {
      id: 'jun-1',
      name: '스타벅스',
      category: '식비',
      amount: 4500,
      type: 'expense',
      time: '14:30',
      date: '2025-06-30'
    },
    {
      id: 'jun-2',
      name: '지하철',
      category: '교통',
      amount: 1370,
      type: 'expense',
      time: '09:15',
      date: '2025-06-30'
    }
  ],
  7: [
    {
      id: 'gs25-1',
      name: 'GS25 군자점',
      category: '편의점',
      amount: 5000,
      type: 'expense',
      time: '18:59',
      date: '2025-07-08'
    },
    {
      id: 'subway-1',
      name: '서울교통공사',
      category: '교통',
      amount: 1500,
      type: 'expense',
      time: '18:59',
      date: '2025-07-08'
    },
    {
      id: 'lotteria-1',
      name: '롯데리아 군자점',
      category: '식비',
      amount: 18000,
      type: 'expense',
      time: '18:59',
      date: '2025-07-08'
    },
    {
      id: 'gs25-2',
      name: 'GS25 군자점',
      category: '편의점',
      amount: 5000,
      type: 'expense',
      time: '18:59',
      date: '2025-07-07'
    },
    {
      id: 'subway-2',
      name: '서울교통공사',
      category: '교통',
      amount: 1500,
      type: 'expense',
      time: '18:59',
      date: '2025-07-07'
    }
  ],
  8: [
    {
      id: 'aug-1',
      name: '카카오페이',
      category: '기타',
      amount: 50000,
      type: 'income',
      time: '10:00',
      date: '2025-08-01'
    },
    {
      id: 'aug-2',
      name: '맥도날드',
      category: '식비',
      amount: 8900,
      type: 'expense',
      time: '12:30',
      date: '2025-08-01'
    }
  ]
})

// 계산된 속성들
const currentMonthDisplay = computed(() => currentMonth.value)

const currentMonthTransactions = computed(() => 
  allTransactions.value[currentMonth.value] || []
)

const groupedTransactions = computed(() => {
  const groups = {}
  currentMonthTransactions.value.forEach(transaction => {
    const date = transaction.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
  })
  return groups
})

const monthlyIncome = computed(() => {
  return currentMonthTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthlyExpense = computed(() => {
  return currentMonthTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

// 메서드들
const previousMonth = () => {
  if (currentMonth.value > 1) {
    currentMonth.value--
    console.log(`${currentMonth.value}월로 이동`)
  }
}

const nextMonth = () => {
  if (currentMonth.value < 12) {
    currentMonth.value++
    console.log(`${currentMonth.value}월로 이동`)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[date.getDay()]
  return `${month}월 ${day}일 (${weekday})`
}

const getDailyTotal = (transactions) => {
  const total = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  return total > 0 ? `-${total.toLocaleString()}원` : '0원'
}

const editTransaction = (transaction) => {
  router.push(`/expenses/edit/${transaction.id}`)
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>