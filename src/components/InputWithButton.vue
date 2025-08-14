<template>
  <div class="flex gap-4 items-center">
    <Input
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :placeholder="placeholder"
      :type="type"
      class="flex-1"
    />
    <button
      @click="$emit('buttonClick')"
      class="w-16 h-[48px] bg-brand text-white border-none rounded-10 text-sm cursor-pointer flex-shrink-0"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script setup>
import Input from './Input.vue';

defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  buttonLabel: {
    type: String,
    required: true,
  },
});

defineEmits(['update:modelValue', 'buttonClick']);
</script>

<style scoped></style>
