<template>
  <div class="flex-1 flex items-center justify-center">
    <div class="text-center px-6">
      <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
      <p class="text-white mb-4">{{ error }}</p>
      <div class="space-y-2">
        <button
          @click="$emit('reconnect')"
          class="block w-full px-4 py-2 bg-[#FF5555] text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          다시 연결
        </button>
        <button
          @click="$emit('go-back')"
          class="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    default: '오류가 발생했습니다',
  },
});

defineEmits(['reconnect', 'go-back']);
</script>

<style scoped>
/* Smooth transitions */
.transition-colors {
  transition: background-color 0.2s ease-in-out;
}
</style>
