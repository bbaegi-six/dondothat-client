<template>
  <Header title="마이페이지"></Header>
  <div class="page-container">
    <div class="info">
      <div class="info-content">
        <!-- <div class="tier-image">
          <img :src="getTierImage()" alt="티어" />
        </div> -->
        <div class="user-details">
          <div class="flex">
            <p class="font-semibold" style="font-size: 20px">
              {{ nickname }} 님
            </p>
            <button class="px-2" @click="router.push('/profile/edit')">
              <i class="fa-solid fa-pencil"></i>
            </button>
          </div>
          <p class="font-light" style="font-size: 10px">
            {{ email }}
          </p>
        </div>
        <div class="tier-image">
          <img :src="getTierImage()" alt="티어" />
        </div>
      </div>
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
      <div v-else class="no-savings">
        <p>연결된 저금통 계좌가 없습니다.</p>
        <button @click="handleConnectAccount('sub')" class="connect-btn">
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
import { ref, onMounted, computed } from 'vue';
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

// 티어 이미지 임포트
import tier00 from '@/assets/tier/tier_00.png';
import tier01 from '@/assets/tier/tier_01.png';
import tier02 from '@/assets/tier/tier_02.png';
import tier03 from '@/assets/tier/tier_03.png';
import tier04 from '@/assets/tier/tier_04.png';
import tier05 from '@/assets/tier/tier_05.png';
import tier06 from '@/assets/tier/tier_06.png';

const authStore = useAuthStore(); // auth 스토어 사용
const { user } = storeToRefs(authStore); // auth 스토어에서 user 정보 가져오기

const router = useRouter();
const showModal = ref(false);
const accountStore = useAccountStore();

// 사용자 정보 (reactive)
const nickname = computed(() => user.value?.nickname || '게스트');
const email = computed(() => user.value?.email || 'guest@example.com');

// 계좌 정보
const mainAccount = ref(null);
const subAccount = ref(null);

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

  // 은행명 매핑 완성
  const bankMapping = {
    // 국민은행
    국민은행: 'kb',
    국민: 'kb',
    kb: 'kb',
    KB: 'kb',
    국민카드: 'kb',

    // 하나은행
    하나은행: 'hana',
    하나: 'hana',
    hana: 'hana',
    HANA: 'hana',
    하나카드: 'hana',

    // 신한은행
    신한은행: 'shinhan',
    신한: 'shinhan',
    shinhan: 'shinhan',
    SHINHAN: 'shinhan',
    신한카드: 'shinhan',

    // 우리은행
    우리은행: 'woori',
    우리: 'woori',
    woori: 'woori',
    WOORI: 'woori',
    우리카드: 'woori',

    // 농협은행 (NH)
    농협은행: 'nh',
    농협: 'nh',
    nh: 'nh',
    NH: 'nh',
    농협카드: 'nh',
    농협중앙회: 'nh',

    // 기업은행 (IBK)
    기업은행: 'ibk',
    기업: 'ibk',
    ibk: 'ibk',
    IBK: 'ibk',
    IBK기업은행: 'ibk',

    // 산업은행 (KDB)
    산업은행: 'kdb',
    산업: 'kdb',
    kdb: 'kdb',
    KDB: 'kdb',
    KDB산업은행: 'kdb',

    // 씨티은행
    씨티은행: 'citi',
    시티은행: 'citi',
    씨티: 'citi',
    시티: 'citi',
    citi: 'citi',
    CITI: 'citi',
    citibank: 'citi',

    // SC제일은행
    sc은행: 'sc',
    sc제일은행: 'sc',
    SC은행: 'sc',
    SC제일은행: 'sc',
    sc: 'sc',
    SC: 'sc',
    제일은행: 'sc',

    // 새마을금고 (MG)
    새마을금고: 'mg',
    새마을: 'mg',
    mg: 'mg',
    MG: 'mg',
    mg새마을금고: 'mg',

    // 우체국
    우체국: 'post',
    우정사업본부: 'post',
    post: 'post',
    POST: 'post',

    // 수협은행
    수협은행: 'suhyup',
    수협: 'suhyup',
    suhyup: 'suhyup',
    SUHYUP: 'suhyup',
    수협중앙회: 'suhyup',

    // 대구은행
    대구은행: 'daegu',
    대구: 'daegu',
    daegu: 'daegu',
    DAEGU: 'daegu',
    DGB: 'daegu',
    dgb: 'daegu',

    // 전북은행
    전북은행: 'jeonbuk',
    전북: 'jeonbuk',
    jeonbuk: 'jeonbuk',
    JEONBUK: 'jeonbuk',
    JB: 'jeonbuk',
    jb: 'jeonbuk',

    // 케이뱅크
    케이뱅크: 'kbank',
    케이: 'kbank',
    kbank: 'kbank',
    KBANK: 'kbank',
    K뱅크: 'kbank',

    // 부산은행 (Bukyong)
    부산은행: 'bukyong',
    부산: 'bukyong',
    bukyong: 'bukyong',
    BUKYONG: 'bukyong',
    BNK: 'bukyong',
    bnk: 'bukyong',

    // 신협 (CU)
    신협: 'cu',
    신용협동조합: 'cu',
    cu: 'cu',
    CU: 'cu',
  };

  const bankKey =
    bankMapping[bankName.toLowerCase()] ||
    bankName.toLowerCase().replace(/[^a-z]/g, '');

  const logo = bankLogos[bankKey] || kbLogo;
  console.log('매핑된 로고:', bankKey, logo); // 디버깅용

  return logo;
}

// 티어 이미지 매핑
const tierImages = {
  0: tier00,
  1: tier01,
  2: tier02,
  3: tier03,
  4: tier04,
  5: tier05,
  6: tier06,
};

// 티어 이미지 가져오기 함수
function getTierImage() {
  const tierId = user.value?.tier_id;

  // tier_id가 null이면 tier_00 사용
  if (tierId === null || tierId === undefined) {
    return tier00;
  }

  // 해당 tier_id에 맞는 이미지 반환, 없으면 기본값
  return tierImages[tierId] || tier00;
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

// 새로운 저금통 연결 함수
function handleConnectAccount(type) {
  // type을 accountStore에 설정하고 계좌 연결 페이지로 이동
  accountStore.setAccount(type, false); // false = 새로 연결 (변경이 아님)
  router.push('/account');
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

// 사용자 정보 새로고침 함수를 더 강력하게 수정
async function refreshUserInfo() {
  try {
    console.log('사용자 정보 갱신 시작');
    await authStore.checkAuth(true); // 강제로 최신 사용자 정보 갱신
    console.log('갱신된 사용자 정보:', user.value);
  } catch (error) {
    console.error('사용자 정보 갱신 실패:', error);
  }
}

// 컴포넌트 마운트 시 계좌 정보 로드
onMounted(async () => {
  // 사용자 정보를 먼저 갱신
  await refreshUserInfo();
  // 계좌 정보 로드
  await loadAssets();
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
.no-account,
.no-savings {
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 8px 0;
}
.connect-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #ff5555;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.connect-btn:hover {
  background-color: #e04545;
}

.info-content {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tier-image {
  flex-shrink: 0;
}

.tier-image img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.user-details {
  flex: 1;
}
</style>
