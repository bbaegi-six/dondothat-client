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
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-lightbulb text-yellow-400 text-lg"></i>
          <h3 class="text-white text-lg font-semibold font-pretendard">
            아낀 금액 계산은 이렇게 계산해요!
          </h3>
        </div>
      </div>

      <div class="text-white font-pretendard mb-6">
        <div class="text-sm leading-relaxed mb-3">
          <p>아낀 금액 =</p>
          <p>(과거 동일 기간 지출 총합 ÷ 챌린지 기간) × 경과일수</p>
        </div>

        <div class="bg-gray-2 rounded-lg p-3 text-sm">
          <p class="text-gray-4 mb-1">예시)</p>
          <p>지난 7일 카페 지출이 7,000원이라면</p>
          <p>하루 평균 1,000원이 매일 적립</p>
          <p>
            <i class="fa-solid fa-arrow-right"></i> 완료 시 총 7,000원 아낌!
          </p>
        </div>
      </div>
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
