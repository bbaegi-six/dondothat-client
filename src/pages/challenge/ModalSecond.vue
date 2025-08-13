<template>
  <Modal
    v-model="innerModel"
    :show-close-button="false"
    custom-class="w-[328px] h-[350px]"
    @close="emitClose"
  >
    <div class="text-center h-full flex flex-col justify-between p-6 relative">
      <!-- 헤더 -->
      <div class="mb-6">
        <p class="text-white text-[24px] font-bold mb-2">🎉 티어 업!!!</p>
        <p class="text-white text-[14px] opacity-80">
          축하합니다! 새로운 등급에 도달했습니다
        </p>
      </div>

      <!-- 현재 티어 이미지 -->
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-24 h-24 mb-4 tier-upgrade-animation">
            <img
              :src="getCurrentTierImage()"
              alt="현재 티어"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-white text-[18px] font-bold">
            {{ getCurrentTierName() }}
          </p>
        </div>
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
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import Modal from '../../components/Modal.vue';
import Button from '../../components/Button.vue';

// 티어 이미지 임포트
import tier00 from '@/assets/tier/tier_00.png';
import tier01 from '@/assets/tier/tier_01.png';
import tier02 from '@/assets/tier/tier_02.png';
import tier03 from '@/assets/tier/tier_03.png';
import tier04 from '@/assets/tier/tier_04.png';
import tier05 from '@/assets/tier/tier_05.png';
import tier06 from '@/assets/tier/tier_06.png';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(['update:modelValue', 'next', 'close']);

// auth store에서 사용자 정보 가져오기
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// 티어 이미지 매핑
const tierImages = {
  1: tier01,
  2: tier02,
  3: tier03,
  4: tier04,
  5: tier05,
  6: tier06,
};

// 티어 이름 매핑
const tierNames = {
  1: '브론즈',
  2: '실버',
  3: '골드',
  4: '플래티넘',
  5: '루비',
  6: '에메랄드',
};

const innerModel = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

// 현재 티어 이미지 가져오기
const getCurrentTierImage = () => {
  const tierId = user.value?.tierId;

  if (!tierId || tierId === null) {
    return tier00; // 기본 이미지
  }
  return tierImages[tierId] || tier00;
};

// 현재 티어 이름 가져오기
const getCurrentTierName = () => {
  const tierId = user.value?.tierId;

  if (!tierId || tierId === null) {
    return '미등급';
  }
  return tierNames[tierId] || '미등급';
};

const emitNext = () => emit('next');
const emitClose = () => emit('close');
</script>

<style scoped>
.tier-upgrade-animation {
  animation: tierUpgrade 1.5s ease-in-out infinite alternate;
}

@keyframes tierUpgrade {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  100% {
    transform: scale(1.1);
    filter: brightness(1.2) drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
  }
}

/* 티어 이미지에 황금색 글로우 효과 */
.tier-upgrade-animation img {
  transition: all 0.3s ease;
}

.tier-upgrade-animation:hover img {
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
}
</style>
