<!-- step4processing.vue -->
<template>
  <div class="flex flex-col h-full px-5 relative">
    <!-- Loading State -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <!-- Loading Animation -->
      <div class="w-16 h-16 mx-auto mb-6 relative">
        <div
          class="w-16 h-16 border-4 border-[#FF5555] border-t-transparent rounded-full animate-spin"
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg
            class="w-6 h-6 text-[#FF5555]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
            />
          </svg>
        </div>
      </div>

      <!-- Text Content -->
      <h2 class="text-lg font-semibold mb-2 text-white">{{ statusMessage }}</h2>
      <p class="text-gray-400 text-sm">
        안전한 연결을 위해 잠시만 기다려 주세요
      </p>
    </div>

    <!-- Additional Info - Fixed at bottom -->
    <div class="pb-10">
      <div class="flex justify-center">
        <div class="w-82 bg-[#414141] rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <!-- Time Icon -->
            <svg
              class="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
              />
            </svg>
            <span class="text-white text-sm font-medium">예상 완료 시간</span>
          </div>
          <p class="text-gray-300 text-xs">약 10초 ~ 1분 정도 소요됩니다.</p>
          <p class="text-gray-300 text-xs">
            은행 서버 상황에 따라 시간이 다를 수 있어요
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAccountStore } from '../../../stores/account';
import { accountService } from '../../../services/accountService';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  flowData: {
    type: Object,
    default: () => ({}),
  },
});

const accountStore = useAccountStore();
const authStore = useAuthStore();

const emit = defineEmits(['next']);
const statusMessage = ref('계좌 정보 확인 중');

// 선택된 은행명
const selectedBankName = computed(() => {
  return (
    props.flowData?.selectedBank?.name || props.flowData?.accountInfo?.bankName
  );
});

onMounted(async () => {
  // Step4에서 실제 백엔드 API 호출 수행
  try {
    // 상태 메시지 업데이트
    statusMessage.value = `${selectedBankName.value} 서버 연결 중...`;
    await new Promise((resolve) => setTimeout(resolve, 1500));

    statusMessage.value = '계좌 정보 인증 중...';
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 실제 API 호출
    const accountData = {
      bankName: props.flowData?.accountInfo?.bankName,
      bankId: props.flowData?.accountInfo?.bankId,
      bankpw: props.flowData?.accountInfo?.bankpw,
      bankAccount: props.flowData?.accountInfo?.bankAccount,
    };
    let result;
    statusMessage.value = '보안 검증 중...';
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 계좌 타입에 따라 다른 API 호출
    if (accountStore.accountType === 'sub') {
      result = await accountService.connectSubAccount(accountData);
    } else {
      result = await accountService.connectMainAccount(accountData);
    }

    statusMessage.value = '연결 완료 처리 중...';
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('계좌 연결 API 응답:', result);

    // 백엔드 응답 구조에 따른 처리
    if (result && result.success === true) {
      // ✅ 성공 시 assetConnected를 true로 업데이트
      try {
        statusMessage.value = '사용자 정보 업데이트 중...';
        if (accountStore.accountType === 'main') {
          await accountService.updateAssetConnected(true);
          // 로컬 업데이트
          if (authStore.user) {
            authStore.user.assetConnected = true;
          }
        } else if (accountStore.accountType === 'sub') {
          await accountService.updateSubAssetConnected(true);
          // 로컬 업데이트
          if (authStore.user) {
            authStore.user.savingConnected = true;
          }
        }
      } catch (updateError) {
        console.error('assetConnected 업데이트 실패:', updateError);
      }

      // 성공 시 Step5로 이동
      emit('next', {
        ...props.flowData, // Step2, Step3 데이터 유지
        connectionResult: {
          success: true,
          accountName: result.accountName, // 백엔드에서 반환한 계좌명 등
          message: result.message,
        },
      });
    } else {
      // 백엔드에서 success: false로 응답한 경우
      emit('next', {
        ...props.flowData,
        connectionResult: {
          success: false,
          error: result?.message || '계좌 연결에 실패했습니다.',
        },
      });
    }
  } catch (error) {
    console.error('계좌 연결 실패:', error);

    statusMessage.value = '연결 실패 처리 중...';
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 실패 시에도 Step5로 이동하되 에러 정보 전달
    emit('next', {
      ...props.flowData, // Step2, Step3 데이터 유지
      connectionResult: {
        success: false,
        error: error.message || '계좌 연결에 실패했습니다.',
      },
    });
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
