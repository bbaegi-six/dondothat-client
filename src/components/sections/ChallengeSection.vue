<template>
  <!-- 참여 중인 챌린지 섹션 -->
  <div
    v-if="challengeData && challengeData.status !== 'closed'"
    class="w-98 h-24 rounded-2xl mt-4 flex flex-col justify-center px-6 cursor-pointer border-2 border-[#414141]"
    @click="$emit('goToChallenge')"
  >
    <div class="flex items-center">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center mr-4"
        :class="
          challengeData.status === 'completed' || challengeData.status === 'failed'
            ? ''
            : 'bg-gray-1'
        "
        :style="challengeIconBackgroundStyle"
      >
        <FontAwesomeIcon
          :icon="challengeIconClass"
          class="text-xl"
          :style="{ color: challengeIconColor }"
        />
      </div>
      <div class="flex-1 flex flex-col justify-center">
        <div class="flex items-center justify-between">
          <div class="font-pretendard font-medium text-base text-white">
            {{ challengeData.title }}
          </div>
          <div class="font-pretendard font-medium text-sm text-white ml-auto">
            {{ challengeData.progress }}/{{ challengeData.period }}일
          </div>
        </div>
        <div class="w-full bg-gray-1 rounded-full h-2 mt-1">
          <div
            class="h-2 rounded-full"
            :class="challengeData.status === 'failed' ? '' : 'bg-brand'"
            :style="progressBarStyle"
          ></div>
        </div>
      </div>
      <FontAwesomeIcon
        :icon="faAngleRight"
        class="text-[#c6c6c6] w-2 h-4 ml-2"
      />
    </div>
  </div>

  <!-- 참여 중인 챌린지가 없습니다 섹션 -->
  <div
    v-else
    class="w-98 h-24 bg-[#2f2f2f] border-2 border-[#414141] rounded-2xl mt-4 flex items-center px-6 cursor-pointer"
    @click="$emit('goToChallenge')"
  >
    <FontAwesomeIcon
      :icon="fasCircleQuestion"
      class="text-white w-12 h-12 mr-4"
    />
    <div class="font-pretendard font-medium text-base text-white flex-1">
      참여 중인 챌린지가 없습니다
    </div>
    <FontAwesomeIcon
      :icon="faAngleRight"
      class="text-[#c6c6c6] w-2 h-4"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleQuestion as fasCircleQuestion,
  faAngleRight,
  faXmark,
  faMotorcycle,
  faMugSaucer,
  faBagShopping,
  faTaxi,
  faStore,
  faClapperboard,
  faWineBottle,
  faTrainSubway,
  faSuitcaseMedical,
  faHome,
  faUtensils,
  faEllipsis,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  challengeData: {
    type: Object,
    default: null,
  },
  categoryMasterData: {
    type: Object,
    required: true,
  },
});

defineEmits(['goToChallenge']);

// 문자열 아이콘을 FontAwesome 아이콘 객체로 변환
const iconMap = {
  'fas fa-motorcycle': faMotorcycle,
  'fas fa-mug-saucer': faMugSaucer,
  'fas fa-bag-shopping': faBagShopping,
  'fas fa-taxi': faTaxi,
  'fas fa-store': faStore,
  'fas fa-clapperboard': faClapperboard,
  'fas fa-wine-bottle': faWineBottle,
  'fas fa-train-subway': faTrainSubway,
  'fas fa-suitcase-medical': faSuitcaseMedical,
  'fas fa-home': faHome,
  'fas fa-utensils': faUtensils,
  'fas fa-ellipsis': faEllipsis,
  'fas fa-coins': faCoins,
};

// 카테고리 정보를 한 번만 검색하는 최적화된 computed
const challengeCategory = computed(() => {
  if (!props.challengeData || !props.categoryMasterData) {
    return null;
  }
  
  const categoryId = props.challengeData.challenge_id;
  const foundEntry = Object.entries(props.categoryMasterData).find(
    ([name, cat]) => cat.id === categoryId
  );
  
  return foundEntry ? foundEntry[1] : null;
});

const challengeIconClass = computed(() => {
  if (!props.challengeData) return '';
  
  // failed 상태일 때 xmark 아이콘 표시
  if (props.challengeData.status === 'failed') {
    return faXmark;
  }
  
  // 문자열 아이콘을 FontAwesome 아이콘 객체로 변환
  const iconString = challengeCategory.value?.icon;
  if (iconString && iconMap[iconString]) {
    return iconMap[iconString];
  }
  
  // 기본 아이콘 (찾지 못한 경우)
  return faEllipsis;
});

const challengeIconColor = computed(() => {
  if (!props.challengeData) return '';
  
  // failed 상태일 때 흰색 표시
  if (props.challengeData.status === 'failed') {
    return '#ffffff';
  }
  
  return challengeCategory.value?.color || '';
});

const challengeIconBackgroundStyle = computed(() => {
  if (!props.challengeData) return {};
  
  if (props.challengeData.status === 'completed') {
    return { backgroundColor: '#414141' };
  } else if (props.challengeData.status === 'failed') {
    return { backgroundColor: '#a1a1a1' };
  }
  return {};
});

const progressBarStyle = computed(() => {
  if (!props.challengeData) return {};
  
  const progressPercentage = (props.challengeData.progress / props.challengeData.period) * 100;
  
  return {
    width: `${progressPercentage}%`,
    backgroundColor: props.challengeData.status === 'failed' ? '#858585' : '',
  };
});
</script>