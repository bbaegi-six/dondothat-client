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
          <div v-if="finproductStore.loading" class="flex justify-center py-8">
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
                    class="text-white text-[15px] text-left font-bold whitespace-nowrap"
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
import Modal from '../../components/Modal.vue';
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
