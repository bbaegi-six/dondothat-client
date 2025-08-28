<template>
  <div>
    <p>로그인 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  const token = route.query.token;

  if (token) {
    // 토큰을 Pinia 스토어와 localStorage에 저장
    authStore.setToken(token);
    // 로그인 성공 후 홈으로 리디렉션
    router.push('/');
  } else {
    // 토큰이 없으면 로그인 페이지로 리디렉션
    alert('로그인에 실패했습니다. 다시 시도해주세요.');
    router.push('/login');
  }
});
</script>
