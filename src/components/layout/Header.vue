<template>
  <header
    class="bg-default text-white w-[390px] mx-auto fixed top-0 left-0 right-0 z-50 pt-4"
  >
    <div
      class="flex justify-between items-center px-[31px] h-[52px] box-border"
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
        <img
          v-if="showLogo"
          src="@/assets/logo/dondothat_full-horizontal_red.png"
          alt="Don do that Logo"
          class="h-6"
        />
        <h2
          v-if="title"
          class="m-0"
          style="
            font-family: 'Pretendard';
            font-style: normal;
            font-weight: 600;
            font-size: 20px;
            line-height: 32px;
            color: #ffffff;
          "
        >
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
        <button
          v-if="showAddButton"
          @click="$emit('add-click')"
          class="rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          style="width: 32px; height: 32px"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M1 4V10H7M23 20V14H17"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        v-if="showUserCount"
        class="flex items-center gap-1 font-pretendard text-base font-medium text-[#C9C9C9]"
      >
        <i class="fas fa-user-group text-base"></i>
        <span>{{ userCount }}</span>
      </div>
    </div>
    <!-- 헤더 하단 구분선 -->
    <div v-if="showBorder" class="border-t border-[#414141] w-full"></div>
  </header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
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
  showAddButton: {
    type: Boolean,
    default: false,
  },
  showUserCount: {
    type: Boolean,
    default: false,
  },
  userCount: {
    type: Number,
    default: 0,
  },
  showBorder: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['add-click']);
</script>

<style scoped></style>
