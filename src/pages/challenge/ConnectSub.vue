<template>
  <div>
    <!-- Main Challenge Page -->
    <div class="flex flex-col h-screen">

      <!-- Main Content Area -->
      <div
        class="flex-1 flex items-center justify-center pt-[60px] pb-[90px] px-5"
      >
        <!-- Empty State Container - 328 × 296 -->
        <div
          class="w-[328px] h-[296px] text-center flex flex-col justify-center"
        >
          <!-- Icon Circle - 하얀색 배경 -->
          <div
            class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <i class="fas fa-coins text-4xl" style="color: #ff5555"></i>
          </div>

          <!-- Main Text -->
          <h2
            class="text-white text-2xl font-bold mb-6 leading-tight font-pretendard"
          >
            저금통 계좌를<br />
            연결해주세요
          </h2>

          <!-- Subtitle -->
          <div class="text-white text-base font-pretendard space-y-1 mb-12">
            <p>첼린지로 아낀 금액을 저금하기 위해서는</p>
            <p>저금통 계좌 연결이 필요합니다</p>
          </div>
        </div>
      </div>

      <div class="pb-[90px] flex gap-3 px-8">
        <button
          class="w-full h-14 py-3 rounded-16 transition"
          :class="'bg-brand text-white hover:bg-red-600'"
          @click="goAccount()"
        >
          연결하기
        </button>
        <button
          class="w-full h-14 py-3 rounded-16 transition"
          :class="'bg-gray-5 text-gray-1 hover:bg-gray-4'"
          @click="router.push('/')"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/account';

const accountStore = useAccountStore();
const router = useRouter();

const goAccount = () => {
  accountStore.setAccount('sub', false);
  router.push('/account');
};
</script>
