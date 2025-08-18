<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <p>{{ message }}</p>
      <div class="flex justify-around gap-4 mt-4">
        <button @click="$emit('close')">취소</button>
        <button @click="$emit('confirm')">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "계좌를 변경하시겠습니까?",
  },
});
defineEmits(["close", "confirm"]);
</script>
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 8px;
  min-width: 200px;
}
</style>
