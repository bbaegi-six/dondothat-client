import { defineStore } from 'pinia';
import { authAPI } from '@/utils/api';

// 캐시 지속 시간 설정
const CACHE_DURATION = {
  mainAccount: 8 * 60 * 1000,    // 8분 (백엔드 스케줄러 10분보다 짧게)
  subAccount: Infinity           // 영구 (챌린지 완료시에만 무효화)
};

export const useAccountStore = defineStore('account', {
  state: () => ({
    // 기존 상태
    accountType: null, // 'main' | 'sub' | null
    isAccountChangeFlow: false, // 계좌 변경 플로우인지 여부
    
    // 새로운 캐싱 상태
    accounts: null, // 전체 계좌 정보 { mainAccount, subAccount }
    lastFetched: null, // 마지막 API 호출 시간
    isLoading: false, // 로딩 상태
  }),

  actions: {
    // 기존 액션들
    setAccount(type, isChanging = false) {
      this.accountType = type;
      this.isAccountChangeFlow = isChanging;
      console.log('Account Store - 타입 설정:', type);
    },

    clearAccountType() {
      this.accountType = null;
      this.isAccountChangeFlow = false;
    },

    // 새로운 캐싱 액션들
    async fetchAccounts() {
      // 캐시 유효성 확인
      if (this.accounts && this.isValidCache()) {
        return this.accounts;
      }

      // API 호출
      this.isLoading = true;
      try {
        const response = await authAPI.getMyPageAccounts();
        
        this.accounts = response;
        this.lastFetched = Date.now();
        
        return response;
      } catch (error) {
        console.error('Account Store - API 호출 실패:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 메인 계좌만 업데이트 (서브 계좌는 보존)
    async fetchMainAccountOnly() {
      this.isLoading = true;
      try {
        const response = await authAPI.getMyPageAccounts();
        
        if (this.accounts) {
          // 기존 subAccount는 유지하고 mainAccount만 업데이트
          this.accounts.mainAccount = response.mainAccount;
        } else {
          // 캐시가 없으면 전체 데이터 저장
          this.accounts = response;
        }
        
        this.lastFetched = Date.now();
        return this.accounts;
      } catch (error) {
        console.error('Account Store - 메인 계좌 API 호출 실패:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // 캐시 유효성 확인
    isValidCache() {
      if (!this.accounts || !this.lastFetched) return false;
      
      const elapsed = Date.now() - this.lastFetched;
      
      // mainAccount는 시간 기반 캐시 확인
      if (elapsed > CACHE_DURATION.mainAccount) {
        console.log('Account Store - mainAccount 캐시 만료');
        return false;
      }
      
      // subAccount는 영구 캐시 (별도 무효화 시에만)
      return true;
    },

    // 특정 계좌만 캐시 무효화
    invalidateMainAccount() {
      this.lastFetched = 0;
    },

    invalidateSubAccount() {
      if (this.accounts) {
        this.accounts.subAccount = null;
      }
    },

    // 전체 캐시 무효화
    invalidateAll() {
      this.accounts = null;
      this.lastFetched = null;
    },
  },

  getters: {
    // 기존 getters
    isMainAccount: (state) => state.accountType === 'main',
    isSavingsAccount: (state) => state.accountType === 'sub',
    isChanging: (state) => state.isAccountChangeFlow,

    // 새로운 getters
    mainAccount: (state) => state.accounts?.mainAccount || null,
    subAccount: (state) => state.accounts?.subAccount || null,
    hasCache: (state) => !!state.accounts,
  },
});
