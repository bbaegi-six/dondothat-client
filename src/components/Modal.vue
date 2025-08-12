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
              'bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden',
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
            <main class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <slot />
            </main>

            <!-- 푸터 -->
            <footer
              v-if="$slots.footer"
              class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50"
            >
              <slot name="footer" />
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
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
