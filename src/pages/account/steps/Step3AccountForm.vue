<!-- step3accountform.vue -->
<template>
  <div class="flex flex-col h-full px-5 relative">
    <!-- Top Section - Title -->
    <div class="pt-3 pb-4 flex justify-center">
      <div class="w-[328px]">
        <h2 class="text-lg font-semibold text-white">{{ selectedBankName }}</h2>
      </div>
    </div>

    <!-- Input Section -->
    <div class="space-y-3 mb-8 flex flex-col items-center">
      <!-- 은행 아이디 입력 -->
      <div class="w-[328px]">
        <input
          v-model="formData.bankId"
          type="text"
          placeholder="은행아이디를 입력해주세요"
          @input="handleBankIdInput"
          class="w-full h-12 px-4 bg-white rounded-lg border-none text-gray-900 placeholder-gray-500 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#FF5555]"
        />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="relative w-[328px]">
        <input
          v-model="formData.bankpw"
          :type="showPassword ? 'text' : 'password'"
          placeholder="비밀번호를 입력해주세요"
          @input="handlePasswordInput"
          class="w-full h-12 px-4 pr-12 bg-white rounded-lg border-none text-gray-900 placeholder-gray-500 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#FF5555]"
        />
        <button
          @click="togglePassword"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <svg
            v-if="!showPassword"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
            />
          </svg>
        </button>
      </div>

      <!-- 계좌번호 입력 -->
      <div class="w-[328px]">
        <input
          v-model="formData.bankAccount"
          type="text"
          placeholder="계좌번호를 입력해주세요"
          @input="handleAccountNumberInput"
          class="w-full h-12 px-4 bg-white rounded-lg border-none text-gray-900 placeholder-gray-500 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#FF5555]"
        />
      </div>

      <!-- 에러 메시지 표시 -->
      <div v-if="errorMessage" class="w-[328px]">
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm"
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <!-- Bottom Section - 하단에 모든 내용 -->
    <div class="flex-1 flex flex-col justify-end pb-10 space-y-4 items-center">
      <!-- 동의 사항 -->
      <div class="space-y-3 w-[328px]">
        <div>
          <div class="flex items-center gap-3">
            <input
              v-model="agreements.all"
              @change="toggleAllAgreements"
              type="checkbox"
              id="agree-all"
              class="w-4 h-4 text-[#FF5555] bg-gray-300 border-gray-300 rounded focus:ring-[#FF5555]"
            />
            <label for="agree-all" class="text-white font-medium text-[14px]"
              >전체 동의</label
            >
          </div>
          <!-- 전체 동의 아래 구분선 -->
          <div class="w-full h-px bg-gray-600 mt-3"></div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <input
              v-model="agreements.service"
              @change="updateAgreements"
              type="checkbox"
              id="agree-service"
              class="w-4 h-4 text-[#FF5555] bg-gray-300 border-gray-300 rounded focus:ring-[#FF5555]"
            />
            <label for="agree-service" class="text-gray-300 text-[12px]"
              >개인정보 수집 이용 동의</label
            >
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model="agreements.privacy"
              @change="updateAgreements"
              type="checkbox"
              id="agree-privacy"
              class="w-4 h-4 text-[#FF5555] bg-gray-300 border-gray-300 rounded focus:ring-[#FF5555]"
            />
            <label for="agree-privacy" class="text-gray-300 text-[12px]"
              >마이데이터 서비스 이용약관</label
            >
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model="agreements.financial"
              @change="updateAgreements"
              type="checkbox"
              id="agree-financial"
              class="w-4 h-4 text-[#FF5555] bg-gray-300 border-gray-300 rounded focus:ring-[#FF5555]"
            />
            <label for="agree-financial" class="text-gray-300 text-[12px]"
              >금융정보 전송요구서</label
            >
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model="agreements.marketing"
              @change="updateAgreements"
              type="checkbox"
              id="agree-marketing"
              class="w-4 h-4 text-[#FF5555] bg-gray-300 border-gray-300 rounded focus:ring-[#FF5555]"
            />
            <label for="agree-marketing" class="text-gray-300 text-[12px]"
              >[선택] 마케팅 정보 수신 동의</label
            >
          </div>
        </div>
      </div>

      <!-- 보안 안내 -->
      <div class="w-[328px]">
        <div class="w-full bg-[#414141] rounded-2xl p-4">
          <div class="flex items-start gap-3">
            <div
              class="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
            >
              <svg
                class="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
                />
              </svg>
            </div>
            <div>
              <p class="text-white font-medium text-[12px] mb-1">보안 안내</p>
              <ul class="text-gray-300 text-[11px] space-y-1">
                <li>• 안전한 정보는 암호화하여 보관됩니다</li>
                <li>• 로그인 정보는 저장되지 않습니다</li>
                <li>• 계좌 조회용 기능만 이용됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 연결하기 버튼 -->
      <div class="w-[328px]">
        <Button
          :disabled="!isFormValid"
          class="font-normal"
          @click="goToNextStep"
        >
          연결하기
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAccountStore } from '../../../stores/account';
import Button from '../../../components/Button.vue';

