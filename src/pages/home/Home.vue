<template>
  <div
    class="min-h-screen w-[390px] mx-auto bg-[#2f2f2f] pt-[88px] px-[31px] pb-[90px]"
  >
    <!-- 저금통 연결 섹션 -->
    <div
      class="w-[328px] h-[56px] bg-[#414141] rounded-2xl flex items-center px-6 cursor-pointer"
      @click="goToExpensesList"
    >
      <div class="font-pretendard font-medium text-base text-white">저금통</div>
      <FontAwesomeIcon
        :icon="farCircleQuestion"
        class="text-[#c9c9c9] ml-1 mr-auto"
      />
      <div class="font-pretendard font-medium text-base text-white mr-2">
        연결하기
      </div>
      <FontAwesomeIcon :icon="faAngleRight" class="text-white w-[10px] h-4" />
    </div>

    <!-- 참여 중인 챌린지가 없습니다 섹션 -->
    <div
      class="w-[328px] h-24 bg-[#2f2f2f] border-2 border-[#414141] rounded-2xl mt-4 flex items-center px-6 cursor-pointer"
      @click="goToChallenges"
    >
      <FontAwesomeIcon
        :icon="fasCircleQuestion"
        class="text-white w-12 h-12 mr-4"
      />
      <div class="font-pretendard font-medium text-base text-white flex-1">
        참여 중인 챌린지가 없습니다
      </div>
      <FontAwesomeIcon
        :icon="faAngleRight"
        class="text-[#c6c6c6] w-[10px] h-4"
      />
    </div>

    <!-- 차트 섹션 -->
    <div class="w-[328px] mt-10 flex flex-col items-center">
      <!-- 차트 컨테이너 -->
      <div class="w-[170px] h-[170px] mb-6">
        <canvas ref="chartCanvas" width="170" height="170"></canvas>
      </div>
    </div>

    <!-- 이번 달 지출 요약 타이틀 -->
    <div class="font-pretendard font-semibold text-xl text-white mb-4 mt-6">
      이번 달 지출 요약
    </div>

    <!-- 이번 달 지출 요약 박스 -->
    <div class="w-[328px] bg-[#414141] rounded-2xl p-6">
      <!-- 카테고리별 지출 리스트 -->
      <div v-if="categoryData && categoryData.length > 0">
        <div
          v-for="(category, index) in categoryData"
          :key="category.name"
          class="flex items-center justify-between mb-2 last:mb-0"
        >
          <div class="flex items-center">
            <div
              class="w-5 h-5 rounded-full mr-3"
              :style="{ backgroundColor: getCategoryColor(category.name) }"
            ></div>
            <div class="font-pretendard font-medium text-sm text-white">
              {{ category.name }}
            </div>
          </div>
          <div class="font-pretendard font-bold text-sm text-white">
            {{ category.amount.toLocaleString() }}원
          </div>
        </div>
      </div>

      <!-- 데이터 없음 표시 -->
      <div v-else class="text-center py-8">
        <p class="text-[#c6c6c6] text-sm">이번 달 지출 내역이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleQuestion as farCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleQuestion as fasCircleQuestion,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

const router = useRouter();
const chartCanvas = ref(null);
const categoryData = ref([]);
const chartInstance = ref(null);

// 차트 색상 팔레트
// 카테고리별 색상 매핑
const categoryColorMap = {
  배달음식: '#FF7376',
  카페: '#FF9595',
  쇼핑: '#FFA66F',
  택시: '#FFC457',
  편의점: '#FFE7AC',
  문화: '#CDE897',
  술: '#72E39C',
  대중교통: '#8CC2FF',
  의료: '#8F95EC',
  생활: '#CF8FEC',
  식비: '#F680DB',
  그외: '#C9C9C9',
};

// 카테고리에 따른 색상 가져오기 함수
const getCategoryColor = (categoryName) => {
  return categoryColorMap[categoryName] || categoryColorMap['그외'];
};

// API에서 지출 데이터 가져오기
const fetchExpensesData = async () => {
  try {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();

    // 현재 월의 데이터만 필터링
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date || expense.createdAt);
      return (
        expenseDate.getMonth() + 1 === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    // 카테고리별 합계 계산
    const categoryMap = new Map();

    currentMonthExpenses.forEach((expense) => {
      const categoryName = expense.categoryName || '기타';
      const amount = expense.amount || 0;

      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, categoryMap.get(categoryName) + amount);
      } else {
        categoryMap.set(categoryName, amount);
      }
    });

    // 배열로 변환하고 금액순으로 정렬
    categoryData.value = Array.from(categoryMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    console.log('카테고리별 데이터:', categoryData.value);
  } catch (error) {
    console.error('지출 데이터를 가져오는 중 오류 발생:', error);
    categoryData.value = [];
  }
};

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value || !categoryData.value.length) return;

  // 기존 차트 인스턴스가 있다면 제거
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  // 카테고리별 색상 배열 생성
  const colors = categoryData.value.map((item) => getCategoryColor(item.name));

  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categoryData.value.map((item) => item.name),
      datasets: [
        {
          data: categoryData.value.map((item) => item.amount),
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false, // 범례 숨기기 (아래 리스트에서 표시)
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${percentage}%`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        duration: 1000,
      },
    },
  });
};

// 페이지 이동 함수들
const goToExpensesList = () => {
  router.push('/expenses');
};

const goToChallenges = () => {
  router.push('/challenges');
};

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  await fetchExpensesData();
  await nextTick(); // DOM 업데이트 완료 대기
  createChart();
});
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
