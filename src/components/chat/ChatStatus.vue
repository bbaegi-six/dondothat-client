<template>
  <div class="flex-1 flex items-center justify-center">
    <div class="text-center text-gray-400">
      <i class="fas fa-wifi-slash text-xl mb-2"></i>
      <p>연결이 끊어졌습니다</p>
      <button
        @click="$emit('reconnect')"
        class="mt-2 px-4 py-2 bg-[#FF5555] text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
      >
        다시 연결
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['reconnect']);
</script>

<style scoped>
/* Smooth transitions */
.transition-colors {
  transition: background-color 0.2s ease-in-out;
}
</style>
