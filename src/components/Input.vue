<template>
  <div :style="{ width: width }">
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="h-12 px-4 py-3 rounded-10 bg-white text-gray-800 placeholder-gray-400 focus:outline-none w-full"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  width: {
    type: String,
    default: "328px",
  },
});
defineEmits(["update:modelValue"]);
</script>