const props = defineProps({
  flowData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['next']);

const accountStore = useAccountStore();
const showPassword = ref(false);
const errorMessage = ref('');

const formData = ref({
  bankId: '',
  bankpw: '',
  bankAccount: '',
});

const agreements = ref({
  all: false,
  service: false,
  privacy: false,
  financial: false,
  marketing: false,
});

// 컴포넌트 마운트 시 기존 데이터 복원
onMounted(() => {
  console.log('Step3 마운트 - flowData:', props.flowData);

  // 기존에 입력했던 데이터가 있으면 복원
  if (props.flowData?.accountInfo) {
    const accountInfo = props.flowData.accountInfo;
    formData.value = {
      bankId: accountInfo.bankId || '',
      bankpw: accountInfo.bankpw || '',
      bankAccount: accountInfo.bankAccount || '',
    };

    // 동의 항목도 복원 (이전에 동의했다면)
    if (accountInfo.bankId || accountInfo.bankpw || accountInfo.bankAccount) {
      agreements.value = {
        all: true,
        service: true,
        privacy: true,
        financial: true,
        marketing: true,
      };
    }

    console.log('기존 데이터 복원:', formData.value);
  }
});

// flowData 변화 감지하여 데이터 복원
watch(
  () => props.flowData,
  (newFlowData) => {
    if (newFlowData?.accountInfo) {
      const accountInfo = newFlowData.accountInfo;
      formData.value = {
        bankId: accountInfo.bankId || formData.value.bankId,
        bankpw: accountInfo.bankpw || formData.value.bankpw,
        bankAccount: accountInfo.bankAccount || formData.value.bankAccount,
      };
    }
  },
  { deep: true, immediate: true }
);

// 선택된 은행명 계산
const selectedBankName = computed(() => {
  return props.flowData?.selectedBank?.name || 'KB 국민은행';
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 은행아이디 한글 입력 방지 (영문, 숫자만 허용)
const handleBankIdInput = (event) => {
  const value = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
  formData.value.bankId = value;
  event.target.value = value;
  // 에러 메시지 초기화
  if (errorMessage.value) {
    errorMessage.value = '';
  }
};

// 비밀번호 한글 입력 방지 (영문, 숫자, 특수문자만 허용)
const handlePasswordInput = (event) => {
  const value = event.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
  formData.value.bankpw = value;
  event.target.value = value;
  // 에러 메시지 초기화
  if (errorMessage.value) {
    errorMessage.value = '';
  }
};

// 계좌번호 숫자만 입력 허용 및 은행별 자릿수 제한
const handleAccountNumberInput = (event) => {
  // 숫자만 허용
  let value = event.target.value.replace(/[^0-9]/g, '');

  // 현재 선택된 은행에 따른 자릿수 제한
  const bankName = props.flowData?.selectedBank?.name || '';
  let maxLength = 15; // 기본값

  // 은행별 자릿수 설정
  switch (bankName) {
    case '신한은행':
      maxLength = 12;
      break;
    case '국민은행':
      maxLength = 14;
      break;
    case '우리은행':
      maxLength = 13;
      break;
    case '기업은행':
      maxLength = 14;
      break;
    case '하나은행':
      maxLength = 14;
      break;
    default:
      maxLength = 15; // 다른 은행들은 15자리까지
  }

  // 해당 은행의 최대 자릿수까지만 허용
  if (value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  formData.value.bankAccount = value;
  event.target.value = value;
  // 에러 메시지 초기화
  if (errorMessage.value) {
    errorMessage.value = '';
  }
};

const isFormValid = computed(() => {
  // 계좌번호에서 숫자만 추출
  const numbersOnly = formData.value.bankAccount.replace(/[^0-9]/g, '');
  const bankName = props.flowData?.selectedBank?.name || '';

  // 은행별 유효성 검사
  let isAccountNumberValid = false;

  switch (bankName) {
    case '신한은행':
      isAccountNumberValid = numbersOnly.length === 12;
      break;
    case '국민은행':
      isAccountNumberValid = numbersOnly.length === 14;
      break;
    case '우리은행':
      isAccountNumberValid = numbersOnly.length === 13;
      break;
    case '기업은행':
      isAccountNumberValid = numbersOnly.length === 14;
      break;
    case '하나은행':
      isAccountNumberValid = numbersOnly.length === 14;
      break;
    default:
      // 다른 은행들은 11-15자리
      isAccountNumberValid =
        numbersOnly.length >= 11 && numbersOnly.length <= 15;
  }

  return (
    formData.value.bankId.length > 0 &&
    formData.value.bankpw.length > 0 &&
    formData.value.bankAccount.length > 0 &&
    isAccountNumberValid &&
    agreements.value.service &&
    agreements.value.privacy &&
    agreements.value.financial
  );
});

const toggleAllAgreements = () => {
  const allChecked = agreements.value.all;
  agreements.value.service = allChecked;
  agreements.value.privacy = allChecked;
  agreements.value.financial = allChecked;
  agreements.value.marketing = allChecked;
};

const updateAgreements = () => {
  const requiredAgreements = [
    agreements.value.service,
    agreements.value.privacy,
    agreements.value.financial,
    agreements.value.marketing,
  ];
  agreements.value.all = requiredAgreements.every(Boolean);
};

// 다음 단계로 이동 (폼 검증만)
const goToNextStep = () => {
  if (!isFormValid.value) return;

  // Step4로 데이터 전달 (API 호출은 Step4에서)
  emit('next', {
    // Step2 + Step3 데이터 통합
    selectedBank: props.flowData?.selectedBank, // Step2에서 선택한 은행 정보
    accountInfo: {
      bankName: props.flowData?.selectedBank?.name, // Step2: 은행명
      bankId: formData.value.bankId, // Step3: 은행 아이디
      bankpw: formData.value.bankpw, // Step3: 비밀번호
      bankAccount: formData.value.bankAccount, // Step3: 계좌번호
    },
    // API 호출은 Step4에서 수행하므로 connectionResult는 없음
  });
};
</script>
