<template>
  <Header :showBack="true" title="닉네임 변경"></Header>
  <div class="mt-20 mx-auto w-[328px]">
    <!-- 위쪽 내용 -->
    <div>
      <InputWithButton
        v-model="nickname"
        placeholder="닉네임을 입력하세요"
        button-label="중복확인"
        @buttonClick="handleNicknameCheck"
        class="w-full"
      />
      <div class="h-1">
        <span v-if="showErrors && !nickname" class="text-brand text-xs mt-1">
          * 필수 항목입니다
        </span>
        <span
          v-else-if="nicknameAvailable"
          class="text-xs mt-1"
          :style="{ color: '#C9C9C9' }"
        >
          사용 가능한 닉네임입니다.
        </span>
      </div>
      <div class="fixed bottom-4">
        <Button
          @click="handleNext"
          label="저장"
          :disabled="!nicknameAvailable"
        ></Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from '../../components/layout/Header.vue';
import InputWithButton from '../../components/InputWithButton.vue';
import Button from '../../components/Button.vue';
// import axios from 'axios';
import { useUserStore } from '../../stores/profile';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const nickname = ref('');
const showErrors = ref(false);
const nicknameAvailable = ref(false);
const userStore = useUserStore();
const router = useRouter();

const handleNicknameCheck = () => {
  if (nickname.value) {
    nicknameAvailable.value = true;
  } else {
    showErrors.value = true;
  }
};

const handleNext = async () => {
  showErrors.value = true;

  if (!nickname.value || !nicknameAvailable.value) {
    return;
  }

  try {
    userStore.setNickname(nickname.value);
    // await axios.put('/api/users/me', {
    //   nickname: nickname.value,
    // });
    router.push('/profile');
  } catch (error) {
    console.error('닉네임 저장 실패:', error);
  }
};
</script>
