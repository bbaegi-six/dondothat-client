<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <p>{{ message }}</p>
      <div class="flex justify-center mt-4">
        <button @click="$emit('close')">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "오류가 발생했습니다.",
  },
});
defineEmits(["close"]);
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
