<template>
  <div class="pt-[60px] px-6">
    <Header :showBack="true" title="회원가입" />
    <div class="flex flex-col gap-6 py-6">
      <div>
        <Input v-model="name" placeholder="이름" />
        <div class="h-1">
          <span
            :class="
              showErrors && !name
                ? 'text-primary-red text-xs mt-1'
                : 'invisible'
            "
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
            :class="
              showErrors && !nickname
                ? 'text-primary-red text-xs mt-1'
                : 'invisible'
            "
          >
            * 필수 항목입니다
          </span>
        </div>
      </div>

      <div>
        <Input v-model="password" type="password" placeholder="비밀번호" />
        <div class="h-1">
          <span
            :class="
              showErrors && !password
                ? 'text-primary-red text-xs mt-1'
                : 'invisible'
            "
          >
            * 필수 항목입니다
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
            :class="
              showErrors && !confirmPassword
                ? 'text-primary-red text-xs mt-1'
                : 'invisible'
            "
          >
            * 필수 항목입니다
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
            :class="
              showErrors && !email
                ? 'text-primary-red text-xs mt-1'
                : 'invisible'
            "
          >
            * 필수 항목입니다
          </span>
        </div>
      </div>

      <div>
        <Input v-model="verificationCode" placeholder="인증코드" />
        <div class="h-16">
          <span
            :class="
              showErrors && !verificationCode
                ? 'text-primary-red text-xs mt-1'
                : 'invisible'
            "
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
          <div>
            <span>이용약관 동의 (필수)</span>
            <span
              :class="
                showErrors && !agreeTerms
                  ? 'text-primary-red text-xs mt-1'
                  : 'invisible'
              "
            >
              * 필수 항목입니다
            </span>
          </div>
        </label>
        <label class="flex items-center gap-2 text-white text-sm">
          <input
            type="checkbox"
            v-model="agreePrivacy"
            class="w-4 h-4 accent-primary-red"
          />
          <span>개인정보처리방침 동의 (필수)</span>
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
import { ref } from "vue";
import Header from "../../components/layout/Header.vue";
import Input from "../../components/Input.vue";
import InputWithButton from "../../components/InputWithButton.vue";
import Button from "../../components/Button.vue";

const name = ref("");
const nickname = ref("");
const password = ref("");
const confirmPassword = ref("");
const email = ref("");
const verificationCode = ref("");
const agreeTerms = ref(false);
const agreePrivacy = ref(false);
const agreeMarketing = ref(false);
const showErrors = ref(false); // 빨간 문구 표시 여부

// 에러 메시지 표시 여부
const showError = ref(false);

const handleNicknameCheck = () => {
  console.log("닉네임 중복확인", nickname.value);
};

const handleEmailSend = () => {
  console.log("이메일 인증코드 전송", email.value);
};

const handleNext = () => {
  showErrors.value = true; // 버튼 눌렀을 때만 에러 표시 시작
  // 유효성 검사
  if (
    !name.value ||
    !nickname.value ||
    !password.value ||
    !confirmPassword.value ||
    !email.value ||
    !verificationCode.value
  ) {
    showError.value = true;
    return;
  }
  if (!agreeTerms.value || !agreePrivacy.value) {
    alert("필수 약관에 동의해주세요.");
    return;
  }

  // 모든 값이 있으면 다음 단계로 진행
  console.log("다음 버튼 클릭 - 모든 값 입력됨");
};
</script>
