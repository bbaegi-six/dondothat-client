<!-- BaseCard.vue -->
<template>
  <div class="base-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BaseCard",
};
</script>

<style scoped>
.base-card {
  background-color: #414141; /* 카드 배경색 */
  border-radius: 16px; /* 모서리 둥글게 */
  padding: 16px; /* 내부 여백 */
  min-height: 78px; /* 높이 기본값 (필요시 조절 가능) */
  display: flex;
  align-items: center;
}
</style>
