<template>
  <!-- 차트 섹션 -->
  <div class="w-82 mt-10 flex flex-col items-center">
    <!-- 차트 컨테이너 -->
    <div class="w-43 h-43 mb-6">
      <canvas ref="chartCanvas" width="172" height="172"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});

const chartCanvas = ref(null);
const chartInstance = ref(null);

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value || !props.chartData.length) return;

  // 기존 차트 인스턴스가 있다면 제거
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  // 카테고리별 색상 배열
  const colors = props.chartData.map((item) => item.color);

  chartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: props.chartData.map((item) => item.name),
      datasets: [
        {
          data: props.chartData.map((item) => item.amount),
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

  // 차트 생성 완료
};

// chartData가 변경될 때 차트 재생성
watch(
  () => props.chartData,
  (newData) => {
    // 데이터가 있을 때만 차트 생성
    if (newData && newData.length > 0) {
      nextTick(() => {
        createChart();
      });
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  // chartData가 이미 있다면 차트 생성
  if (props.chartData && props.chartData.length > 0) {
    nextTick(() => {
      createChart();
    });
  }
});

// 컴포넌트 언마운트 시 차트 인스턴스 정리로 메모리 누수 방지
onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

// 외부에서 차트 재생성을 위한 함수 노출
defineExpose({
  createChart,
});
</script>