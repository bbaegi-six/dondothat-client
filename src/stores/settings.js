import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
  // 스토어 ID (예: 'auth', 'transactions')

  state: () => ({
    // 이곳에 상태(데이터)를 정의합니다.
    // 예: user: null,
    // 예: items: [],
    loading: false,
    error: null
  }),

  getters: {
    // 이곳에 state를 기반으로 한 계산된 값을 정의합니다.
    // 예: isLoggedIn: (state) => !!state.user,
  },

  actions: {
    // 이곳에 상태를 변경하는 함수(메서드)를 정의합니다.
    // 비동기 로직이나 API 호출 등을 처리합니다.
    // 예: async function fetchData() {
    //   this.loading = true;
    //   try {
    //     // API 호출
    //   } catch (error) {
    //     this.error = error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
  }
})
