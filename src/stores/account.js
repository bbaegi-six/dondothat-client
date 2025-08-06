import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    accountType: null, // 'main' | 'sub' | null
  }),

  actions: {
    setAccountType(type) {
      this.accountType = type;
      console.log('Account Store - 타입 설정:', type);
    },

    clearAccountType() {
      this.accountType = null;
    },
  },

  getters: {
    isMainAccount: (state) => state.accountType === 'main',
    isSavingsAccount: (state) => state.accountType === 'sub',
  },
});
