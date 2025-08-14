<template>
  <Modal :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" title="직업 선택" size="small">
    <div class="p-4 text-white">
      <h3 class="text-lg font-semibold mb-4 text-center">직업을 선택해주세요</h3>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="jobOption in jobOptions"
          :key="jobOption"
          @click="selectJob(jobOption)"
          class="w-full py-3 px-4 rounded-16 text-center transition-colors bg-gray-2 hover:bg-gray-3 active:bg-brand focus:bg-brand"
        >
          {{ jobOption }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '../Modal.vue'; // Adjust path if needed
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'selectJob']);

const jobOptions = [
  '학생',
  '직장인',
  '자영업자',
  '프리랜서',
  '주부',
  '경찰',
  '군인',
  '무직',
  '기타',
];

const selectJob = (job) => {
  emit('selectJob', job);
  emit('update:modelValue', false); // Close modal after selection
};
</script>

<style scoped></style>