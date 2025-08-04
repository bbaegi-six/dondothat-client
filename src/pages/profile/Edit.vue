<template>
  <Header :showBack="true" title="닉네임 변경"></Header>
  <div class="mt-20 mx-auto w-[328px]">
    <!-- 위쪽 내용 -->
    <div>
      <p class="text-white text-sm mb-2">변경할 닉네임</p>
      <Input
        v-model="nickname"
        placeholder="닉네임을 입력하세요"
        class="w-full"
      />
      <div class="h-1">
        <span v-if="showErrors && !nickname" class="text-brand text-xs mt-1">
          * 필수 항목입니다
        </span>
      </div>
      <div class="fixed bottom-4">
        <Button @click="handleSave" label="저장" :disabled="!nickname" />
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from '../../components/layout/Header.vue';
import Input from '../../components/Input.vue'; // InputWithButton 대신 Input 임포트
import Button from '../../components/Button.vue';
import { authAPI } from '../../utils/api'; // authAPI 임포트
import { useAuthStore } from '../../stores/auth'; // useAuthStore 임포트

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const nickname = ref('');
const showErrors = ref(false);
const authStore = useAuthStore(); // authStore 사용
const router = useRouter();

// 현재 사용자 닉네임으로 초기화
if (authStore.user?.nickname) {
  nickname.value = authStore.user.nickname;
}

const handleSave = async () => {
  showErrors.value = true;

  if (!nickname.value) {
    return;
  }

  try {
    await authAPI.updateProfile({ nickname: nickname.value });
    // 사용자 정보 업데이트 후 auth 스토어의 사용자 정보 갱신
    await authStore.checkAuth();
    router.push('/profile');
  } catch (error) {
    console.error('닉네임 저장 실패:', error);
    alert('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
  }
};
</script>
