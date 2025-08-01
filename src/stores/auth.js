import { defineStore } from 'pinia';
import { authAPI } from '../utils/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('token'),
    user: null, // 사용자 정보는 필요 시 토큰에서 디코딩하여 가져올 수 있습니다.
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },
  actions: {
    async setToken(token) {
      this.loading = true;
      this.error = null;
      try {
        localStorage.setItem('token', token);
        this.isAuthenticated = true;

        // 사용자 정보 가져오기
        const userData = await authAPI.fetchMe();
        this.user = userData;
      } catch (error) {
        this.error = error;
        // 토큰 설정 실패 시 인증 상태 롤백
        this.isAuthenticated = false;
        localStorage.removeItem('token');
      } finally {
        this.loading = false;
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.user = null;
    },
    checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated = true;
        // 필요하다면 토큰을 디코딩하여 사용자 정보를 설정할 수 있습니다.
      }
    },
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        // 실제 백엔드 API와 연동해야 합니다.
        // 이 부분은 소셜 로그인과 별개이므로 임시로 남겨둡니다.
        console.log('일반 로그인 시도:', email);
        // const response = await api.post('/login', { email, password });
        // this.setToken(response.data.token);
        return true; // 임시 반환
      } catch (error) {
        this.error = error;
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
