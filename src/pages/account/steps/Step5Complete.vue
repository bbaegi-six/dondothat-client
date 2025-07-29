<!-- step5complete.vue -->
<template>
  <div class="flex flex-col h-full px-5 relative font-pretendard">
    <!-- Success State -->
    <div v-if="!isError" class="flex flex-col h-full">
      <!-- Spacer to push content to center -->
      <div class="flex-1"></div>

      <!-- Center Section - Icon and Text -->
      <div class="flex flex-col items-center justify-center">
        <!-- Success Icon -->
        <div
          class="w-16 h-16 bg-[#FF5555] rounded-full mb-3 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="text-[20px] font-bold mb-1 text-white text-center">
          연결 완료!
        </h2>
        <p class="text-gray-400 text-[12px] text-center">
          소비습관을 분석하고 챌린지 참여해볼까요?
        </p>
      </div>

      <!-- Spacer to push content to center -->
      <div class="flex-1"></div>

      <!-- Bottom Section - Fixed spacing -->
      <div class="pb-5">
        <div class="flex flex-col items-center space-y-4">
          <!-- Account Info Card -->
          <div class="bg-white rounded-xl p-4 w-[328px]">
            <h3 class="text-gray-900 font-medium mb-3 text-[14px]">
              연결 계좌 정보
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 text-[14px]">은행명</span>
                <span class="text-gray-900 font-medium text-[14px]">{{
                  bankName
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 text-[14px]">계좌번호</span>
                <span class="text-gray-900 font-medium text-[14px]">{{
                  maskedAccountNumber
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 text-[14px]">계좌명</span>
                <span class="text-gray-900 font-medium text-[14px]">{{
                  accountName
                }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3 w-[328px]">
            <div class="w-full">
              <Button
                label="챌린지 바로가기"
                :disabled="false"
                @click="goToChallenge"
              />
            </div>
            <div class="w-full">
              <button
                class="w-full h-14 py-3 rounded-xl font-bold transition bg-white text-gray-900 hover:bg-gray-100"
                @click="goToHome"
              >
                홈으로 이동하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex flex-col h-full">
      <!-- Center Section - Error Icon and Text -->
      <div class="flex-1 flex flex-col items-center justify-center">
        <!-- Error Icon -->
        <div
          class="w-16 h-16 bg-gray-500 rounded-full mb-3 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-8h2v6h-2z"
            />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="text-[20px] font-bold mb-1 text-white text-center">
          연결 실패!
        </h2>
        <p class="text-gray-400 text-[12px] text-center">
          계좌에 다시 연결해볼까요?
        </p>
      </div>

      <!-- Bottom Section - Error Buttons -->
      <div class="pb-5">
        <div class="flex flex-col items-center">
          <div class="w-[328px]">
            <Button
              label="다시 연결하기"
              :disabled="false"
              @click="retryConnection"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../../../components/Button.vue';

const router = useRouter();

const props = defineProps({
  flowData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['back']);

// 성공/실패 상태 관리
const isError = ref(false);

// 백엔드 응답에 따라 성공/실패 결정 (예시)
onMounted(() => {
  // 실제로는 props.flowData에서 백엔드 응답 확인
  // 예: props.flowData.isSuccess, props.flowData.error 등

  // 테스트용: 50% 확률로 실패 (랜덤)
  const shouldFail = false;

  console.log('Step5 결과:', shouldFail ? '실패' : '성공');
});

// 계좌 정보 계산
const bankName = computed(() => {
  return props.flowData.selectedBank?.name || 'KB국민은행';
});

const maskedAccountNumber = computed(() => {
  const accountNumber = props.flowData.accountInfo?.accountNumber;
  if (!accountNumber) return '123456-****-34';

  // 숫자만 추출 (하이픈 제거)
  const numbersOnly = accountNumber.replace(/[^0-9]/g, '');

  // 무조건 앞 6자리 + 중간 마스킹 + 뒤 2자리
  if (numbersOnly.length >= 8) {
    const front = numbersOnly.slice(0, 6); // 앞 6자리
    const back = numbersOnly.slice(-2); // 뒤 2자리
    const middleLength = numbersOnly.length - 8; // 중간 자릿수
    const mask = '*'.repeat(Math.max(2, middleLength)); // 최소 2개 *
    return `${front}-${mask}-${back}`;
  } else {
    // 8자리 미만인 경우 (비정상적인 경우)
    return `${numbersOnly}-****-**`;
  }
});

const accountName = computed(() => {
  // 백엔드에서 가져올 예정
  // 현재는 임시 데이터
  return props.flowData.accountInfo?.accountName || '홍**님 입출금통장';
});

// 버튼 핸들러
const goToChallenge = () => {
  console.log('챌린지로 이동');
  router.push('/challenge');
};

const goToHome = () => {
  console.log('홈으로 이동');
  router.push('/home');
};

const retryConnection = () => {
  console.log('다시 연결 시도');
  // step3로 돌아가면서 기존 입력 데이터 유지
  emit('back', { preserveData: true });
};
</script>
