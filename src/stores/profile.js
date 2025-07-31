// /stores/useUserStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
//import axios from "axios";

import kbLogo from '@/assets/logo/kb.svg';
import eatBadge from '@/assets/badge/eat.svg';

export const useUserStore = defineStore('user', () => {
  const nickname = ref('홍길동');
  const email = ref('hong@example.com');
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
  const badges = ref([
    { image: eatBadge },
    { image: eatBadge },
    { image: eatBadge },
    { image: eatBadge },
    { image: eatBadge },
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

  function setNickname(newNickname) {
    nickname.value = newNickname;
  }

  function resetStore() {
    nickname.value = '';
    email.value = '';
    accounts.value = [];
    badges.value = [];
    successChallenges.value = [];
    failedChallenges.value = [];
  }

  return {
    nickname,
    email,
    accounts,
    badges,
    successChallenges,
    failedChallenges,
    resetStore,
    setNickname,
  };
});
