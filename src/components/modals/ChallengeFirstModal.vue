<template>
  <Modal
    v-model="innerModel"
    title="저금 완료"
    :show-close-button="false"
    custom-class="w-[328px] h-[283px]"
    @close="emitClose"
  >
    <div class="text-center h-full flex flex-col justify-between p-6 relative">
      <!-- Check Icon Circle -->
      <div class="absolute top-9 left-1/2 transform -translate-x-1/2">
        <div
          class="w-12 h-12 bg-brand rounded-full flex items-center justify-center"
        >
          <i
            class="fas fa-check text-white flex items-center justify-center"
            style="font-size: 20px"
          ></i>
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <p class="text-white mb-2 text-[28px] font-bold">
          {{ formattedAmount }}원
        </p>
        <p class="text-white text-[20px] font-medium">저금 완료</p>
      </div>

      <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <Button @click="emitNext" variant="primary" class="!w-[288px]">
          다음
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { computed } from 'vue';
import Modal from '../../components/Modal.vue';
import Button from '../../components/Button.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  amount: { type: Number, required: true },
});

const emit = defineEmits(['update:modelValue', 'next', 'close']);

const innerModel = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const formattedAmount = computed(() => {
  const amount = props.amount;
  if (amount == null || isNaN(amount)) {
    return '0';
  }
  return Number(amount).toLocaleString();
});

const emitNext = () => emit('next');
const emitClose = () => emit('close');
</script>
