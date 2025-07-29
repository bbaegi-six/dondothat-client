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
          class="bg-[#414141] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border-2 aspect-square hover:bg-gray-700 hover:scale-105"
          :class="{
            'border-[#FF5555] bg-[#FF5555]/10': selectedBank?.id === bank.id,
            'border-transparent': selectedBank?.id !== bank.id,
          }"
          @click="selectBank(bank)"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-1.5"
            :class="getBankIconClass(bank.colorClass)"
          >
            {{ bank.icon }}
          </div>
          <div class="text-xs font-medium text-white text-center leading-tight">
            {{ bank.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Button at Bottom -->
    <div class="absolute bottom-5 left-5 right-5 z-10">
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

const emit = defineEmits(['next', 'update-data']);

// 반응형 데이터
const selectedBank = ref(null);

// 은행 목록 데이터 (codefapi 기준)
const banks = ref([
  { id: 1, name: '국민은행', icon: 'KB', colorClass: 'kb' },
  { id: 2, name: '신한은행', icon: 'S', colorClass: 'shinhan' },
  { id: 3, name: '우리은행', icon: '≈', colorClass: 'woori' },
  { id: 4, name: '하나은행', icon: '♦', colorClass: 'hana' },
  { id: 5, name: '농협은행', icon: '♠', colorClass: 'nh' },
  { id: 6, name: '기업은행', icon: 'IBK', colorClass: 'kbank' },
  { id: 7, name: '산업은행', icon: '🏦', colorClass: 'kdb-industrial' },
  { id: 8, name: '새마을금고', icon: '🏘️', colorClass: 'saemaeul' },
  { id: 9, name: '우체국', icon: '✉', colorClass: 'postbank' },
  { id: 10, name: 'K뱅크', icon: '▣', colorClass: 'kbank-mobile' },
  { id: 11, name: '광주은행', icon: '⌂', colorClass: 'gwangju' },
  { id: 12, name: '제주은행', icon: '🏝️', colorClass: 'jeju' },
  { id: 13, name: '전북은행', icon: '🌳', colorClass: 'jeonbuk' },
  { id: 14, name: '수협은행', icon: '≋', colorClass: 'suhyup' },
  { id: 15, name: '경남은행', icon: '🌸', colorClass: 'kyongnam' },
  { id: 16, name: '신협은행', icon: '◈', colorClass: 'shinheung' },
  { id: 17, name: 'SC은행', icon: 'SC', colorClass: 'sc' },
  { id: 18, name: '씨티은행', icon: '🏙️', colorClass: 'citi' },
  { id: 19, name: '대구은행', icon: '🌆', colorClass: 'daegu' },
  { id: 20, name: '부산은행', icon: '🌊', colorClass: 'busan' },
]);

// 메서드들
const selectBank = (bank) => {
  selectedBank.value = bank;
  console.log('Selected bank:', bank.name);
};

const nextStep = () => {
  if (selectedBank.value) {
    emit('next', { selectedBank: selectedBank.value });
  }
};

const getBankIconClass = (colorClass) => {
  const classes = {
    'kdb-industrial': 'bg-indigo-600 text-white',
    gwangju: 'bg-blue-700 text-white',
    kbank: 'bg-purple-500 text-white',
    jeju: 'bg-emerald-500 text-white',
    kb: 'bg-yellow-400 text-black',
    jeonbuk: 'bg-green-700 text-white',
    suhyup: 'bg-cyan-500 text-white',
    kyongnam: 'bg-pink-500 text-white',
    nh: 'bg-orange-500 text-white',
    saemaeul: 'bg-amber-600 text-white',
    woori: 'bg-sky-500 text-white',
    shinheung: 'bg-blue-600 text-white',
    sc: 'bg-blue-600 text-white',
    postbank: 'bg-red-500 text-white',
    citi: 'bg-blue-800 text-white',
    hana: 'bg-green-600 text-white',
    daegu: 'bg-purple-600 text-white',
    shinhan: 'bg-blue-600 text-white',
    busan: 'bg-blue-500 text-white',
    'kbank-mobile': 'bg-yellow-500 text-black',
  };
  return classes[colorClass] || 'bg-gray-500 text-white';
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
