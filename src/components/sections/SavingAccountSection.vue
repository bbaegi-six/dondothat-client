<template>
  <!-- 저금통 섹션 -->
  <div v-if="savingTotal !== undefined && savingTotal !== null">
    <div
      class="w-98 h-14 bg-[#414141] rounded-2xl flex items-center px-6 cursor-pointer"
    >
      <div class="font-pretendard font-medium text-base text-white">
        지금까지 저금한 금액
      </div>
      <FontAwesomeIcon
        :icon="farCircleQuestion"
        class="text-[#c9c9c9] ml-1 mr-auto"
        @click.stop="$emit('showGuide')"
      />
      <div
        class="font-pretendard font-medium text-base text-white ml-auto mr-2"
        @click="$emit('goToSaving')"
      >
        {{ savingTotal.toLocaleString() }}원
      </div>
      <FontAwesomeIcon :icon="faAngleRight" class="text-white w-2 h-4" />
    </div>
  </div>
  <div
    v-else
    class="w-98 h-14 bg-[#414141] rounded-2xl flex items-center px-6 cursor-pointer"
    @click="$emit('connectAccount')"
  >
    <div class="font-pretendard font-medium text-base text-white">저금통</div>
    <FontAwesomeIcon
      :icon="farCircleQuestion"
      class="text-[#c9c9c9] ml-1 mr-auto"
      @click.stop="$emit('showGuide')"
    />
    <div class="font-pretendard font-medium text-base text-white mr-2">
      연결하기
    </div>
    <FontAwesomeIcon :icon="faAngleRight" class="text-white w-2 h-4" />
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleQuestion as farCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

defineProps({
  savingTotal: {
    type: Number,
    default: null,
  },
});

defineEmits(['showGuide', 'goToSaving', 'connectAccount']);
</script>