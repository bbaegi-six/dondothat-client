<template>
  <Modal
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @close="$emit('close')"
    size="small"
    :overlay-close="true"
    custom-class="bg-[#2f2f2f] rounded-2xl"
  >
    <div class="p-6 text-white">
      <h2 class="text-xl font-semibold text-center mb-4">저금통 기능이란?</h2>
      <div class="flex justify-center items-center space-x-4 mb-4">
        <img
          src="/images/help/screenshot_1.png"
          alt="저금통 스크린샷 1"
          class="w-1/2 h-auto object-contain rounded-2xl"
        />
        <img
          src="/images/help/screenshot_2.png"
          alt="저금통 스크린샷 2"
          class="w-1/2 h-auto object-contain rounded-2xl"
        />
      </div>
      <p class="text-center text-sm mb-3">
        저금통은 여러분의 절약 습관을 형성하고 재정 목표를 달성하도록 돕는
        기능입니다.
      </p>
      <p class="text-center text-sm mb-3">
        이 기능을 사용하려면 먼저 추가 계좌를 등록해야 합니다. 등록된 계좌를
        통해 챌린지에서 아낀 금액을 저금통으로 옮겨 저축할 수 있습니다.
      </p>
      <p class="text-center text-sm mb-6">
        예를 들어, '커피 안 마시기 챌린지'를 통해 50,000원을 아꼈다면, 이
        금액을 저금통에 바로 저금할 수 있습니다.
      </p>
      <button
        @click="$emit('close')"
        class="w-full py-3 bg-[#ff5555] text-white rounded-2xl font-semibold"
      >
        확인
      </button>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Modal.vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:modelValue', 'close']);
</script>
