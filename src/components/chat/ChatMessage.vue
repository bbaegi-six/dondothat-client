<template>
  <!-- 받은 메시지 (다른 사용자) -->
  <div v-if="!isMyMessage" class="flex items-start gap-2 mb-2">
    <!-- Profile Picture -->
    <div
      class="w-8 h-8 bg-white rounded-full flex-shrink-0 flex items-center justify-center"
    >
      <i class="fas fa-user text-gray-600 text-sm"></i>
    </div>

    <!-- Message Content -->
    <div class="flex-1">
      <!-- Username -->
      <div class="mb-1">
        <span class="text-white text-xs font-extralight">{{ username }}</span>
      </div>

      <div class="flex items-end gap-1">
        <!-- Message Bubble -->
        <div
          class="bg-[#414141] rounded-lg px-3 py-2 inline-block max-w-[280px] min-w-[40px]"
        >
          <p
            class="text-white text-xs font-light leading-4 whitespace-pre-line"
          >
            {{ content }}
          </p>
        </div>

        <!-- Time -->
        <span class="text-white text-[8px] font-extralight">{{ time }}</span>
      </div>
    </div>
  </div>

  <!-- 보낸 메시지 (내가 보낸 것) -->
  <div v-else class="flex justify-end mb-2">
    <div class="flex items-end gap-1">
      <!-- Time -->
      <span class="text-white text-[8px] font-extralight">{{ time }}</span>

      <!-- Message Bubble -->
      <div
        class="bg-[#FF5555] rounded-lg px-3 py-2 inline-block max-w-[280px] min-w-[40px]"
      >
        <p class="text-white text-xs font-light leading-4 whitespace-pre-line">
          {{ content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

// 내가 보낸 메시지인지 확인
const isMyMessage = computed(() => props.username === '나');
</script>

<style scoped>
/* Message animation */
div {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
