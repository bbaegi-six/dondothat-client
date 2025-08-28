<template>
  <Modal
    v-model="innerModel"
    :show-close-button="false"
    custom-class="w-[328px] h-[350px]"
    @close="emitClose"
  >
    <div class="text-center h-full flex flex-col justify-between p-6 relative">
      <!-- 콘페티 효과 -->
      <ConfettiEffect />
      
      <!-- 헤더 -->
      <div class="mb-6">
        <p class="text-white text-[24px] font-bold mb-2">🎉 티어 업!</p>
        <p class="text-white text-[14px] opacity-80">
          축하합니다! 새로운 등급에 도달했습니다
        </p>
      </div>

      <!-- 현재 티어 이미지 -->
      <div class="flex-1 flex items-center justify-center">
        <TierDisplay :tier-data="currentTierInfo" />
      </div>

      <!-- 버튼 -->
      <div class="mt-6">
        <Button @click="emitNext" variant="primary" class="!w-[288px]">
          다음
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { authAPI } from '../../utils/api';
import Modal from '@/components/ui/Modal.vue';
import Button from '@/components/ui/Button.vue';
import ConfettiEffect from '@/components/effects/ConfettiEffect.vue';
import TierDisplay from '@/components/tier/TierDisplay.vue';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  tierData: { type: Object, default: null }, // 부모에서 미리 로드한 티어 정보
});

const emit = defineEmits(['update:modelValue', 'next', 'close']);

// 티어 정보 상태 (props로 받지 못한 경우 백업용)
const tierInfo = ref(null);


const innerModel = computed({
  get: () => {
    // 모달이 열리려고 할 때 tier 데이터가 있을 때만 실제로 열기
    if (!props.modelValue) return false;

    // props에서 받은 tierData가 있거나, 내부에서 로드한 tierInfo가 있을 때만 모달 표시
    const hasTierData =
      props.tierData?.tierId != null || tierInfo.value?.tierId != null;


    return props.modelValue && hasTierData;
  },
  set: (v) => emit('update:modelValue', v),
});

// 현재 티어 정보 (TierDisplay 컴포넌트에 전달)
const currentTierInfo = computed(() => {
  return props.tierData || tierInfo.value;
});

// 모달 열기 요청 시 티어 정보 처리
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      // props로 tierData가 이미 전달되었으면 API 호출 건너뛰기
      if (props.tierData) {
        return; // 즉시 모달 표시
      }

      // props에 tierData가 없으면 API 호출

      try {
        const tierData = await authAPI.getMyPageTier();
        tierInfo.value = tierData;
      } catch (error) {
        console.error('ModalSecond - 티어 정보 로딩 실패:', error);
        tierInfo.value = null;
      }
    } else {
      tierInfo.value = null;
    }
  }
);

const emitNext = () => emit('next');
const emitClose = () => emit('close');
</script>
