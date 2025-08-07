<!-- step1welcome.vue -->

<template>
  <div class="flex flex-col h-full px-5 relative">
    <!-- content -->
    <div
      class="flex flex-col flex-1 justify-center items-center -translate-y-20"
    >
      <div class="max-w-[230px] w-full">
        <img
          :src="accountstr"
          alt="account illustration"
          class="w-full h-auto object-contain"
        />
      </div>

      <div class="text-center">
        <h2 class="text-xl font-medium mb-0 text-white">
          지금부터 {{ accountTypeText }} 연결을 시작합니다
        </h2>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="absolute bottom-10 left-5 right-5 z-10">
      <div class="flex justify-center gap-4">
        <div class="w-[156px]">
          <Button label="돌아가기" variant="tertiary" @click="router.back()" />
        </div>
        <div class="w-[156px]">
          <Button label="연결하기" :disabled="false" @click="$emit('next')" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Button from '../../../components/Button.vue';
import accountstr from '@/assets/accountstr.svg';
import { computed } from 'vue';
import { useAccountStore } from '../../../stores/account';

import { useRouter } from 'vue-router';

const router = useRouter();
defineEmits(['next']);

const accountStore = useAccountStore();

// 계좌 타입에 따른 텍스트 변경
const accountTypeText = computed(() => {
  console.log(
    '계좌타입 : ' +
      accountStore.accountType +
      '수정여부 : ' +
      accountStore.isChanging
  );
  return accountStore.accountType === 'sub' ? '저금통' : '계좌';
});
</script>
