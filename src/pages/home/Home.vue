<template>
  <div class="page-container">
    <h1 class="page-title">Home 페이지 제목</h1>
    <p>이곳에 페이지의 상세 내용을 구성하세요.</p>
    <Input v-model="email" type="email" placeholder="이메일" />
    <Button label="로그인"></Button>
    <BaseCard>
      <div>여기에 컴포넌트 넣기</div>
    </BaseCard>
    <Nav></Nav>
  </div>
</template>

<script setup>
// 페이지별 스크립트 로직
import Nav from "../../components/layout/Nav.vue";
import Button from "../../components/Button.vue";
import Input from "../../components/Input.vue";
import BaseCard from "../../components/BaseCard.vue";
</script>

<style scoped>
.page-container {
  padding: 1.5rem;
}
.page-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
</style>
