<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="close"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ title }}</h2>
          <button @click="close" class="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <div class="p-4">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="p-4 border-t flex justify-end gap-2">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
