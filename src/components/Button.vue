<template>
  <button
    class="w-82 h-14 py-3 rounded-16 font-bold transition"
    :class="{
      'bg-[#F1F1F1] text-[#414141]': props.disabled,
      'bg-[#ff5555] text-white hover:bg-red-600': !props.disabled,
    }"
    :disabled="props.disabled"
  >
    {{ props.label }}
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
