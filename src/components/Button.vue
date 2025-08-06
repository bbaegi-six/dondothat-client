<template>
  <button
    class="w-full h-14 py-3 rounded-16 font-pretendard font-normal text-base transition"
    :class="buttonClass"
    :disabled="props.disabled"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'primary', // 'primary', 'secondary', or 'tertiary'
  },
});

const buttonClass = computed(() => {
  if (props.disabled) {
    return 'bg-gray-5 text-gray-1';
  }
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-1 text-white hover:bg-gray-700';
    case 'tertiary':
      return 'bg-gray-5 text-gray-1 hover:bg-gray-200';
    default:
      return 'bg-brand text-white hover:bg-red-600'; // Primary
  }
});
</script>
