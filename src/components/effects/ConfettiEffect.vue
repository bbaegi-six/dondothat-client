<template>
  <div class="confetti-container">
    <div
      class="confetti w-2 h-2"
      v-for="i in count"
      :key="i"
      :class="`confetti-${i % 6}`"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 50,
  },
});
</script>

<style scoped>
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  animation: confetti-fall 3s linear infinite;
}

.confetti-0 { background-color: #ff6b6b; animation-delay: 0s; left: 10%; }
.confetti-1 { background-color: #4ecdc4; animation-delay: 0.3s; left: 20%; }
.confetti-2 { background-color: #45b7d1; animation-delay: 0.6s; left: 30%; }
.confetti-3 { background-color: #96ceb4; animation-delay: 0.9s; left: 40%; }
.confetti-4 { background-color: #feca57; animation-delay: 1.2s; left: 60%; }
.confetti-5 { background-color: #ff9ff3; animation-delay: 1.5s; left: 80%; }

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>