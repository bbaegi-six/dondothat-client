<template>
  <Modal
    v-model="innerModel"
    :show-close-button="false"
    custom-class="w-[328px] h-[457px]"
    @close="emitClose"
  >
    <div class="text-center h-full flex flex-col justify-between p-6 relative">
      <div class="flex-1 flex flex-col">
        <p class="text-white text-[24px] font-bold" style="margin-top: 16px">
          AI 추천 적금 상품
        </p>
        <ul class="mt-8">
          <div class="flex justify-center">
            <hr
              class="w-[300px]"
              style="
                border-top: 0.5px solid #626262;
                border-bottom: none;
                border-left: none;
                border-right: none;
              "
            />
          </div>
          
          <!-- 로딩 상태 -->
          <div v-if="finproductStore.loading" class="flex flex-col items-center py-8">
            <!-- 스피닝 로더 -->
            <div class="w-12 h-12 mb-4">
              <svg
                class="w-12 h-12 text-white animate-spin-slow"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
                />
              </svg>
            </div>
            <div class="text-white text-sm">추천 상품을 불러오는 중...</div>
          </div>
          
          <!-- 에러 상태 -->
          <div v-else-if="finproductStore.error" class="flex justify-center py-8">
            <div class="text-gray-400 text-sm">추천 상품을 불러올 수 없습니다</div>
          </div>
          
          <!-- 상품 리스트 -->
          <template v-else-if="savingsProducts.length > 0" v-for="(item, index) in savingsProducts" :key="`${item.bank}-${item.name}`">
            <li>
              <div
                class="flex items-center py-5 cursor-pointer hover:bg-gray-800 hover:bg-opacity-20 transition-colors duration-200 rounded-lg px-2 -mx-2"
                @click="navigateToProduct(item)"
              >
                <img
                  :src="item.logo"
                  alt=""
                  class="flex-shrink-0 w-[32px] h-[32px]"
                />
                <div class="flex flex-col flex-shrink-0 ml-3 w-[140px]">
                  <p
                    class="text-white text-[15px] text-left font-bold overflow-hidden text-ellipsis whitespace-nowrap"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </p>
                  <p class="text-white text-[13px] text-left">
                    {{ item.bank }}
                  </p>
                </div>
                <div class="flex-1"></div>
                <div class="flex-shrink-0 w-[80px] text-right">
                  <div class="text-brand font-bold text-right leading-tight">
                    <div class="flex items-baseline justify-end whitespace-nowrap">
                      <span class="text-[12px] mr-1">최고</span>
                      <span class="text-[16px]">{{ item.maxRate }}%</span>
                    </div>
                  </div>
                  <p class="text-gray-4 text-[12px] mt-1 leading-none">
                    기본 {{ item.baseRate }}%
                  </p>
                </div>
                <i
                  class="text-white fas fa-angle-right flex items-center ml-3"
                ></i>
              </div>
            </li>
            <div class="flex justify-center">
              <hr
                class="w-[300px]"
                style="
                  border-top: 0.5px solid #626262;
                  border-bottom: none;
                  border-left: none;
                  border-right: none;
                "
              />
            </div>
          </template>
          
          <!-- 데이터 없음 상태 -->
          <div v-else class="flex justify-center py-8">
            <div class="text-gray-400 text-sm">추천할 상품이 없습니다</div>
          </div>
        </ul>
      </div>
      <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <button
          @click="emitClose"
          class="w-[288px] h-14 py-3 rounded-16 font-pretendard font-normal text-base transition text-gray-800"
          style="background-color: #f1f1f1"
        >
          닫기
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/ui/Modal.vue';
import { useChallengeStore } from '@/stores/challenge';
import { useFinproductStore } from '@/stores/finproduct';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(['update:modelValue', 'close']);

const challengeStore = useChallengeStore();
const router = useRouter();
const finproductStore = useFinproductStore();

const innerModel = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

// 스토어에서 변환된 상품 데이터 사용
const savingsProducts = computed(() => finproductStore.transformedRecommendations);

// 모달이 열릴 때마다 추천 상품 조회 (사용자별 개인화를 위해 매번 새로 호출)
watch(() => props.modelValue, async (newValue) => {
  if (newValue) {
    await finproductStore.fetchRecommendedSavings(3);
  }
}, { immediate: true });

const emitClose = async () => {
  // closeChallenge API 호출 - userChallengeData의 user_challenge_id 사용
  if (challengeStore.userChallengeData?.user_challenge_id) {
    try {
      await challengeStore.closeChallenge(
        challengeStore.userChallengeData.user_challenge_id
      );
      console.log('챌린지 닫기 성공');
    } catch (error) {
      console.error('챌린지 닫기 실패:', error);
    }
  }

  // 모달 닫기
  emit('close');

  // challenge 페이지로 이동 - 강제 새로고침을 위해 다른 경로를 거쳐서 이동
  await router.push('/');
  await router.push('/challenge');
};

const navigateToProduct = (product) => {
  // 외부 URL로 새 탭에서 열기
  window.open(product.url, '_blank');
};
</script>

<style scoped>
@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
</style>
