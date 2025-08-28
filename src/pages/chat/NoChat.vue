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
          {{ mainMessage.line1 }}
        </h2>
        <h2 class="text-white text-lg sm:text-xl font-semibold font-pretendard">
          {{ mainMessage.line2 }}
        </h2>
      </div>

      <!-- 서브 텍스트 -->
      <div class="text-center px-4">
        <p
          class="text-[#C9C9C9] text-xs sm:text-sm font-light font-pretendard leading-relaxed"
          v-html="subMessage"
        >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/layout/Header.vue';

const route = useRoute();

// URL 쿼리 파라미터에서 상태 정보 가져오기
const challengeStatus = computed(() => route.query.status || 'no_challenge');

// 상태별 메시지 설정
const mainMessage = computed(() => {
  switch (challengeStatus.value) {
    case 'failed':
      return {
        line1: '챌린지에',
        line2: '실패했어요'
      };
    case 'completed':
      return {
        line1: '챌린지를',
        line2: '완료했어요'
      };
    case 'closed':
      return {
        line1: '챌린지가',
        line2: '종료되었어요'
      };
    default:
      return {
        line1: '참여 중인',
        line2: '채팅방이 없어요'
      };
  }
});

const subMessage = computed(() => {
  switch (challengeStatus.value) {
    case 'failed':
      return '챌린지에 실패하여<br />채팅방을 이용할 수 없어요';
    case 'completed':
      return '챌린지를 완료하여<br />채팅방이 종료되었어요';
    case 'closed':
      return '종료된 챌린지의<br />채팅방은 이용할 수 없어요';
    default:
      return '챌린지에 도전 중이어야<br />채팅에 참여 할 수 있어요';
  }
});
</script>

<style scoped>
/* 스크롤바 숨기기 */
::-webkit-scrollbar {
  display: none;
}
</style>
