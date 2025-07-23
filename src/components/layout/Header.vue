<template>
  <header
    class="flex justify-between items-center px-5 py-4 bg-dark-bg text-white h-[60px] box-border w-full max-w-[390px] mx-auto fixed top-0 left-0 right-0 z-50"
  >
    <div class="flex items-center gap-0">
      <button
        v-if="showBack"
        @click="router.back()"
        class="bg-transparent border-none text-white cursor-pointer flex items-center justify-center p-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
          />
        </svg>
      </button>
      <h1
        v-if="showLogo"
        class="font-anton-sc text-xl text-primary-red m-0 font-normal"
      >
        Don do that
      </h1>
      <h2 v-if="title" class="font-pretendard text-xl font-semibold m-0">
        {{ title }}
      </h2>
    </div>
    <div class="flex items-center">
      <div
        v-if="showPoints"
        class="flex items-center gap-1 font-pretendard text-xl font-semibold text-white"
      >
        <span>{{ points }} P</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 512"
          width="18"
          height="18"
          fill="currentColor"
        >
          <path
            d="M246.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 41.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
          />
        </svg>
      </div>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  showBack: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  showLogo: {
    type: Boolean,
    default: false,
  },
  showPoints: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped></style>
