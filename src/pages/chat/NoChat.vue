<template>
  <div
    class="pt-[60px] px-[31px] pb-[90px] min-h-screen w-[390px] mx-auto"
    style="background-color: #2f2f2f"
  >
    <!-- Header -->
    <Header :showBack="false" title="채팅" :showAddButton="false" />

    <!-- 빈 상태 컨텐츠 -->
    <div
      class="flex flex-col items-center justify-center h-[calc(100vh-200px)]"
    >
      <!-- 채팅 아이콘 -->
      <div class="mb-8">
        <div
          class="w-24 h-24 bg-[#414141] rounded-full flex items-center justify-center mb-4"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            />
          </svg>
        </div>
      </div>

      <!-- 메인 메시지 -->
      <div class="text-center">
        <h2 class="text-white text-xl font-semibold">아직 채팅방이 없어요</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Header from '../../components/layout/Header.vue';

const router = useRouter();

// 스크립트 로직을 여기에 추가할 수 있습니다
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
