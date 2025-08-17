import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '@/utils/api';

// 캐시 지속 시간 설정
const CACHE_DURATION = {
  mainAccount: 8 * 60 * 1000,    // 8분 (백엔드 스케줄러 10분보다 짧게)
  subAccount: Infinity           // 영구 (챌린지 완료시에만 무효화)
};

export const useAccountStore = defineStore('account', () => {
  // 상태 정의
  const accountType = ref(null); // 'main' | 'sub' | null
  const isAccountChangeFlow = ref(false); // 계좌 변경 플로우인지 여부
  const accounts = ref(null); // 전체 계좌 정보 { mainAccount, subAccount }
  const lastFetched = ref(null); // 마지막 API 호출 시간
  const isLoading = ref(false); // 로딩 상태

  // 액션들
  const setAccount = (type, isChanging = false) => {
    accountType.value = type;
    isAccountChangeFlow.value = isChanging;
  };

  const clearAccountType = () => {
    accountType.value = null;
    isAccountChangeFlow.value = false;
  };

  // 캐시 유효성 확인
  const isValidCache = () => {
    if (!accounts.value || !lastFetched.value) return false;
    
    const elapsed = Date.now() - lastFetched.value;
    
    // mainAccount는 시간 기반 캐시 확인
    if (elapsed > CACHE_DURATION.mainAccount) {
      return false;
    }
    
    // subAccount는 영구 캐시 (별도 무효화 시에만)
    return true;
  };

  const fetchAccounts = async () => {
    // 캐시 유효성 확인
    if (accounts.value && isValidCache()) {
      return accounts.value;
    }

    // API 호출
    isLoading.value = true;
    try {
      const response = await authAPI.getMyPageAccounts();
      
      accounts.value = response;
      lastFetched.value = Date.now();
      
      return response;
    } catch (error) {
      console.error('Account Store - API 호출 실패:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 메인 계좌만 업데이트 (서브 계좌는 보존)
  const fetchMainAccountOnly = async () => {
    isLoading.value = true;
    try {
      const response = await authAPI.getMyPageAccounts();
      
      if (accounts.value) {
        // 기존 subAccount는 유지하고 mainAccount만 업데이트
        accounts.value.mainAccount = response.mainAccount;
      } else {
        // 캐시가 없으면 전체 데이터 저장
        accounts.value = response;
      }
      
      lastFetched.value = Date.now();
      return accounts.value;
    } catch (error) {
      console.error('Account Store - 메인 계좌 API 호출 실패:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 특정 계좌만 캐시 무효화
  const invalidateMainAccount = () => {
    lastFetched.value = 0;
  };

  const invalidateSubAccount = () => {
    if (accounts.value) {
      accounts.value.subAccount = null;
    }
  };

  // 전체 캐시 무효화
  const invalidateAll = () => {
    accounts.value = null;
    lastFetched.value = null;
  };

  // Computed getters
  const isMainAccount = computed(() => accountType.value === 'main');
  const isSavingsAccount = computed(() => accountType.value === 'sub');
  const isChanging = computed(() => isAccountChangeFlow.value);
  const mainAccount = computed(() => accounts.value?.mainAccount || null);
  const subAccount = computed(() => accounts.value?.subAccount || null);
  const hasCache = computed(() => !!accounts.value);

  return {
    // State
    accountType,
    isAccountChangeFlow,
    accounts,
    lastFetched,
    isLoading,
    
    // Actions
    setAccount,
    clearAccountType,
    fetchAccounts,
    fetchMainAccountOnly,
    invalidateMainAccount,
    invalidateSubAccount,
    invalidateAll,
    
    // Getters
    isMainAccount,
    isSavingsAccount,
    isChanging,
    mainAccount,
    subAccount,
    hasCache,
  };
});
