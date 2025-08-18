<!-- accountheader.vue -->
<template>
  <div v-if="showHeader" class="relative">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 h-[61px]">
      <div class="flex items-center gap-2">
        <div
          class="bg-transparent border-none text-lg flex items-center rounded-md px-0 py-1 font-medium text-white transition-colors"
          :class="
            showBackButton
              ? 'cursor-pointer hover:bg-gray-700'
              : 'cursor-default'
          "
          @click="showBackButton ? $emit('back') : null"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            width="16"
            height="16"
            fill="currentColor"
            class="mr-0"
            :class="showBackButton ? 'opacity-100' : 'opacity-0'"
          >
            <path
              d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
            />
          </svg>
          <span>{{ showBackButton ? backButtonText : title }}</span>
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
