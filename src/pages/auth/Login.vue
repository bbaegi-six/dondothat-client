<template>
  <div class="main-content">
    <!-- 로고 -->
    <div class="logo-section">
      <div class="money-icon">💰</div>
      <h1 class="app-title">
        Don do<br />
        that
      </h1>
    </div>

    <!-- 로그인 폼 -->
    <div class="form-section">
      <div class="input-group">
        <input
          v-model="email"
          type="email"
          placeholder="이메일을 입력하세요"
          class="form-input"
        />
      </div>

      <div class="input-group">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="비밀번호를 입력하세요"
          class="form-input"
        />
        <button @click="togglePassword" class="password-toggle" type="button">
          <svg
            v-if="showPassword"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            width="20"
            height="20"
          >
            <path
              d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L504.5 470.8C507.2 468.4 509.9 466 512.5 463.6C559.3 420.1 590.6 368.2 605.5 332.5C608.8 324.6 608.8 315.8 605.5 307.9C590.6 272.2 559.3 220.2 512.5 176.8C465.4 133.1 400.7 96.2 319.9 96.2C263.1 96.2 214.3 114.4 173.9 140.4L73 39.1zM236.5 202.7C260 185.9 288.9 176 320 176C399.5 176 464 240.5 464 320C464 351.1 454.1 379.9 437.3 403.5L402.6 368.8C415.3 347.4 419.6 321.1 412.7 295.1C399 243.9 346.3 213.5 295.1 227.2C286.5 229.5 278.4 232.9 271.1 237.2L236.4 202.5zM357.3 459.1C345.4 462.3 332.9 464 320 464C240.5 464 176 399.5 176 320C176 307.1 177.7 294.6 180.9 282.7L101.4 203.2C68.8 240 46.4 279 34.5 307.7C31.2 315.6 31.2 324.4 34.5 332.3C49.4 368 80.7 420 127.5 463.4C174.6 507.1 239.3 544 320.1 544C357.4 544 391.3 536.1 421.6 523.4L357.4 459.2z"
              fill="#A1A1A1"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            width="20"
            height="20"
          >
            <path
              d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z"
              fill="#A1A1A1"
            />
          </svg>
        </button>
      </div>

      <button
        @click="handleLogin"
        class="login-button"
        :disabled="!email || !password"
      >
        로그인
      </button>

      <!-- 간편 로그인 -->
      <div class="divider">
        <span>간편 로그인</span>
      </div>

      <div class="social-login">
        <button @click="handleKakaoLogin" class="kakao-btn">
          <div class="kakao-icon">K</div>
        </button>
        <button @click="handleGoogleLogin" class="google-btn">
          <div class="google-icon">G</div>
        </button>
      </div>

      <!-- 하단 링크 -->
      <div class="bottom-links">
        <router-link to="/register" class="link-btn">회원 가입</router-link>
        <router-link to="/forgot-password" class="link-btn">
          아이디 / 비밀번호 찾기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// 반응형 데이터
const email = ref('');
const password = ref('');
const showPassword = ref(false);

// 메서드들
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('이메일과 비밀번호를 입력해주세요.');
    return;
  }

  const success = await authStore.login(email.value, password.value);

  if (success) {
    router.push('/');
  } else {
    alert('로그인에 실패했습니다.');
  }
};

const handleKakaoLogin = () => {
  console.log('카카오 로그인');
  // 카카오 로그인 로직
};

const handleGoogleLogin = () => {
  console.log('구글 로그인');
  // 구글 로그인 로직
};
</script>

<style scoped>
/* 메인 콘텐츠 */
.main-content {
  flex: 1;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 로고 섹션 */
.logo-section {
  text-align: center;
  margin: 20px 0 40px;
}

.money-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.app-title {
  font-family: 'Anton SC', sans-serif;
  font-size: 24px;
  color: #ff5555;
  line-height: 22px;
  margin: 0;
  font-weight: 400;
}

/* 폼 섹션 */
.form-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input-group {
  position: relative;
  margin-bottom: 24px;
}

.form-input {
  width: 328px;
  height: 48px;
  background-color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #a1a1a1;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ff5555;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.login-button {
  width: 328px;
  height: 56px;
  background-color: #ff5555;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 24px;
  font-family: 'Pretendard', sans-serif;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #e64545;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 간편 로그인 */
.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
  color: #c9c9c9;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 120px;
  height: 1px;
  background-color: #c9c9c9;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: #2f2f2f;
  padding: 0 16px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 40px;
}

.kakao-btn,
.google-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: transform 0.2s;
}

.kakao-btn {
  background-color: #fee500;
  color: #000;
}

.google-btn {
  background-color: white;
  color: #333;
  border: 1px solid #dbdbdb;
}

.kakao-btn:hover,
.google-btn:hover {
  transform: scale(1.05);
}

/* 하단 링크 */
.bottom-links {
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
}

.link-btn {
  background: none;
  border: none;
  color: #c9c9c9;
  font-size: 14px;
  cursor: pointer;
  font-family: 'Pretendard', sans-serif;
  text-decoration: none;
}

.link-btn:hover {
  color: #ff5555;
}
</style>
