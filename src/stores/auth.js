import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        // 백엔드 API 연동 전 임시 로그인 처리
        if (email && password) {
          this.isAuthenticated = true;
          this.user = { email };
          return true;
        } else {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }
      } catch (error) {
        this.error = error;
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});
