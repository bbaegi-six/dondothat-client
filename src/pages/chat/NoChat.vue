<template>
  <div
    class="pt-16 sm:pt-20 px-6 sm:px-8 pb-20 sm:pb-24 min-h-screen w-full max-w-md mx-auto bg-default"
  >
    <!-- Header -->
    <Header :showBack="false" :showAddButton="false" :showBorder="false" />

    <!-- 빈 상태 컨텐츠 -->
    <div
      class="flex flex-col items-center justify-center h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)]"
    >
      <!-- 채팅 아이콘 -->
      <div class="mb-6 sm:mb-8">
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-4 sm:mb-6"
        >
          <i class="fas fa-comments text-3xl sm:text-4xl text-[#FF5555]"></i>
        </div>
      </div>

      <!-- 메인 메시지 -->
      <div class="text-center mb-4 sm:mb-6">
        <h2 class="text-white text-lg sm:text-xl font-semibold font-pretendard mb-1 sm:mb-2">
          참여 중인
        </h2>
        <h2 class="text-white text-lg sm:text-xl font-semibold font-pretendard">
          채팅방이 없어요
        </h2>
      </div>

      <!-- 서브 텍스트 -->
      <div class="text-center px-4">
        <p
          class="text-[#C9C9C9] text-xs sm:text-sm font-light font-pretendard leading-relaxed"
        >
          챌린지에 도전 중이어야<br />
          채팅에 참여 할 수 있어요
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
</script>

<style scoped>
/* 스크롤바 숨기기 */
::-webkit-scrollbar {
  display: none;
}
</style>
