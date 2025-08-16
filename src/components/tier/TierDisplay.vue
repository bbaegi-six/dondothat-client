<template>
  <div class="text-center">
    <div class="w-24 h-24 mb-4 tier-upgrade-animation">
      <img
        :src="tierImage"
        :alt="tierName"
        class="w-full h-full object-contain"
      />
    </div>
    <p class="text-white text-[18px] font-bold">
      {{ tierName }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getTierImage } from '@/utils/challengeUtils';

const props = defineProps({
  tierData: {
    type: Object,
    required: true,
  },
});

const tierImage = computed(() => {
  return getTierImage(props.tierData?.tierId);
});

const tierName = computed(() => {
  return props.tierData?.tierName || '미등급';
});
</script>

<style scoped>
.tier-upgrade-animation {
  animation: tier-glow 2s ease-in-out infinite;
}

@keyframes tier-glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
    transform: scale(1.05);
  }
}
</style>