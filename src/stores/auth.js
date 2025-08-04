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
    async checkAuth(forceFetch = false) {
      console.log('checkAuth: Starting...', { forceFetch, isAuthenticated: this.isAuthenticated, userExists: !!this.user });
      if (!forceFetch && this.isAuthenticated && this.user) {
        console.log('checkAuth: Already authenticated and user data exists. Skipping /me call.');
        return; // 이미 인증되었고 사용자 정보가 있으면 중복 호출 방지
      }
      this.loading = true;
      this.error = null;
      try {
        console.log('checkAuth: Calling authAPI.fetchMe()...');
        const userData = await authAPI.fetchMe();
        this.user = userData;
        this.isAuthenticated = true;
        console.log('checkAuth: /me call successful. User data:', userData);
      } catch (error) {
        console.error('checkAuth: /me call failed.', error);
        this.error = error;
        this.isAuthenticated = false;
        this.user = null;
      } finally {
        this.loading = false;
        console.log('checkAuth: Finished.');
      }
    },
    async login(email, password) {
      console.log('login: Starting for email:', email);
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.login({ email, password });
        console.log('login: authAPI.login successful. Response:', response);
        // 로그인 성공 시 fetchMe를 호출하여 사용자 정보 및 인증 상태 업데이트 (강제 호출)
        await this.checkAuth(true);
        console.log('login: checkAuth completed.');
        return true;
      } catch (error) {
        console.error('login: authAPI.login failed.', error);
        this.error = error;
        this.isAuthenticated = false;
        this.user = null;
        return false;
      } finally {
        this.loading = false;
        console.log('login: Finished.');
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
