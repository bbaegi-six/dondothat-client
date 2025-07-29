<!-- accountheader.vue -->
<template>
  <div v-if="showHeader" class="relative">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 h-16">
      <div class="flex items-center gap-2">
        <button
          v-if="showBackButton"
          class="bg-transparent border-none text-lg cursor-pointer flex items-center rounded-md px-3 py-1 font-medium text-white hover:bg-gray-700 transition-colors"
          @click="$emit('back')"
        >
          <span>‹ {{ backButtonText }}</span>
        </button>
        <div v-else class="px-3 py-1">
          <span class="text-lg font-medium">{{ title }}</span>
        </div>
      </div>

      <!-- Progress Dots -->
      <div v-if="showDots" class="flex gap-5">
        <div
          v-for="i in totalSteps"
          :key="i"
          :class="[
            'w-1 h-1 rounded-full transition-colors duration-300',
            i <= currentStep ? 'bg-[#FF5555]' : 'bg-[#A1A1A1]',
          ]"
        ></div>
      </div>
    </div>

    <!-- Bottom Border Line -->
    <div class="w-full h-px bg-[#414141]"></div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
  totalSteps: {
    type: Number,
    default: 5,
  },
  title: {
    type: String,
    default: '계좌 연결',
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
  backButtonText: {
    type: String,
    default: '계좌 연결',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showDots: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['back']);
</script>
