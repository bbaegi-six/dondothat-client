import { defineStore } from 'pinia';
import { authAPI } from '../utils/api';
import { useExpensesStore } from './expenses'; // expenses 스토어 import
import { useAccountStore } from './account'; // account 스토어 import
import { useChallengeStore } from './challenge'; // challenge 스토어 import
import { expensesService } from '../services/expensesService'; // expenses 서비스 import

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
      if (!forceFetch && this.isAuthenticated && this.user) {
        return; // 이미 인증되었고 사용자 정보가 있으면 중복 호출 방지
      }
      this.loading = true;
      this.error = null;
      try {
        const userData = await authAPI.fetchMe();
        this.user = userData;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('checkAuth: /me call failed.', error);
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
        // 로그인 성공 시 fetchMe를 호출하여 사용자 정보 및 인증 상태 업데이트 (강제 호출)
        await this.checkAuth(true);

        // 로그인 성공 후 핵심 데이터 미리 로드
        if (this.isAuthenticated) {
          const expensesStore = useExpensesStore();
          const accountStore = useAccountStore();
          const challengeStore = useChallengeStore();

          // 핵심 데이터를 병렬로 미리 로드
          const preloadResults = await Promise.allSettled([
            expensesStore.fetchExpensesFromAPI(),        // 거래내역 (차트 데이터도 이것으로 계산됨)
            accountStore.fetchAccounts(),                // 계좌 정보
            challengeStore.fetchChallengeProgress()      // 챌린지 진행상황
          ]);
          
          // 실패한 항목만 경고 로그 출력
          const [expensesResult, accountResult, challengeResult] = preloadResults;
          
          if (expensesResult.status === 'rejected') {
            console.warn('거래내역 미리 로드 실패:', expensesResult.reason);
          }
          if (accountResult.status === 'rejected') {
            console.warn('계좌 정보 미리 로드 실패:', accountResult.reason);
          }
          if (challengeResult.status === 'rejected') {
            console.warn('챌린지 정보 미리 로드 실패:', challengeResult.reason);
          }
        }

        return true;
      } catch (error) {
        console.error('login: authAPI.login failed.', error);
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
