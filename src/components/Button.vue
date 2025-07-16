<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary' // 'primary', 'secondary', 'danger'
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'font-semibold rounded-lg transition-colors duration-200'
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
  }
  return `${base} ${sizes[props.size]} ${variants[props.variant]} ${props.disabled ? 'cursor-not-allowed' : ''}`
})
</script>
