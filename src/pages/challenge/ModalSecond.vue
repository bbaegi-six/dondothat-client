<template>
  <Modal
    v-model="innerModel"
    :show-close-button="false"
    custom-class="w-[328px] h-[350px]"
    @close="emitClose"
  >
    <div class="text-center h-full flex flex-col justify-between p-6 relative">
      <!-- 콘페티 효과 -->
      <div class="confetti-container">
        <div
          class="confetti"
          v-for="i in 50"
          :key="i"
          :class="`confetti-${i % 6}`"
        ></div>
      </div>
      <!-- 헤더 -->
      <div class="mb-6">
        <p class="text-white text-[24px] font-bold mb-2">🎉 티어 업!</p>
        <p class="text-white text-[14px] opacity-80">
          축하합니다! 새로운 등급에 도달했습니다
        </p>
      </div>

      <!-- 현재 티어 이미지 -->
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-24 h-24 mb-4 tier-upgrade-animation">
            <img
              :src="getCurrentTierImage"
              alt="현재 티어"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-white text-[18px] font-bold">
            {{ getCurrentTierName }}
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
import { computed, watch, ref } from 'vue';
import { authAPI } from '../../utils/api';
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
  tierData: { type: Object, default: null }, // 부모에서 미리 로드한 티어 정보
});

const emit = defineEmits(['update:modelValue', 'next', 'close']);

// 티어 정보 상태 (props로 받지 못한 경우 백업용)
const tierInfo = ref(null);

// 티어 이미지 매핑
const tierImages = {
  1: tier01,
  2: tier02,
  3: tier03,
  4: tier04,
  5: tier05,
  6: tier06,
};

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

// 현재 티어 이미지 (computed로 반응성 보장)
const getCurrentTierImage = computed(() => {
  // props에서 받은 tierData 우선 사용, 없으면 내부 tierInfo 사용
  const currentTierInfo = props.tierData || tierInfo.value;
  const tierId = currentTierInfo?.tierId;


  // 모달이 표시되는 상태에서는 항상 유효한 tier 데이터가 있어야 함
  const selectedImage = tierImages[tierId] || tier00;
  return selectedImage;
});

