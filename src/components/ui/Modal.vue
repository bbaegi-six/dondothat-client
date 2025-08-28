<template>
  <Teleport to="body">
    <Transition
      name="modal"
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click="handleOverlayClick"
      >
        <Transition
          name="modal-content"
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="[
              'bg-gray-1 rounded-16 shadow-xl overflow-hidden',
              customClass || `w-full max-h-[90vh] ${sizeClasses[size]}`,
            ]"
            @click.stop
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, toRefs, watch } from 'vue';
import { X } from 'lucide-vue-next';

// Props 정의
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) =>
      ['small', 'medium', 'large', 'extraLarge'].includes(value),
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  overlayClose: {
    type: Boolean,
    default: true,
  },
  customClass: {
    type: String,
    default: '',
  },
  persistent: {
    type: Boolean,
    default: false,
  },
});

// Emits 정의
const emit = defineEmits(['update:modelValue', 'close']);

// 모달 크기 클래스
const sizeClasses = computed(() => ({
  small: 'max-w-md',
  medium: 'max-w-lg',
  large: 'max-w-2xl',
  extraLarge: 'max-w-4xl',
}));

// 모달 닫기 함수
const closeModal = () => {
  if (!props.persistent) {
    emit('update:modelValue', false);
    emit('close');
  }
};

// 오버레이 클릭 처리
const handleOverlayClick = () => {
  if (props.overlayClose) {
    closeModal();
  }
};

// ESC 키 처리
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.modelValue && !props.persistent) {
    closeModal();
  }
};

// 배경 스크롤 방지
const toggleBodyScroll = (disable) => {
  document.body.style.overflow = disable ? 'hidden' : '';
};

// 라이프사이클
onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  if (props.modelValue) {
    toggleBodyScroll(true);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  toggleBodyScroll(false);
});

// 모달 상태 변경 감지
const { modelValue } = toRefs(props);
watch(modelValue, (newValue) => {
  toggleBodyScroll(newValue);
});
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>