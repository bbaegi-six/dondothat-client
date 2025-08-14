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
      <div
        class="text-white font-pretendard mb-6 text-center text-sm leading-relaxed"
      >
        <p class="mb-3">
          저금통은 챌린지를 통해 아낀 금액을 모아<br />
          절약 습관을 만들고 재정 목표를 달성하도록 도와줍니다.
        </p>
        <p class="mb-3">
          사용하려면 추가 계좌를 등록해야 하며,<br />
          연결한 계좌에서 아낀 돈을 저금통에 넣어 모을 수 있어요!
        </p>
        <div class="bg-gray-2 rounded-lg p-3 text-sm text-center">
          <p>챌린지로 50,000원을 아꼈다면,</p>
          <p>저금통에 저금하여 목표 금액에 한 걸음 더!</p>
        </div>
      </div>
      <!-- <div class="text-center text-sm mb-3">
        <p>저금통은 챌린지를 통해 아낀 금액을 모아</p>
        <p>절약 습관을 만들고 재정 목표를 달성하도록 도와줍니다.</p>
        <p>사용하려면 추가 계좌를 등록해야 하며,</p>
        <p>등록된 계좌로 아낀 금액을 저금통에 옮겨 저축할 수 있어요.</p>
      </div>
      <div class="bg-gray-2 rounded-lg p-3 text-sm mb-3">
        <p class="text-gray-4 mb-1">예시)</p>
        <p>챌린지로 50,000원을 아꼈다면,</p>
        <p>저금통에 저금하여 목표 금액에 한 걸음 더!</p>
      </div> -->

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
