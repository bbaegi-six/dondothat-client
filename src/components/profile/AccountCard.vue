<template>
  <BaseCard>
    <!-- 상단: 이미지 + 계좌명 + 금액 -->
    <div style="width: 100%; display: flex; align-items: center; padding: 8px">
      <!-- 왼쪽: 로고 + 계좌 정보 -->
      <div style="display: flex; align-items: center; flex: 1">
        <img
          :src="imgSrc"
          alt="은행 로고"
          style="width: 40px; height: 40px; margin-right: 12px"
        />
        <div style="flex: 1">
          <p
            style="
              margin: 0;
              font-size: 16px;
              font-weight: bold;
              line-height: 1.3;
            "
          >
            {{ accountName }}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #ccc">
            {{ formattedAmount }}원
          </p>
        </div>
      </div>

      <!-- 오른쪽: 편집 아이콘 -->
      <button
        @click="$emit('change')"
        style="
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <i class="fa-solid fa-pencil" style="font-size: 14px"></i>
      </button>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '../ui/BaseCard.vue';
import { computed } from 'vue';

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

defineEmits(['change']);
</script>
