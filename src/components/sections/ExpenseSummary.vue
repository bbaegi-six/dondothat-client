<template>
  <!-- 이번 달 지출 요약 타이틀 -->
  <div class="font-pretendard font-semibold text-xl text-white mb-4 mt-6">
    이번 달 지출 요약
  </div>

  <!-- 이번 달 지출 요약 박스 -->
  <div class="w-98 bg-[#414141] rounded-2xl p-6">
    <!-- 카테고리별 지출 리스트 -->
    <div v-if="chartData && chartData.length > 0">
      <div
        v-for="(category, index) in chartData"
        :key="category.name"
        class="flex items-center justify-between mb-2 last:mb-0"
      >
        <div class="flex items-center">
          <div
            class="w-5 h-5 rounded-full mr-3"
            :style="{
              backgroundColor: category.color,
            }"
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
</template>

<script setup>
defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});
</script>