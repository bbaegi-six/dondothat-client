<template>
  <Header :showBack="true" title="닉네임 변경"></Header>
  <div
    style="
      padding: 20px;
      padding-top: 80px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: 0 auto;
    "
  >
    <div style="flex: 1; display: flex; flex-direction: column">
      <div style="margin-top: 20px">
        <p
          style="
            color: white;
            font-size: 14px;
            margin-bottom: 8px;
            display: block;
          "
        >
          변경할 닉네임
        </p>
        <Input
          v-model="nickname"
          placeholder="닉네임을 입력하세요"
          style="width: 100%; margin-bottom: 16px"
        />
      </div>
    </div>

    <div style="padding-bottom: 20px; margin-top: auto">
      <Button
        @click="handleSave"
        label="저장"
        :disabled="!nickname || nickname.trim() === ''"
        style="width: 100%; height: 48px; font-size: 16px; font-weight: 600"
      />
    </div>
  </div>
</template>

<script setup>
import Header from '../../components/layout/Header.vue';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import { authAPI } from '../../utils/api';
import { useAuthStore } from '../../stores/auth';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const nickname = ref('');
const authStore = useAuthStore();
const router = useRouter();

// 현재 사용자 닉네임으로 초기화
if (authStore.user?.nickname) {
  nickname.value = authStore.user.nickname;
}

const handleSave = async () => {
  // 공백 체크
  if (!nickname.value || nickname.value.trim() === '') {
    return;
  }

  try {
    await authAPI.updateProfile({ nickname: nickname.value.trim() });

    // 💡 사용자 정보 즉시 갱신
    await authStore.checkAuth(true);

    console.log('닉네임 변경 완료, 마이페이지로 이동');

    // 사용자 정보 갱신이 완료된 후 약간의 지연을 두고 이동
    setTimeout(() => {
      router.push('/profile');
    }, 100);
  } catch (error) {
    console.error('닉네임 저장 실패:', error);
    alert('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
  }
};
</script>
