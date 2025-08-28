// /stores/useUserStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth'; // auth 스토어 임포트

import kbLogo from '@/assets/logo/kb.svg';

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore(); // auth 스토어 사용

  const nickname = ref(authStore.user?.nickname || ''); // auth 스토어에서 닉네임 가져오기
  const email = ref(authStore.user?.email || ''); // auth 스토어에서 이메일 가져오기
  const accounts = ref([
    {
      id: 1,
      imageUrl: kbLogo,
      name: 'KB 마이핏 통장',
      balance: 1500000,
    },
    {
      id: 2,
      imageUrl: kbLogo,
      name: '국민 저축 통장',
      balance: 500000,
    },
  ]);
  const successChallenges = ref([
    {
      id: 1,
      name: '카페 금지 챌린지',
      startDate: '2025-05-01',
      endDate: '2025-05-07',
      icon: 'fas fa-coffee',
      category: 'cafe',
    },
    {
      id: 2,
      name: '배달음식 금지 챌린지',
      startDate: '2025-05-01',
      endDate: '2025-05-07',
      icon: 'fas fa-motorcycle',
      category: 'delivery',
    },
  ]);
  const failedChallenges = ref([
    {
      id: 1,
      name: '카페 금지 챌린지',
      startDate: '2025-05-01',
      endDate: '2025-05-07',
      icon: 'fas fa-coffee',
      category: 'cafe',
    },
    {
      id: 2,
      name: '배달음식 금지 챌린지',
      startDate: '2025-05-01',
      endDate: '2025-05-07',
      icon: 'fas fa-motorcycle',
      category: 'delivery',
    },
  ]);

  function resetStore() {
    nickname.value = '';
    email.value = '';
    accounts.value = [];
    successChallenges.value = [];
    failedChallenges.value = [];
    authStore.user = null; // auth 스토어의 사용자 정보도 초기화
    authStore.isAuthenticated = false; // auth 스토어의 인증 상태도 초기화
  }

  return {
    nickname,
    email,
    accounts,
    successChallenges,
    failedChallenges,
    resetStore,
  };
});
