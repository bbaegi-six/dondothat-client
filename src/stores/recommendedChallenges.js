import { defineStore } from 'pinia';
import { ref } from 'vue';
import { challengeAPI } from '@/utils/api';

export const useRecommendedChallengesStore = defineStore('recommendedChallenges', () => {
  const challenges = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchRecommendations = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await challengeAPI.getRecommendations();
      challenges.value = response; // Assuming the response is the array of challenges
      return true;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to fetch recommended challenges:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    challenges,
    isLoading,
    error,
    fetchRecommendations,
  };
});
