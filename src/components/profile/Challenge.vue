<template>
  <div
    class="w-full bg-default border-2 border-gray-1 rounded-16 flex items-center p-4 gap-4"
  >
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-1"
    >
      <i :class="[icon, 'text-xl']" :style="{ color: resolvedColor }"></i>
    </div>

    <!-- 텍스트 -->
    <div class="flex flex-col justify-center gap-1">
      <h3 class="text-white text-base font-bold leading-tight">
        {{ name }}
      </h3>
      <!-- 시작일 ~ 종료일 -->
      <p class="text-gray-3 text-sm">{{ startDate }} ~ {{ endDate }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: String,
  startDate: String,
  endDate: String,
  icon: String,
  category: {
    type: String,
    default: 'cafe', // 기본값
  },
});

// 카테고리별 색상 매핑
const categoryColors = {
  delivery: '#FF7376',
  cafe: '#FF9595',
  shopping: '#FFA66F',
  taxi: '#FFC457',
  convenience: '#FFE7AC',
  culture: '#CDE897',
  transport: '#72E39C',
  medical: '#8CC2FF',
  life: '#8F95EC',
  etc: '#CF8FEC',
  income: '#C9C9C9',
};

// 현재 카테고리에 맞는 색상 반환
const resolvedColor = computed(() => {
  return categoryColors[props.category] || '#FFFFFF'; // 없는 경우 흰색
});
</script>
