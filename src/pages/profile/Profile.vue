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

    <div class="account1">
      <Typography text="연결된 계좌" padding="8px" />
      <AccountCard
        v-if="mainAccount"
        :imgSrc="getBankLogo(mainAccount.bankName)"
        :accountName="mainAccount.assetName"
        :amount="mainAccount.balance"
        @change="handleChange('main')"
      />
    </div>

    <div class="account2">
      <Typography text="저금통 계좌" padding="8px" />
      <AccountCard
        v-if="subAccount"
        :imgSrc="getBankLogo(subAccount.bankName)"
        :accountName="subAccount.assetName"
        :amount="subAccount.balance"
        @change="handleChange('sub')"
      />
      <div v-else class="no-account">
        <p>연결된 저금통 계좌가 없습니다.</p>
        <button @click="router.push('/account')" class="connect-btn">
          계좌 연결하기
        </button>
      </div>
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
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth'; // auth 스토어 임포트
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/account';
import { accountService } from '@/services/accountService';
import { authAPI } from '../../utils/api';

// 이미지 임포트
import citiLogo from '@/assets/logo/citi.svg';
import cuLogo from '@/assets/logo/cu.svg';
import daeguLogo from '@/assets/logo/daegu.svg';
import hanaLogo from '@/assets/logo/hana.svg';
import ibkLogo from '@/assets/logo/ibk.svg';
import jeonbukLogo from '@/assets/logo/jeonbuk.svg';
import kbLogo from '@/assets/logo/kb.svg';
import kbankLogo from '@/assets/logo/kbank.svg';
import kdbLogo from '@/assets/logo/kdb.svg';
import mgLogo from '@/assets/logo/mg.svg';
import nhLogo from '@/assets/logo/nh.svg';
import postLogo from '@/assets/logo/post.svg';
import scLogo from '@/assets/logo/sc.svg';
import shinhanLogo from '@/assets/logo/shinhan.svg';
import suhyupLogo from '@/assets/logo/suhyup.svg';
import wooriLogo from '@/assets/logo/woori.svg';

const authStore = useAuthStore(); // auth 스토어 사용
const { user } = storeToRefs(authStore); // auth 스토어에서 user 정보 가져오기

const router = useRouter();
const showModal = ref(false);
const accountStore = useAccountStore();

// user.value에서 직접 닉네임과 이메일 가져오기
const nickname = user.value?.nickname || '게스트';
const email = user.value?.email || 'guest@example.com';

// 계좌 정보
const mainAccount = ref(null);
const subAccount = ref(null);

// accounts와 badges는 userStore에서 가져오지 않으므로 임시 데이터 유지
// const accounts = ref([
//   {
//     id: 1,
//     imageUrl: kbLogo,
//     name: 'KB 마이핏 통장',
//     balance: 1500000,
//   },
//   {
//     id: 2,
//     imageUrl: kbLogo,
//     name: '국민 저축 통장',
//     balance: 500000,
//   },
// ]);

// 은행 로고 매핑
const bankLogos = {
  citi: citiLogo,
  cu: cuLogo,
  daegu: daeguLogo,
  hana: hanaLogo,
  ibk: ibkLogo,
  jeonbuk: jeonbukLogo,
  kb: kbLogo,
  kbank: kbankLogo,
  kdb: kdbLogo,
  mg: mgLogo,
  nh: nhLogo,
  post: postLogo,
  sc: scLogo,
  shinhan: shinhanLogo,
  suhyup: suhyupLogo,
  woori: wooriLogo,
};

// 은행 로고 가져오기 함수
function getBankLogo(bankName) {
  console.log('은행명:', bankName); // 디버깅용

  if (!bankName) return kbLogo; // 기본 로고

  // 은행명 매핑 개선
  const bankMapping = {
    국민은행: 'kb',
    국민: 'kb',
    kb: 'kb',
    하나은행: 'hana',
    하나: 'hana',
    신한은행: 'shinhan',
    신한: 'shinhan',
    우리은행: 'woori',
    우리: 'woori',
    // 다른 은행들...
  };

  const bankKey =
    bankMapping[bankName.toLowerCase()] ||
    bankName.toLowerCase().replace(/[^a-z]/g, '');

  const logo = bankLogos[bankKey] || kbLogo;
  console.log('매핑된 로고:', bankKey, logo); // 디버깅용

  return logo;
}

// 금액 포맷팅 함수
function formatAmount(amount) {
  if (!amount && amount !== 0) return '0';
  return amount.toLocaleString();
}

// 계좌 정보 로드
async function loadAssets() {
  try {
    const response = await authAPI.getMyPageAccounts();

    mainAccount.value = response.mainAccount;
    subAccount.value = response.subAccount;

    console.log('메인 계좌:', mainAccount.value);
    console.log('서브 계좌:', subAccount.value);

    // 계좌명 확인
    if (mainAccount.value) {
      console.log('메인 계좌명:', mainAccount.value.assetName);
      console.log('메인 계좌명 타입:', typeof mainAccount.value.assetName);
    }
  } catch (error) {
    console.error('계좌 정보 조회 오류:', error);
  }
}

function handleChange(type) {
  showModal.value = true; // 모달 띄우기
  accountStore.setAccount(type, true); // main or sub
}

async function handleConfirm() {
  showModal.value = false;

  try {
    // 현재 계좌 삭제
    const status = accountStore.isMainAccount ? 'main' : 'sub';
    // ✅ 응답 값을 변수에 저장
    const response = await accountService.deleteAccount(status);

    // ✅ 응답 데이터의 message 필드에 접근하여 출력
    if (response && response.message) {
      console.log('계좌 삭제 메시지:', response.message);
    } else {
      console.log('계좌 삭제 성공'); // message 필드가 없을 경우 기본 메시지
    }

    // 계좌 목록 다시 로드
    await loadAssets();

    // ✅ 삭제 성공하면 계좌 연결 화면으로 이동
    router.push('/account');
  } catch (e) {
    console.error('계좌 삭제 실패', e);
    // 오류 처리 필요 시 모달 또는 alert 표시
    if (e.message) {
      console.error('계좌 삭제 실패 메시지:', e.message);
    }
  }
}
async function logout() {
  await authStore.logout(); // auth 스토어의 logout 액션 호출
  router.push('/login');
}

// 컴포넌트 마운트 시 계좌 정보 로드
onMounted(() => {
  loadAssets();
});
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
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  justify-items: center;
}
.menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.no-account {
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
.connect-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.connect-btn:hover {
  background-color: #0056b3;
}
</style>
