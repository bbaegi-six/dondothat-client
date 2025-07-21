<template>
  <button
    class="w-full h-14 py-3 rounded-lg text-white font-bold hover:bg-red-600 transition"
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
