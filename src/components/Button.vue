<template>
  <button
    class="w-82 h-14 py-3 rounded-16 text-white font-bold hover:bg-red-600 transition"
    style="background-color: #ff5555"
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
});
</script>
