<!-- step1welcome.vue -->
<template>
  <div class="flex flex-col min-h-screen px-5 relative">
    <!-- content -->
    <div
      class="flex flex-col flex-1 justify-center items-center -translate-y-12"
    >
      <div class="max-w-[230px] w-full">
        <img
          :src="accountstr"
          alt="account illustration"
          class="w-full h-auto object-contain"
        />
      </div>

      <div class="text-center">
        <h2 class="text-2xl font-medium mb-2 text-white">서비스 이용을 위해</h2>
        <h2 class="text-2xl font-medium mb-0 text-white">
          계좌 연결이 필요합니다
        </h2>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="absolute bottom-5 left-5 right-5 z-10">
      <div class="flex justify-center">
        <div class="w-[328px]">
          <Button
            label="계좌 연결하러 가기"
            :disabled="false"
            @click="$emit('next')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '../../../components/Button.vue';
import accountstr from '@/assets/accountstr.svg';
defineEmits(['next']);
</script>
