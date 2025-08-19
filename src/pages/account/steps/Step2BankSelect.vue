<!-- step2bankselect.vue -->
<template>
  <div class="h-full flex flex-col relative">
    <div class="pt-3 pb-4 px-5">
      <h2 class="text-lg font-semibold text-white">은행 선택</h2>
    </div>

    <div class="flex-1 px-5 overflow-hidden">
      <div
        class="grid grid-cols-3 gap-3 h-full overflow-y-auto scrollbar-hide p-1 pb-24"
      >
        <div
          v-for="bank in banks"
          :key="bank.id"
          class="aspect-square rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border-2 hover:bg-gray-700 hover:scale-105"
          :class="{
            'border-[#FF5555] bg-[#FF5555]/10': selectedBank?.id === bank.id,
            'border-transparent bg-[#414141]': selectedBank?.id !== bank.id,
          }"
          @click="selectBank(bank)"
        >
          <img
            :src="bank.icon"
            alt="logo"
            class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain mb-1 sm:mb-2"
          />
          <div class="text-[9px] sm:text-[10px] md:text-xs font-medium text-white text-center leading-tight px-1">
            {{ bank.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Button at Bottom -->
    <div class="absolute bottom-10 left-5 right-5 z-10">
      <Button
        :disabled="!selectedBank"
        class="font-normal w-full"
        @click="nextStep"
      >
        다음
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Button from '@/components/ui/Button.vue';
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

// 엔터 키 이벤트 핸들러
const handleGlobalKeydown = (event) => {
  if (event.key === 'Enter' && selectedBank.value) {
    event.preventDefault();
    nextStep();
  }
};

// 컴포넌트 마운트 시 전역 키보드 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});

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
