<template>
  <div class="pt-[60px]">
    <div class="mx-auto w-[328px]">
      <!-- This div centers the entire content block and sets its width -->
      <Header :showBack="true" title="회원가입" />
      <hr class="border-t border-[#414141]" />
      <div class="flex flex-col gap-6 py-6">
        <!-- This div aligns its children -->
        <div class="w-[328px] mx-auto">
          <Input v-model="name" placeholder="이름" class="w-full" />
          <div class="h-1">
            <span
              :class="{
                'text-brand text-xs mt-1': showErrors && !name,
                invisible: !(showErrors && !name),
              }"
            >
              * 필수 항목입니다
            </span>
          </div>
        </div>

        <div class="w-[328px] mx-auto">
          <Input v-model="nickname" placeholder="닉네임" class="w-full" />
          <div class="h-1">
            <span
              :class="{
                'text-brand text-xs mt-1': showErrors && !nickname,
                invisible: !(showErrors && !nickname),
              }"
            >
              * 필수 항목입니다
            </span>
          </div>
        </div>

        <div class="w-[328px] mx-auto">
          <Input
            v-model="password"
            type="password"
            placeholder="비밀번호"
            class="w-full"
          />
          <div class="h-1">
            <span
              v-if="showErrors && !password"
              class="text-brand text-xs mt-1"
            >
              * 필수 항목입니다
            </span>
            <span v-else-if="passwordError" class="text-brand text-xs mt-1">
              {{ passwordError }}
            </span>
          </div>
        </div>

        <div class="w-[328px] mx-auto">
          <Input
            v-model="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            class="w-full"
          />
          <div class="h-1">
            <span
              v-if="showErrors && !confirmPassword"
              class="text-brand text-xs mt-1"
            >
              * 필수 항목입니다
            </span>
            <span
              v-else-if="confirmPasswordError"
              class="text-brand text-xs mt-1"
            >
              {{ confirmPasswordError }}
            </span>
          </div>
        </div>

        <div class="w-[328px] mx-auto">
          <InputWithButton
            v-model="email"
            placeholder="이메일"
            button-label="중복확인"
            @buttonClick="handleEmailCheck"
            class="w-full"
          />
          <div class="h-1">
            <span v-if="showErrors && !email" class="text-brand text-xs mt-1">
              * 필수 항목입니다
            </span>
            <span
              v-else-if="emailAvailable"
              class="text-xs mt-1"
              :style="{ color: '#C9C9C9' }"
            >
              * 사용 가능한 이메일입니다
            </span>
            <span v-else-if="emailDuplicate" class="text-brand text-xs mt-1">
              * 이미 사용중인 이메일입니다
            </span>
            <span
              v-else-if="showEmailCheckError"
              class="text-brand text-xs mt-1"
            >
              * 이메일 중복 확인을 해주세요
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-3 w-[328px] mx-auto pt-12">
          <label
            class="flex items-center justify-between gap-2 text-white text-sm"
          >
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="agreeTerms"
                class="w-4 h-4 accent-primary-red"
              />
              <span>이용약관 동의 (필수)</span>
            </div>
            <span
              :class="{
                'text-brand text-xs': showErrors && !agreeTerms,
                invisible: !(showErrors && !agreeTerms),
              }"
            >
              * 필수 항목입니다
            </span>
          </label>
          <label
            class="flex items-center justify-between gap-2 text-white text-sm"
          >
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="agreePrivacy"
                class="w-4 h-4 accent-primary-red"
              />
              <span>개인정보처리방침 동의 (필수)</span>
            </div>
            <span
              :class="{
                'text-brand text-xs': showErrors && !agreePrivacy,
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

        <div class="w-[328px] mx-auto">
          <Button @click="handleNext" label="다음" class="w-full" :disabled="isSubmitting" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Header from '../../components/layout/Header.vue';
import Input from '../../components/Input.vue';
import InputWithButton from '../../components/InputWithButton.vue';
import Button from '../../components/Button.vue';

import { authAPI } from '../../utils/api.js';

import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const agreeTerms = ref(false);
const agreePrivacy = ref(false);
const agreeMarketing = ref(false);
const showErrors = ref(false);
const isSubmitting = ref(false); // 새로운 상태 변수

const emailAvailable = ref(false);
const emailDuplicate = ref(false);
const showEmailCheckError = ref(false);

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
    confirmPasswordError.value = '* 비밀번호가 일치하지 않습니다';
  } else {
    confirmPasswordError.value = '';
  }
};

const validateEmail = () => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;
  if (email.value && !emailRegex.test(email.value)) {
    emailError.value = '* 올바른 이메일 양식을 입력해주세요';
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
  validateEmail();
  emailAvailable.value = false;
  emailDuplicate.value = false;
  showEmailCheckError.value = false; // 이메일 변경 시 오류 메시지 초기화
});

const handleEmailCheck = async () => {
  if (email.value && !emailError.value) {
    try {
      const isAvailable = await authAPI.checkEmail(email.value);
      if (isAvailable === false) {
        emailAvailable.value = true;
        emailDuplicate.value = false;
        showEmailCheckError.value = false; // 중복 확인 성공 시 오류 메시지 초기화
      } else {
        emailAvailable.value = false;
        emailDuplicate.value = true;
        showEmailCheckError.value = false; // 중복 확인 실패 시 오류 메시지 초기화
      }
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      emailAvailable.value = false;
      emailDuplicate.value = false;
      showEmailCheckError.value = false; // API 호출 실패 시 오류 메시지 초기화
    }
  }
};

const handleNext = async () => {
  showErrors.value = true;
  validatePassword();
  validateConfirmPassword();
  validateEmail();

  if (
    !name.value ||
    !nickname.value ||
    !password.value ||
    !confirmPassword.value ||
    !email.value ||
    passwordError.value ||
    confirmPasswordError.value ||
    emailError.value ||
    !agreeTerms.value ||
    !agreePrivacy.value
  ) {
    return;
  }

  // 이메일 중복 확인 여부 체크
  if (!emailAvailable.value) {
    showEmailCheckError.value = true;
    return;
  }

  if (isSubmitting.value) return; // 이미 제출 중이면 중복 호출 방지
  isSubmitting.value = true; // 제출 시작

  try {
    await authAPI.signUp({
      name: name.value,
      nickname: nickname.value,
      password: password.value,
      email: email.value,
      agreeTerms: agreeTerms.value,
      agreePrivacy: agreePrivacy.value,
      agreeMarketing: agreeMarketing.value,
    });

    // 회원가입 성공 후 자동 로그인 시도
    const loginSuccess = await authStore.login(email.value, password.value);
    if (loginSuccess) {
      router.push('/'); // 로그인 성공 시 홈으로 이동
    } else {
      alert('회원가입은 성공했지만 자동 로그인에 실패했습니다. 직접 로그인해주세요.');
      router.push('/login'); // 자동 로그인 실패 시 로그인 페이지로 이동
    }
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
  } finally {
    isSubmitting.value = false; // 제출 완료 (성공 또는 실패)
  }
};
</script>
