<template>
  <Header :show-back="true" title="챌린지 목록"></Header>
  <div class="page-container">
    <!-- 성공한 챌린지 -->
    <div>
      <Typography text="성공한 챌린지" padding="8px" />
      <div class="flex flex-col gap-3">
        <Challenge
          v-for="challenge in successChallenges"
          :key="challenge.id"
          :name="challenge.name"
          :start-date="challenge.startDate"
          :end-date="challenge.endDate"
          :icon="challenge.icon"
          :category="challenge.category"
        />
      </div>
    </div>

    <!-- 실패한 챌린지 -->
    <div>
      <Typography text="실패한 챌린지" padding="8px" />
      <div class="flex flex-col gap-3">
        <Challenge
          v-for="challenge in failedChallenges"
          :key="challenge.id"
          :name="challenge.name"
          :start-date="challenge.startDate"
          :end-date="challenge.endDate"
          :icon="challenge.icon"
          :category="challenge.category"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from '../../components/layout/Header.vue';
import Typography from '../../components/profile/Typography.vue';
import Challenge from '../../components/profile/Challenge.vue';

import { storeToRefs } from 'pinia';
import { useUserStore } from '../../stores/profile';

const userStore = useUserStore();
const { successChallenges, failedChallenges } = storeToRefs(userStore);
</script>
<style scoped>
.page-container {
  @apply px-8 pt-20 flex flex-col gap-2;
}
</style>
