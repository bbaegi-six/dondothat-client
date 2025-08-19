<!-- Square.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center relative overflow-hidden w-26 h-26 rounded-16 bg-gray-1"
  >
    <!-- 이미지 영역 -->
    <div class="flex items-center justify-center flex-1">
      <img
        v-if="image"
        :src="image"
        :alt="text || 'Card image'"
        class="max-w-full max-h-full object-contain"
      />
      <slot v-else></slot>
    </div>

    <!-- 텍스트 영역 -->
    <div v-if="text" class="absolute bottom-2 left-0 right-0 text-center">
      <span class="text-sm font-medium text-white">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Square',
  props: {
    // 이미지 URL
    image: {
      type: String,
      default: null,
    },
    // 하단 텍스트
    text: {
      type: String,
      default: null,
    },
  },
};
</script>
