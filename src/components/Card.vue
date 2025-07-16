<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div
      v-if="$slots.header || title"
      class="px-4 py-3 border-b border-gray-200"
    >
      <slot name="header">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
      </slot>
    </div>
    <div class="p-4">
      <slot></slot>
    </div>
    <div
      v-if="$slots.footer"
      class="px-4 py-3 bg-gray-50 border-t border-gray-200"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
