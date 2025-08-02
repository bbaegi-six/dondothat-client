import { defineStore } from 'pinia';
import { authAPI } from '../utils/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false, // 초기 상태는 false로 설정
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },
  actions: {
    async checkAuth() {
      this.loading = true;
      this.error = null;
      try {
        const userData = await authAPI.fetchMe();
        this.user = userData;
        this.isAuthenticated = true;
      } catch (error) {
        this.error = error;
        this.isAuthenticated = false;
        this.user = null;
      } finally {
        this.loading = false;
      }
    },
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.login({ email, password });
        // 로그인 성공 시 fetchMe를 호출하여 사용자 정보 및 인증 상태 업데이트
        await this.checkAuth();
        return true;
      } catch (error) {
        this.error = error;
        this.isAuthenticated = false;
        this.user = null;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.loading = true;
      this.error = null;
      try {
        await authAPI.logout();
        // 로그아웃 후 인증 상태 재확인
        await this.checkAuth(); // /me 요청으로 실제 상태 확인
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
