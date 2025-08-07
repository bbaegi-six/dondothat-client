<template>
  <div
    class="w-full max-w-[393px] h-screen bg-[#2F2F2F] overflow-hidden relative mx-auto font-pretendard text-white"
  >
    <!-- Header Component - 항상 65px 공간 확보 -->
    <div class="h-[61px] relative">
      <div
        class="absolute inset-0 transition-opacity duration-300 ease-in-out"
        :class="
          currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        "
      >
        <AccountHeader
          :current-step="currentStep - 1"
          :total-steps="totalSteps - 1"
          :title="getHeaderTitle()"
          :show-back-button="currentStep > 2 && currentStep < 4"
          :back-button-text="getBackButtonText()"
          :show-header="currentStep > 1"
          :show-dots="currentStep > 1"
          @back="prevStep"
        />
      </div>
    </div>

    <!-- Main Content with Transition -->
    <div class="relative h-[calc(100%-61px)]">
      <Transition :name="transitionName" mode="out-in">
        <component
          :is="currentStepComponent"
          :key="currentStep"
          :flow-data="flowData"
          @next="nextStep"
          @back="(data) => prevStep(data?.preserveData)"
          @update-data="updateFlowData"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import AccountHeader from './AccountHeader.vue';
import Step1Welcome from './steps/Step1Welcome.vue';
import Step2BankSelect from './steps/Step2BankSelect.vue';
import Step3AccountForm from './steps/Step3AccountForm.vue';
import Step4Processing from './steps/Step4Processing.vue';
import Step5Complete from './steps/Step5Complete.vue';

// 상태 관리
const currentStep = ref(1);
const totalSteps = 5;
const transitionDirection = ref('forward');

// 플로우 데이터
const flowData = reactive({
  selectedBank: null,
  accountInfo: {},
  isProcessing: false,
  isComplete: false,
});

// 스텝 컴포넌트 매핑
const stepComponents = {
  1: Step1Welcome,
  2: Step2BankSelect,
  3: Step3AccountForm,
  4: Step4Processing,
  5: Step5Complete,
};

// 현재 스텝 컴포넌트 계산
const currentStepComponent = computed(() => stepComponents[currentStep.value]);

// 트랜지션 이름 계산
const transitionName = computed(() =>
  transitionDirection.value === 'forward' ? 'slide-left' : 'slide-right'
);

// 헤더 타이틀 함수
const getHeaderTitle = () => {
  const titles = {
    1: '계좌 연결',
    2: '계좌 연결',
    3: '계좌 연결',
    4: '계좌 연결',
    5: '계좌 연결',
  };
  return titles[currentStep.value] || '계좌 연결';
};

// 뒤로가기 버튼 텍스트 함수
const getBackButtonText = () => {
  return '계좌 연결';
};

// 다음 단계로 이동
const nextStep = (data = {}) => {
  if (currentStep.value < totalSteps) {
    transitionDirection.value = 'forward';
    Object.assign(flowData, data);
    currentStep.value++;
    console.log('Next step:', currentStep.value);
  }
};

// 이전 단계로 이동
const prevStep = (preserveData = false) => {
  if (currentStep.value > 1) {
    transitionDirection.value = 'backward';

    // step5에서 step3로 돌아갈 때 (실패 시)
    if (currentStep.value === 5 && preserveData) {
      currentStep.value = 3; // step3로 직접 이동
    } else {
      currentStep.value--;
    }

    console.log('Previous step:', currentStep.value);
  }
};

// 플로우 데이터 업데이트
const updateFlowData = (data) => {
  Object.assign(flowData, data);
  console.log('Flow data updated:', flowData);
};
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

/* Forward transition (slide left) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Backward transition (slide right) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
