import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    accountType: null, // 'main' | 'sub' | null
    isAccountChangeFlow: false, // 계좌 변경 플로우인지 여부
  }),

  actions: {
    setAccount(type, isChanging = false) {
      this.accountType = type;
      this.isAccountChangeFlow = isChanging; // 변경 여부는 상황에 따라
      console.log('Account Store - 타입 설정:', type);
    },

    clearAccountType() {
      this.accountType = null;
      this.isAccountChangeFlow = false;
    },
  },

  getters: {
    isMainAccount: (state) => state.accountType === 'main',
    isSavingsAccount: (state) => state.accountType === 'sub',
    isChanging: (state) => state.isAccountChangeFlow,
  },
});
