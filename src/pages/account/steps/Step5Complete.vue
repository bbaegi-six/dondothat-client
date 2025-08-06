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
          {{ successTitle }}
        </h2>
        <p class="text-gray-400 text-[12px] text-center">
          {{ successDescription }}
        </p>
      </div>

      <!-- Spacer to push content to center -->
      <div class="flex-1"></div>

      <!-- Bottom Section - Fixed spacing -->
      <div class="pb-10">
        <div class="flex flex-col items-center space-y-4">
          <!-- Account Info Card -->
          <div class="bg-white rounded-16 p-4 w-[328px]">
            <h3 class="text-gray-900 font-medium mb-3 text-[14px]">
              {{ accountCardTitle }}
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
                :disabled="false"
                class="font-normal"
                @click="goToChallenge"
              >
                챌린지 바로가기
              </Button>
            </div>
            <div class="w-full">
              <button
                class="w-full h-14 py-3 rounded-16 font-normal transition bg-white text-gray-900 hover:bg-gray-100"
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
        <!-- Error Icon - X 모양으로 변경 -->
        <div
          class="w-16 h-16 bg-gray-500 rounded-full mb-3 flex items-center justify-center"
        >
          <!-- X 아이콘 - 더 두껍게 -->
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="text-[20px] font-bold mb-1 text-white text-center">
          연결 실패!
        </h2>
        <!-- 상세 에러 메시지 -->
        <div class="w-[328px] text-center">
          <p class="text-gray-300 text-[14px] whitespace-pre-line">
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!-- Bottom Section - Only Retry Button -->
      <div class="pb-10">
        <div class="flex justify-center">
          <div class="w-[328px]">
            <Button
              :disabled="false"
              class="font-normal"
              @click="retryConnection"
            >
              다시 연결하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '../../../stores/account';
import Button from '../../../components/Button.vue';

const router = useRouter();
const accountStore = useAccountStore();

const props = defineProps({
  flowData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['back']);

// 성공/실패 상태 관리
const isError = ref(false);
const errorMessage = ref('');

// 에러 메시지 매핑 함수
const getErrorMessage = (errorCode) => {
  // 에러 코드별 사용자 친화적 메시지 매핑
  switch (errorCode) {
    case 'ASSET_ALREADY_EXISTS':
      return '이미 연결된 계좌가 있습니다.';

    case 'CODEF_FAIL':
      return '입력하신 정보를 다시 확인해 주세요.';

    case 'ASSET_FAIL':
      return '입력하신 정보를 다시 확인하거나\n 잠시 후 다시 시도해 주세요.';

    case 'TRANSACTION_FAIL':
      return '계좌번호를 다시 확인해 주세요.';

    default:
      return '다시 시도해 주세요.';
  }
};

// 마운트 시 Step4에서 받은 API 응답 결과 확인
onMounted(() => {
  const connectionResult = props.flowData?.connectionResult;

  console.log('Step5 연결 결과:', connectionResult);

  if (connectionResult) {
    isError.value = !connectionResult.success;
    if (!connectionResult.success) {
      // 에러 코드를 확인하여 적절한 메시지 표시
      const errorCode = connectionResult.errorCode || connectionResult.error;
      const originalMessage =
        connectionResult.error || connectionResult.message;

      console.log('에러 코드:', errorCode);
      console.log('원본 메시지:', originalMessage);

      errorMessage.value = getErrorMessage(errorCode, originalMessage);
    }
  } else {
    // connectionResult가 없는 경우 실패로 처리
    isError.value = true;
    errorMessage.value = getErrorMessage(null, '연결 중 오류가 발생했습니다.');
  }
});

// 계좌 타입에 따른 제목들
const successTitle = computed(() => {
  if (accountStore.accountType === 'sub') {
    return '저금통 연결 완료!';
  }
  return '계좌 연결 완료!';
});

const successDescription = computed(() => {
  if (accountStore.accountType === 'sub') {
    return '챌린지에 참여해볼까요?';
  }
  return '소비습관을 분석하고 챌린지 참여해볼까요?';
});

const accountCardTitle = computed(() => {
  if (accountStore.accountType === 'sub') {
    return '연결된 저금통 정보';
  }
  return '연결된 계좌 정보';
});

// 계좌 정보 계산 - Step3에서 받은 데이터 사용
const bankName = computed(() => {
  // Step2에서 선택한 은행 정보 우선
  return (
    props.flowData?.selectedBank?.name ||
    props.flowData?.accountInfo?.bankName ||
    'KB국민은행'
  );
});

const maskedAccountNumber = computed(() => {
  // Step3에서 입력한 계좌번호 (bankAccount 필드 사용)
  const accountNumber = props.flowData?.accountInfo?.bankAccount;
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
  // 백엔드에서 받은 계좌명이 있으면 사용
  const backendAccountName = props.flowData?.connectionResult?.accountName;
  if (backendAccountName) {
    return backendAccountName;
  }

  return '홍**님 입출금통장';
});

// 버튼 핸들러
const goToChallenge = () => {
  console.log('챌린지로 이동');
  // 계좌 타입 초기화
  accountStore.clearAccountType();
  router.push('/challenge');
};

const goToHome = () => {
  console.log('홈으로 이동');
  // 계좌 타입 초기화
  accountStore.clearAccountType();
  router.push('/home');
};

const retryConnection = () => {
  // 다시 연결하기 - step3로 돌아가기 (기존 데이터 유지)
  console.log('다시 연결 시도 - step3로 돌아가기 (데이터 유지)');
  emit('back', { preserveData: true });
};
</script>
