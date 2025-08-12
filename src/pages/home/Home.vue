<template>
  <Header showLogo :show-border="false" />
  <div
    class="min-h-screen w-[390px] mx-auto bg-[#2f2f2f] pt-[88px] px-[31px] pb-[90px]"
  >
    <!-- 저금통 섹션 -->
    <div v-if="authStore.user && authStore.user.savingConnected">
      <div
        class="w-[328px] h-[56px] bg-[#414141] rounded-2xl flex items-center px-6 cursor-pointer"
      >
        <div class="font-pretendard font-medium text-base text-white">
          지금까지 아낀 금액
        </div>
        <FontAwesomeIcon
          :icon="farCircleQuestion"
          class="text-[#c9c9c9] ml-1 mr-auto"
        />
        <div class="font-pretendard font-bold text-lg text-white mr-2">
          12,000원
        </div>
        <FontAwesomeIcon :icon="faAngleRight" class="text-white w-[10px] h-4" />
      </div>
    </div>
    <div
      v-else
      class="w-[328px] h-[56px] bg-[#414141] rounded-2xl flex items-center px-6 cursor-pointer"
      @click="goToAccountStep2"
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
import Header from '@/components/layout/Header.vue';
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleQuestion as farCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleQuestion as fasCircleQuestion,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

import { useExpensesStore } from '@/stores/expenses';
import { useAccountStore } from '@/stores/account';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const accountStore = useAccountStore();
const router = useRouter();
const chartCanvas = ref(null);
const expensesStore = useExpensesStore();
const chartInstance = ref(null);

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value || !expensesStore.chartData.length) return;

  // 기존 차트 인스턴스가 있다면 제거
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  // 카테고리별 색상 배열
  const colors = expensesStore.chartData.map((item) => item.color);

  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: expensesStore.chartData.map((item) => item.name),
      datasets: [
        {
          data: expensesStore.chartData.map((item) => item.amount),
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
const goToAccountStep2 = () => {
  accountStore.setAccount('sub', false);
  router.push('/account');
};

const goToChallenges = () => {
  router.push('/challenge');
};

onMounted(async () => {
  // 스토어의 데이터가 로드될 때까지 기다립니다.
  if (expensesStore.loading) {
    await new Promise((resolve) => {
      const unwatch = watch(
        () => expensesStore.loading,
        (loading) => {
          if (!loading) {
            unwatch();
            resolve();
          }
        }
      );
    });
  }
  await nextTick(); // DOM 업데이트 완료 대기
  createChart();
});
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
