<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      @click="handleOverlayClick"
    >
      <div
        :class="[
          'bg-[#414141] rounded-2xl shadow-xl w-full max-h-[90vh] overflow-hidden',
          sizeClasses[size],
          customClass,
        ]"
        @click.stop
      >
        <!-- 헤더 -->
        <header
          v-if="title || showCloseButton || $slots.header"
          class="flex items-center justify-between p-6 border-b border-gray-200"
        >
          <slot name="header">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ title }}
            </h2>
          </slot>

          <button
            v-if="showCloseButton"
            @click="closeModal"
            class="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="모달 닫기"
          >
            <X :size="20" class="text-gray-500" />
          </button>
        </header>

        <!-- 내용 -->
        <main class="px-6 pt-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <slot name="content" />
        </main>

        <!-- 푸터 -->
        <footer
          v-if="$slots.actions"
          class="bg-[#f1f1f1]"
        >
          <slot name="actions" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, toRefs } from 'vue';
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

console.log('Modal setup - initial modelValue:', props.modelValue);

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
watch(() => props.modelValue, (newValue) => {
  console.log('Modal watch - modelValue changed to:', newValue);
  toggleBodyScroll(newValue);
});
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
