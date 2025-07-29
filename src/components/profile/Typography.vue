<template>
  <p
    class="text-[#FFFFFF] font-bold"
    :style="{
      fontFamily: 'Pretendard',
      fontSize: '16px',
      lineHeight: '21px',
      paddingTop: padding,
      paddingBottom: padding,
    }"
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
  padding: {
    type: String,
    default: "0px", // 기본값
  },
});
</script>
