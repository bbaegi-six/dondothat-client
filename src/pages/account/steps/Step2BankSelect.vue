<!-- step2bankselect.vue -->
<template>
  <div class="h-full flex flex-col relative">
    <div class="pt-3 pb-4 flex justify-center">
      <div class="w-[328px]">
        <h2 class="text-lg font-semibold text-white">은행 선택</h2>
      </div>
    </div>

    <div class="flex-1 px-5 overflow-hidden">
      <div
        class="grid grid-cols-3 gap-3 h-full overflow-y-auto scrollbar-hide p-1 pb-[90px]"
      >
        <div
          v-for="bank in banks"
          :key="bank.id"
          class="w-[104px] h-[104px] rounded-[16px] p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border-2 hover:bg-gray-700 hover:scale-105"
          :class="{
            'border-[#FF5555] bg-[#FF5555]/10': selectedBank?.id === bank.id,
            'border-transparent bg-[#414141]': selectedBank?.id !== bank.id,
          }"
          @click="selectBank(bank)"
        >
          <img
            :src="bank.icon"
            alt="logo"
            class="w-10 h-10 object-contain mb-2"
          />
          <div class="text-sm font-medium text-white text-center leading-tight">
            {{ bank.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Button at Bottom -->
    <div class="absolute bottom-10 left-5 right-5 z-10">
      <div class="flex justify-center">
        <div class="w-[328px]">
          <Button label="다음" :disabled="!selectedBank" @click="nextStep" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from '../../../components/Button.vue';
import kbLogo from '@/assets/logo/kb.svg';
import shinhanLogo from '@/assets/logo/shinhan.svg';
import wooriLogo from '@/assets/logo/woori.svg';
import hanaLogo from '@/assets/logo/hana.svg';
import nhLogo from '@/assets/logo/nh.svg';
import ibkLogo from '@/assets/logo/ibk.svg';
import kdbLogo from '@/assets/logo/kdb.svg';
import mgLogo from '@/assets/logo/mg.svg';
import postLogo from '@/assets/logo/post.svg';
import kbankLogo from '@/assets/logo/kbank.svg';
import jeonbukLogo from '@/assets/logo/jeonbuk.svg';
import suhyupLogo from '@/assets/logo/suhyup.svg';
import bukyongLogo from '@/assets/logo/bukyong.svg';
import cuLogo from '@/assets/logo/cu.svg';
import scLogo from '@/assets/logo/sc.svg';
import citiLogo from '@/assets/logo/citi.svg';
import daeguLogo from '@/assets/logo/daegu.svg';

const emit = defineEmits(['next', 'update-data']);

// 반응형 데이터
const selectedBank = ref(null);

// 은행 목록 데이터 (codefapi 기준)
const banks = ref([
  { id: 1, name: '국민은행', icon: kbLogo },
  { id: 2, name: '신한은행', icon: shinhanLogo },
  { id: 3, name: '우리은행', icon: wooriLogo },
  { id: 4, name: '하나은행', icon: hanaLogo },
  { id: 5, name: '농협은행', icon: nhLogo },
  { id: 6, name: '기업은행', icon: ibkLogo },
  { id: 7, name: '산업은행', icon: kdbLogo },
  { id: 8, name: '새마을금고', icon: mgLogo },
  { id: 9, name: '우체국', icon: postLogo },
  { id: 10, name: 'K뱅크', icon: kbankLogo },
  { id: 11, name: '광주은행', icon: jeonbukLogo },
  { id: 12, name: '제주은행', icon: shinhanLogo },
  { id: 13, name: '전북은행', icon: jeonbukLogo },
  { id: 14, name: '수협은행', icon: suhyupLogo },
  { id: 15, name: '경남은행', icon: bukyongLogo },
  { id: 16, name: '신협은행', icon: cuLogo },
  { id: 17, name: 'SC은행', icon: scLogo },
  { id: 18, name: '씨티은행', icon: citiLogo },
  { id: 19, name: '대구은행', icon: daeguLogo },
  { id: 20, name: '부산은행', icon: bukyongLogo },
]);

// 메서드들
const selectBank = (bank) => {
  selectedBank.value = bank;
  // console.log('Selected bank:', bank.name);
};

const nextStep = () => {
  if (selectedBank.value) {
    emit('next', { selectedBank: selectedBank.value });
  }
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
