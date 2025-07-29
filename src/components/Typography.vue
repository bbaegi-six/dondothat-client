<template>
  <p
    class="text-[#FFFFFF] font-bold"
    style="
      font-family: Pretendard;
      font-size: 16px;
      line-height: 21px;
      padding-top: 8px;
      padding-bottom: 8px;
    "
  >
    {{ text }}
  </p>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
