<template>
  <div class="pt-[60px] px-6">
    <Header :showBack="true" title="회원가입" />
    <div class="flex flex-col gap-6 py-6">
      <Input v-model="name" placeholder="이름" />
      <InputWithButton
        v-model="nickname"
        placeholder="닉네임"
        button-label="중복확인"
        @buttonClick="handleNicknameCheck"
      />
      <Input v-model="password" type="password" placeholder="비밀번호" />
      <Input
        v-model="confirmPassword"
        type="password"
        placeholder="비밀번호 확인"
      />
      <InputWithButton
        v-model="email"
        placeholder="이메일"
        button-label="전송"
        @buttonClick="handleEmailSend"
      />
      <Input v-model="verificationCode" placeholder="인증코드" />

      <div class="flex flex-col gap-3">
        <label class="flex items-center gap-2 text-white text-sm">
          <input type="checkbox" v-model="agreeTerms" class="w-4 h-4 accent-primary-red" />
          <span>이용약관 동의 (필수)</span>
        </label>
        <label class="flex items-center gap-2 text-white text-sm">
          <input type="checkbox" v-model="agreePrivacy" class="w-4 h-4 accent-primary-red" />
          <span>개인정보처리방침 동의 (필수)</span>
        </label>
        <label class="flex items-center gap-2 text-white text-sm">
          <input type="checkbox" v-model="agreeMarketing" class="w-4 h-4 accent-primary-red" />
          <span>마케팅 정보 수신 동의 (선택)</span>
        </label>
      </div>

      <Button @click="handleNext" label="다음" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from "../../components/layout/Header.vue";
import Input from "../../components/Input.vue";
import InputWithButton from "../../components/InputWithButton.vue";
import Button from "../../components/Button.vue";

const name = ref('');
const nickname = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const verificationCode = ref('');
const agreeTerms = ref(false);
const agreePrivacy = ref(false);
const agreeMarketing = ref(false);

const handleNicknameCheck = () => {
  console.log('닉네임 중복확인', nickname.value);
  // 닉네임 중복확인 로직
};

const handleEmailSend = () => {
  console.log('이메일 인증코드 전송', email.value);
  // 이메일 인증코드 전송 로직
};

const handleNext = () => {
  console.log('다음 버튼 클릭');
  // 다음 단계 로직
};
</script>

<style scoped>
</style>
