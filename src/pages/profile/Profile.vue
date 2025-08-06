<template>
  <Header title="마이페이지"></Header>
  <div class="page-container">
    <div class="info">
      <div class="flex">
        <p class="font-semibold" style="font-size: 20px">{{ nickname }} 님</p>
        <button class="px-2" @click="router.push('/profile/edit')">
          <i class="fa-solid fa-pencil"></i>
        </button>
      </div>
      <p class="font-light" style="font-size: 10px">
        {{ email }}
      </p>
    </div>
    <div class="badges">
      <Typography text="획득한 뱃지 목록" padding="8px" />
      <div class="badge-list">
        <Square
          v-for="(badge, index) in badges"
          :key="index"
          :image="badge.image"
        />
      </div>
    </div>
    <div class="account1">
      <Typography text="연결된 계좌" padding="8px" />
      <AccountCard
        v-if="accounts.length > 0"
        :imgSrc="accounts[0].imageUrl"
        :accountName="accounts[0].name"
        :amount="accounts[0].balance"
        @change="handleChange"
      />
    </div>
    <div class="account2">
      <Typography text="저금통 계좌" padding="8px" />
      <AccountCard
        v-if="accounts.length > 1"
        :imgSrc="accounts[1].imageUrl"
        :accountName="accounts[1].name"
        :amount="accounts[1].balance"
        @change="handleChange"
      />
    </div>
    <ConfirmModal
      v-if="showModal"
      @close="showModal = false"
      @confirm="handleConfirm"
    ></ConfirmModal>
    <div class="menu">
      <button @click="router.push('/profile/mychallenge')">
        <Typography text="챌린지 목록" padding="12px"></Typography>
      </button>
      <button>
        <Typography text="비밀번호 변경" padding="12px"></Typography>
      </button>
      <button @click="router.push('/profile/terms')">
        <Typography text="서비스 이용 약관" padding="12px"></Typography>
      </button>
      <button @click="router.push('/profile/policy')">
        <Typography text="개인정보 처리 방침" padding="12px"></Typography>
      </button>
      <button @click="logout">
        <Typography text="로그아웃" padding="12px"></Typography>
      </button>
      <button><Typography text="탈퇴하기" padding="12px"></Typography></button>
    </div>
  </div>
</template>

<script setup>
import Header from '../../components/layout/Header.vue';
import Square from '../../components/Square.vue';
import Typography from '../../components/profile/Typography.vue';
import AccountCard from '../../components/profile/AccountCard.vue';
import ConfirmModal from './ConfirmModal.vue';

// import { onMounted } from "vue";
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth'; // auth 스토어 임포트
import { useRouter } from 'vue-router';

// 이미지 임포트
import kbLogo from '@/assets/logo/kb.svg';
import eatBadge from '@/assets/badge/eat.svg';

const authStore = useAuthStore(); // auth 스토어 사용
const { user } = storeToRefs(authStore); // auth 스토어에서 user 정보 가져오기

const router = useRouter();
const showModal = ref(false);

// user.value에서 직접 닉네임과 이메일 가져오기
const nickname = user.value?.nickname || '게스트';
const email = user.value?.email || 'guest@example.com';

// accounts와 badges는 userStore에서 가져오지 않으므로 임시 데이터 유지
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

function handleChange() {
  showModal.value = true; // 모달 띄우기
}

function handleConfirm() {
  showModal.value = false;
  router.push('/account'); // 원하는 경로로 변경
}

async function logout() {
  await authStore.logout(); // auth 스토어의 logout 액션 호출
  router.push('/login');
}
</script>

<style scoped>
* {
  color: #ffffff;
}
.page-container {
  padding: 31px;
  padding-top: 86px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.badge-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 한 줄에 3개씩 */
  gap: 8px; /* 아이템 간격 */
  justify-items: center; /* 아이템 가운데 정렬 */
}
.menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
