<template>
  <div
    class="pt-[60px] px-[31px] pb-[90px] min-h-screen w-[390px] mx-auto"
    style="background-color: #2f2f2f"
  >
    <!-- Header -->
    <Header :showBack="false" :showAddButton="false" />

    <!-- 빈 상태 컨텐츠 -->
    <div
      class="flex flex-col items-center justify-center h-[calc(100vh-200px)]"
    >
      <!-- 채팅 아이콘 -->
      <div class="mb-8">
        <div
          class="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6"
        >
          <i class="fas fa-comments text-4xl text-[#FF5555]"></i>
        </div>
      </div>

      <!-- 메인 메시지 -->
      <div class="text-center mb-6">
        <h2 class="text-white text-xl font-semibold font-pretendard mb-2">
          참여 중인
        </h2>
        <h2 class="text-white text-xl font-semibold font-pretendard">
          채팅방이 없어요
        </h2>
      </div>

      <!-- 서브 텍스트 -->
      <div class="text-center">
        <p
          class="text-[#C9C9C9] text-sm font-light font-pretendard leading-relaxed"
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
@media (max-width: 430px) {
  .w-\[390px\] {
    width: 100%;
  }
}

/* 스크롤바 숨기기 */
::-webkit-scrollbar {
  display: none;
}
</style>
