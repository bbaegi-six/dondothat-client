<template>
  <div class="pt-[60px] px-6">
    <Header :showBack="true" title="회원가입" />
    <div class="flex flex-col gap-6 py-6">
      <div>
        <Input v-model="name" placeholder="이름" />
        <div class="h-1">
          <span
            :class="{
              'text-primary-red text-xs mt-1': showErrors && !name,
              invisible: !(showErrors && !name),
            }"
          >
            * 필수 항목입니다
          </span>
        </div>
      </div>

      <div>
        <InputWithButton
          v-model="nickname"
          placeholder="닉네임"
          button-label="중복확인"
          @buttonClick="handleNicknameCheck"
        />
        <div class="h-1">
          <span
            v-if="showErrors && !nickname"
            class="text-primary-red text-xs mt-1"
          >
            * 필수 항목입니다
          </span>
          <span
            v-else-if="nicknameAvailable"
            class="text-xs mt-1"
            :style="{ color: '#C9C9C9' }"
          >
            * 사용 가능한 닉네임입니다.
          </span>
        </div>
      </div>

      <div>
        <Input v-model="password" type="password" placeholder="비밀번호" />
        <div class="h-1">
          <span
            v-if="showErrors && !password"
            class="text-primary-red text-xs mt-1"
          >
            * 필수 항목입니다
          </span>
          <span v-else-if="passwordError" class="text-primary-red text-xs mt-1">
            {{ passwordError }}
          </span>
        </div>
      </div>

      <div>
        <Input
          v-model="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
        />
        <div class="h-1">
          <span
            v-if="showErrors && !confirmPassword"
            class="text-primary-red text-xs mt-1"
          >
            * 필수 항목입니다
          </span>
          <span
            v-else-if="confirmPasswordError"
            class="text-primary-red text-xs mt-1"
          >
            {{ confirmPasswordError }}
          </span>
        </div>
      </div>

      <div>
        <InputWithButton
          v-model="email"
          placeholder="이메일"
          button-label="전송"
          @buttonClick="handleEmailSend"
        />
        <div class="h-1">
          <span
            v-if="showErrors && !email"
            class="text-primary-red text-xs mt-1"
          >
            * 필수 항목입니다
          </span>
          <span
            v-else-if="showEmailError && emailError"
            class="text-primary-red text-xs mt-1"
          >
            {{ emailError }}
          </span>
        </div>
      </div>

      <div>
        <Input v-model="verificationCode" placeholder="인증코드" />
        <div class="h-16">
          <span
            :class="{
              'text-primary-red text-xs mt-1': showErrors && !verificationCode,
              invisible: !(showErrors && !verificationCode),
            }"
          >
            * 필수 항목입니다
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <label class="flex items-center gap-2 text-white text-sm">
          <input
            type="checkbox"
            v-model="agreeTerms"
            class="w-4 h-4 accent-primary-red"
          />
          <span>이용약관 동의 (필수)</span>
          <span
            :class="{
              'text-primary-red text-xs mt-1': showErrors && !agreeTerms,
              invisible: !(showErrors && !agreeTerms),
            }"
          >
            * 필수 항목입니다
          </span>
        </label>
        <label class="flex items-center gap-2 text-white text-sm">
          <input
            type="checkbox"
            v-model="agreePrivacy"
            class="w-4 h-4 accent-primary-red"
          />
          <span>개인정보처리방침 동의 (필수)</span>
          <span
            :class="{
              'text-primary-red text-xs mt-1': showErrors && !agreePrivacy,
              invisible: !(showErrors && !agreePrivacy),
            }"
          >
            * 필수 항목입니다
          </span>
        </label>
        <label class="flex items-center gap-2 text-white text-sm">
          <input
            type="checkbox"
            v-model="agreeMarketing"
            class="w-4 h-4 accent-primary-red"
          />
          <span>마케팅 정보 수신 동의 (선택)</span>
        </label>
      </div>

      <Button @click="handleNext" label="다음" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Header from '../../components/layout/Header.vue';
import Input from '../../components/Input.vue';
import InputWithButton from '../../components/InputWithButton.vue';
import Button from '../../components/Button.vue';

const name = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const verificationCode = ref('');
const agreeTerms = ref(false);
const agreePrivacy = ref(false);
const agreeMarketing = ref(false);
const showErrors = ref(false);
const showEmailError = ref(false);
const nicknameAvailable = ref(false);

const passwordError = ref('');
const confirmPasswordError = ref('');
const emailError = ref('');

const validatePassword = () => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
  if (password.value && !passwordRegex.test(password.value)) {
    passwordError.value = '* 8~30자리 영대·소문자, 숫자, 특수문자 조합';
  } else {
    passwordError.value = '';
  }
};

const validateConfirmPassword = () => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = '* 비밀번호가 일치하지 않습니다.';
  } else {
    confirmPasswordError.value = '';
  }
};

const validateEmail = () => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (email.value && !emailRegex.test(email.value)) {
    emailError.value = '* 올바른 이메일 양식을 입력해주세요.';
  } else {
    emailError.value = '';
  }
};

watch(password, () => {
  validatePassword();
  validateConfirmPassword();
});

watch(confirmPassword, validateConfirmPassword);

watch(email, () => {
  if (showEmailError.value) {
    showEmailError.value = false;
  }
});

const handleNicknameCheck = () => {
  // In a real application, you would make an API call to check for nickname availability.
  // For this example, we'll just simulate a successful check.
  if (nickname.value) {
    nicknameAvailable.value = true;
  }
};

const handleEmailSend = () => {
  showEmailError.value = true;
  validateEmail();
  if (!emailError.value && email.value) {
    console.log('이메일 인증코드 전송', email.value);
  }
};

const handleNext = () => {
  showErrors.value = true;
  showEmailError.value = true;
  validatePassword();
  validateConfirmPassword();
  validateEmail();

  if (
    !name.value ||
    !nickname.value ||
    !password.value ||
    !confirmPassword.value ||
    !email.value ||
    !verificationCode.value ||
    passwordError.value ||
    confirmPasswordError.value ||
    emailError.value ||
    !agreeTerms.value ||
    !agreePrivacy.value
  ) {
    return;
  }

  console.log('다음 버튼 클릭 - 모든 값 입력됨');
};
</script>
