<template>
  <div
    class="fixed bottom-20 left-1/2 transform -translate-x-1/2 max-w-[390px] w-full bg-default border-t border-gray-700 px-6 py-4 z-50"
  >
    <div class="flex gap-2 items-center">
      <div class="flex-1 relative">
        <input
          v-model="messageText"
          @keypress.enter="handleSend"
          :disabled="!isConnected"
          type="text"
          placeholder="채팅을 입력하세요"
          class="w-full h-12 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
        />
      </div>
      <button
        @click="handleSend"
        :disabled="!messageText.trim() || !isConnected"
        class="w-12 h-12 text-white rounded-xl flex items-center justify-center transition-colors duration-200"
        :class="
          messageText.trim() && isConnected
            ? 'bg-[#FF5555] hover:bg-red-600'
            : 'bg-gray-400 cursor-not-allowed'
        "
      >
        <i class="fas fa-arrow-up text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isConnected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['send-message']);

const messageText = ref('');

const handleSend = () => {
  if (!messageText.value.trim() || !props.isConnected) {
    return;
  }

  emit('send-message', messageText.value.trim());
  messageText.value = '';
};

// 외부에서 메시지 전송 후 입력창 초기화를 위한 메서드 노출
const clearInput = () => {
  messageText.value = '';
};

defineExpose({
  clearInput,
});
</script>

<style scoped>
/* Button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>