// 현재 티어 이름 (computed로 반응성 보장)
const getCurrentTierName = computed(() => {
  // props에서 받은 tierData 우선 사용, 없으면 내부 tierInfo 사용
  const currentTierInfo = props.tierData || tierInfo.value;
  const tierName = currentTierInfo?.tierName;


  // 모달이 표시되는 상태에서는 항상 유효한 tier 데이터가 있어야 함
  const finalTierName = tierName || '미등급';
  return finalTierName;
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

/* 콘페티 효과 */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  animation: confetti-fall 3s linear infinite;
}

/* 랜덤한 콘페티 스타일들 */
.confetti:nth-child(1) {
  left: 5%;
  animation-delay: 0.1s;
  background: #ff6b6b;
  animation-duration: 2.8s;
  width: 6px;
  height: 6px;
}
.confetti:nth-child(2) {
  left: 15%;
  animation-delay: 0.3s;
  background: #4ecdc4;
  animation-duration: 3.2s;
  width: 10px;
  height: 4px;
}
.confetti:nth-child(3) {
  left: 25%;
  animation-delay: 0.7s;
  background: #45b7d1;
  animation-duration: 2.5s;
  width: 8px;
  height: 8px;
}
.confetti:nth-child(4) {
  left: 35%;
  animation-delay: 0.2s;
  background: #96ceb4;
  animation-duration: 3.5s;
  width: 5px;
  height: 12px;
}
.confetti:nth-child(5) {
  left: 45%;
  animation-delay: 0.9s;
  background: #ffeaa7;
  animation-duration: 2.9s;
  width: 9px;
  height: 6px;
}
.confetti:nth-child(6) {
  left: 55%;
  animation-delay: 0.4s;
  background: #dda0dd;
  animation-duration: 3.1s;
  width: 7px;
  height: 7px;
}
.confetti:nth-child(7) {
  left: 65%;
  animation-delay: 1.1s;
  background: #ff9ff3;
  animation-duration: 2.7s;
  width: 4px;
  height: 10px;
}
.confetti:nth-child(8) {
  left: 75%;
  animation-delay: 0.6s;
  background: #54a0ff;
  animation-duration: 3.3s;
  width: 11px;
  height: 5px;
}
.confetti:nth-child(9) {
  left: 85%;
  animation-delay: 1.3s;
  background: #5f27cd;
  animation-duration: 2.6s;
  width: 6px;
  height: 9px;
}
.confetti:nth-child(10) {
  left: 95%;
  animation-delay: 0.8s;
  background: #ff6348;
  animation-duration: 3.4s;
  width: 8px;
  height: 6px;
}
.confetti:nth-child(11) {
  left: 12%;
  animation-delay: 1.5s;
  background: #00d2d3;
  animation-duration: 2.8s;
  width: 7px;
  height: 11px;
}
.confetti:nth-child(12) {
  left: 28%;
  animation-delay: 0.5s;
  background: #ff9f43;
  animation-duration: 3s;
  width: 9px;
  height: 4px;
}
.confetti:nth-child(13) {
  left: 42%;
  animation-delay: 1.2s;
  background: #ee5a24;
  animation-duration: 2.9s;
  width: 5px;
  height: 8px;
}
.confetti:nth-child(14) {
  left: 58%;
  animation-delay: 0.9s;
  background: #0abde3;
  animation-duration: 3.2s;
  width: 10px;
  height: 6px;
}
.confetti:nth-child(15) {
  left: 73%;
  animation-delay: 1.7s;
  background: #006ba6;
  animation-duration: 2.7s;
  width: 6px;
  height: 10px;
}
.confetti:nth-child(16) {
  left: 88%;
  animation-delay: 0.3s;
  background: #f8b500;
  animation-duration: 3.1s;
  width: 8px;
  height: 5px;
}
.confetti:nth-child(17) {
  left: 8%;
  animation-delay: 1s;
  background: #d63031;
  animation-duration: 2.8s;
  width: 7px;
  height: 9px;
}
.confetti:nth-child(18) {
  left: 22%;
  animation-delay: 1.4s;
  background: #00b894;
  animation-duration: 3.3s;
  width: 9px;
  height: 7px;
}
.confetti:nth-child(19) {
  left: 38%;
  animation-delay: 0.7s;
  background: #6c5ce7;
  animation-duration: 2.6s;
  width: 6px;
  height: 11px;
}
.confetti:nth-child(20) {
  left: 52%;
  animation-delay: 1.6s;
  background: #fd79a8;
  animation-duration: 3s;
  width: 11px;
  height: 4px;
}
.confetti:nth-child(21) {
  left: 3%;
  animation-delay: 2.1s;
  background: #e17055;
  animation-duration: 2.9s;
  width: 5px;
  height: 7px;
}
.confetti:nth-child(22) {
  left: 18%;
  animation-delay: 0.4s;
  background: #00cec9;
  animation-duration: 3.1s;
  width: 9px;
  height: 5px;
}
.confetti:nth-child(23) {
  left: 33%;
  animation-delay: 1.8s;
  background: #fdcb6e;
  animation-duration: 2.7s;
  width: 6px;
  height: 10px;
}
.confetti:nth-child(24) {
  left: 47%;
  animation-delay: 0.6s;
  background: #a29bfe;
  animation-duration: 3.4s;
  width: 12px;
  height: 3px;
}
.confetti:nth-child(25) {
  left: 62%;
  animation-delay: 1.9s;
  background: #fd79a8;
  animation-duration: 2.8s;
  width: 4px;
  height: 9px;
}
.confetti:nth-child(26) {
  left: 77%;
  animation-delay: 0.1s;
  background: #00b894;
  animation-duration: 3s;
  width: 8px;
  height: 6px;
}
.confetti:nth-child(27) {
  left: 92%;
  animation-delay: 1.4s;
  background: #e84393;
  animation-duration: 2.9s;
  width: 7px;
  height: 8px;
}
.confetti:nth-child(28) {
  left: 7%;
  animation-delay: 0.8s;
  background: #0984e3;
  animation-duration: 3.2s;
  width: 10px;
  height: 5px;
}
.confetti:nth-child(29) {
  left: 21%;
  animation-delay: 2s;
  background: #00a085;
  animation-duration: 2.6s;
  width: 5px;
  height: 11px;
}
.confetti:nth-child(30) {
  left: 39%;
  animation-delay: 0.9s;
  background: #fab1a0;
  animation-duration: 3.3s;
  width: 9px;
  height: 4px;
}
.confetti:nth-child(31) {
  left: 51%;
  animation-delay: 1.7s;
  background: #6c5ce7;
  animation-duration: 2.8s;
  width: 6px;
  height: 8px;
}
.confetti:nth-child(32) {
  left: 67%;
  animation-delay: 0.2s;
  background: #ff7675;
  animation-duration: 3.1s;
  width: 8px;
  height: 7px;
}
.confetti:nth-child(33) {
  left: 83%;
  animation-delay: 1s;
  background: #74b9ff;
  animation-duration: 2.9s;
  width: 7px;
  height: 6px;
}
.confetti:nth-child(34) {
  left: 97%;
  animation-delay: 1.8s;
  background: #55a3ff;
  animation-duration: 3s;
  width: 5px;
  height: 10px;
}
.confetti:nth-child(35) {
  left: 13%;
  animation-delay: 0.7s;
  background: #fd79a8;
  animation-duration: 2.7s;
  width: 11px;
  height: 4px;
}
.confetti:nth-child(36) {
  left: 29%;
  animation-delay: 1.3s;
  background: #fdcb6e;
  animation-duration: 3.2s;
  width: 4px;
  height: 9px;
}
.confetti:nth-child(37) {
  left: 44%;
  animation-delay: 0.4s;
  background: #e17055;
  animation-duration: 2.8s;
  width: 9px;
  height: 6px;
}
.confetti:nth-child(38) {
  left: 59%;
  animation-delay: 2.2s;
  background: #00b894;
  animation-duration: 3.1s;
  width: 6px;
  height: 8px;
}
.confetti:nth-child(39) {
  left: 71%;
  animation-delay: 0.6s;
  background: #a29bfe;
  animation-duration: 2.9s;
  width: 8px;
  height: 5px;
}
.confetti:nth-child(40) {
  left: 86%;
  animation-delay: 1.5s;
  background: #2d3436;
  animation-duration: 3s;
  width: 7px;
  height: 7px;
}

@keyframes confetti-fall {
  0% {
    top: -20px;
    transform: rotate(0deg) scale(1) translateX(0px);
    opacity: 1;
  }
  25% {
    transform: rotate(90deg) scale(0.9) translateX(10px);
    opacity: 0.9;
  }
  50% {
    transform: rotate(180deg) scale(0.8) translateX(-5px);
    opacity: 0.7;
  }
  75% {
    transform: rotate(270deg) scale(0.7) translateX(8px);
    opacity: 0.5;
  }
  100% {
    top: 100%;
    transform: rotate(360deg) scale(0.5) translateX(-3px);
    opacity: 0;
  }
}
</style>
