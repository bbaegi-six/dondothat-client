// /stores/useUserStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
//import axios from "axios";

export const useUserStore = defineStore('user', () => {
  const nickname = ref('홍길동');
  const email = ref('hong@example.com');

  const accounts = ref([
    {
      id: 1,
      imageUrl: 'src/assets/logo/kb.svg',
      name: 'KB 마이핏 통장',
      balance: 1500000,
    },
    {
      id: 2,
      imageUrl: 'src/assets/logo/kb.svg',
      name: '국민 저축 통장',
      balance: 500000,
    },
  ]);

  const badges = ref([
    { image: 'src/assets/badge/eat.svg' },
    { image: 'src/assets/badge/eat.svg' },
    { image: 'src/assets/badge/eat.svg' },
    { image: 'src/assets/badge/eat.svg' },
    { image: 'src/assets/badge/eat.svg' },
  ]);

  function setNickname(newNickname) {
    nickname.value = newNickname;
  }

  //   const nickname = ref("");
  //   const email = ref("");
  //   const accounts = ref([]);
  //   const badges = ref([]);

  //   async function fetchUserData() {
  //     try {
  //       const [accountsRes, badgesRes, userRes] = await Promise.all([
  //         fetch("/api/accounts").then((res) => res.json()),
  //         fetch("/api/badges").then((res) => res.json()),
  //         axios.get("/api/user"),
  //       ]);

  //       accounts.value = accountsRes; // [{id, imageUrl, name, balance}, ...]
  //       badges.value = badgesRes; // [{image: 'badge1.svg'}, ...]
  //       nickname.value = userRes.data.nickname;
  //       email.value = userRes.data.email;
  //     } catch (err) {
  //       console.error("데이터 불러오기 실패:", err);
  //     }
  //   }

  function resetStore() {
    nickname.value = '';
    email.value = '';
    accounts.value = [];
    badges.value = [];
  }

  return { nickname, email, accounts, badges, resetStore, setNickname };
});
