<template>
  <div class="pt-[60px] px-6">
    <Header :showLogo="true" :showPoints="true" :points="100" />
    <p>이곳에 페이지의 상세 내용을 구성하세요.</p>
    <Input v-model="email" type="email" placeholder="이메일" />
    <Button label="로그인"></Button>
    <BaseCard>
      <div>여기에 컴포넌트 넣기</div>
    </BaseCard>
    
  </div>
</template>

<script setup>
// 페이지별 스크립트 로직
import Nav from "../../components/layout/Nav.vue";
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import BaseCard from "../../components/BaseCard.vue";
import Header from "../../components/layout/Header.vue";
import { ref } from 'vue';

const email = ref('');
</script>

<style scoped>
</style>
