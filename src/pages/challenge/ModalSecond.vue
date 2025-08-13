<template>
  <Modal
    v-model="innerModel"
    :show-close-button="false"
    custom-class="w-[328px] h-[283px]"
    @close="emitClose"
  >
    <div class="text-center h-full flex flex-col justify-between p-6 relative">
      <div class="flex-1 flex flex-col justify-center">
        <p class="text-white text-[24px] font-bold">티어 레벨업</p>
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
});

const emit = defineEmits(['update:modelValue', 'next', 'close']);

const innerModel = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const emitNext = () => emit('next');
const emitClose = () => emit('close');
</script>
