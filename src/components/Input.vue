<template>
  <div class="w-full">
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full h-12 px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none"
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
});
defineEmits(["update:modelValue"]);
</script>
