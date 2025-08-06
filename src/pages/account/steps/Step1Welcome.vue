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
        <h2 class="text-2xl font-medium mb-2 text-white">
          서비스 이용을 위해<br />
          {{ accountTypeText }} 연결이 필요합니다
        </h2>
        <!-- // status main -> 계좌 sub -> 저금통 계좌 -->
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="absolute bottom-10 left-5 right-5 z-10">
      <div class="flex justify-center">
        <div class="w-[328px]">
          <Button :disabled="false" @click="$emit('next')" class="font-normal">
            계좌 연결하러 가기
          </Button>
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

defineEmits(['next']);

const accountStore = useAccountStore();

// 계좌 타입에 따른 텍스트 변경
const accountTypeText = computed(() => {
  console.log('계좌타입 : ' + accountStore.accountType);
  return accountStore.accountType === 'sub' ? '저금통' : '계좌';
});
</script>
