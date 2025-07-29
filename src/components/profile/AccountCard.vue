<template>
  <BaseCard>
    <!-- 상단: 이미지 + 계좌명 + 금액 -->
    <div
      style="
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        margin-bottom: 15px;
      "
    >
      <Img :src="imgSrc" style="width: 40px" />
      <p style="margin-left: 12px">{{ accountName }}</p>
      <p style="margin-left: 30px">{{ formattedAmount }}원</p>
    </div>

    <!-- 하단: 버튼 (가운데 정렬) -->
    <div
      class="font-light"
      style="
        font-size: 12px;
        font-weight: normal;
        text-align: center;
        margin-top: 12px;
      "
    >
      <button @click="$emit('change')">변경하기</button>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from "../BaseCard.vue";
import { computed } from "vue";

const props = defineProps({
  imgSrc: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

// 금액 포맷 (3자리 콤마)
const formattedAmount = computed(() => props.amount.toLocaleString());

defineEmits(["change"]);
</script>
