import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import challengeService from '@/services/challengeService';

export const useChallengeStore = defineStore('challenge', () => {
  // --- 상태 (State) ---
  const userChallengeData = ref(null);
  const currentChallenge = ref(null);
  const challengeHistory = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // 현재 진행 중인 챌린지 상태
  const activeChallenge = ref({
    id: null,
    type: null, // 'cafe', 'delivery', 'taxi'
    title: '',
    days: 0,
    currentDay: 1,
    status: 'NONE', // 'NONE', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
    savedAmount: 0,
    potentialSavedAmount: 0,
    startDate: null,
    endDate: null,
    failedTransactionId: null,
    dailyProgress: [],
  });

  // --- 게터 (Getters) ---
  const isActive = computed(
    () => activeChallenge.value.status === 'IN_PROGRESS'
  );
  const isCompleted = computed(
    () => activeChallenge.value.status === 'COMPLETED'
  );
  const isFailed = computed(() => activeChallenge.value.status === 'FAILED');
  const hasNoChallenge = computed(
    () => activeChallenge.value.status === 'NONE'
  );

  const challengeProgress = computed(() => {
    if (!isActive.value) return 0;
    return Math.round(
      (activeChallenge.value.currentDay / activeChallenge.value.days) * 100
    );
  });

  // 챌린지 메타데이터
  const challengeMetadata = computed(() => {
    const metadata = {
      cafe: {
        title: '카페 금지 챌린지',
        icon: 'fas fa-coffee',
        color: '#FF9595',
        categoryText: '카페',
      },
      delivery: {
        title: '배달음식 금지 챌린지',
        icon: 'fas fa-motorcycle',
        color: '#FF7376',
        categoryText: '배달음식',
      },
      taxi: {
        title: '택시 금지 챌린지',
        icon: 'fas fa-taxi',
        color: '#FFC457',
        categoryText: '택시',
      },
    };

    return (
      metadata[activeChallenge.value.type] || {
        title: '챌린지',
        icon: 'fas fa-circle',
        color: '#888888',
        categoryText: '해당 카테고리',
      }
    );
  });

  // 챌린지 참여
  const joinChallenge = async (challengeType, days) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await challengeService.joinChallenge(
        challengeType,
        days
      );

      // 상태 업데이트
      activeChallenge.value = {
        id: response.data.challengeId,
        type: challengeType,
        title: challengeMetadata.value.title,
        days: days,
        currentDay: 1,
        status: response.data.status || 'IN_PROGRESS',
        savedAmount: 0,
        potentialSavedAmount: calculatePotentialSavings(challengeType, days),
        startDate: response.data.startDate || new Date().toISOString(),
        endDate: response.data.endDate,
        failedTransactionId: response.data.failedTransactionId || null,
        dailyProgress: [],
      };

      console.log('✅ 챌린지 참여 성공:', activeChallenge.value);
      return { success: true, data: activeChallenge.value };
    } catch (err) {
      error.value = err.message;
      console.error('❌ 챌린지 참여 실패:', err);
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 챌린지 진행 상황 조회
  const fetchProgress = async () => {
    if (!activeChallenge.value.id) return;

    try {
      isLoading.value = true;
      const response = await challengeService.getProgress();

      // 상태 업데이트
      Object.assign(activeChallenge.value, {
        currentDay: response.data.currentDay,
        status: response.data.status,
        savedAmount: response.data.savedAmount,
        dailyProgress: response.data.dailyProgress || [],
        failedTransactionId: response.data.failedTransactionId,
      });

      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('진행 상황 조회 실패:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // 챌린지 완료
  const completeChallenge = async () => {
    if (!activeChallenge.value.id) return;

    try {
      isLoading.value = true;
      const response = await challengeService.completeChallenge(
        activeChallenge.value.id
      );

      activeChallenge.value.status = 'COMPLETED';

      // 히스토리에 추가
      challengeHistory.value.push({
        ...activeChallenge.value,
        completedAt: new Date().toISOString(),
      });

      console.log('🎉 챌린지 완료:', response.data);
      
      // 챌린지 완료 시 저금통 캐시 무효화 (저금통 잔액이 변경됨)
      try {
        const { SavingCache } = await import('@/utils/savingCache');
        SavingCache.invalidateOnChallengeComplete();
      } catch (error) {
        console.warn('저금통 캐시 무효화 실패:', error);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      error.value = err.message;
      console.error('챌린지 완료 실패:', err);
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 챌린지 실패 처리
  const failChallenge = async (failureReason = 'TRANSACTION_DETECTED') => {
    if (!activeChallenge.value.id) return;

    try {
      isLoading.value = true;
      const response = await challengeService.failChallenge(
        activeChallenge.value.id,
        failureReason
      );

      activeChallenge.value.status = 'FAILED';

      // 히스토리에 추가
      challengeHistory.value.push({
        ...activeChallenge.value,
        failedAt: new Date().toISOString(),
        failReason: failureReason,
      });

      console.log('💥 챌린지 실패:', response.data);
      return { success: true, data: response.data };
    } catch (err) {
      error.value = err.message;
      console.error('챌린지 실패 처리 오류:', err);
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 챌린지 재시작 (다시 도전하기)
  const retryChallenge = async (days) => {
    const currentType = activeChallenge.value.type;

    // 기존 챌린지 초기화
    resetChallenge();

    // 같은 타입으로 새 챌린지 시작
    return await joinChallenge(currentType, days);
  };

  // 챌린지 상태 초기화
  const resetChallenge = () => {
    activeChallenge.value = {
      id: null,
      type: null,
      title: '',
      days: 0,
      currentDay: 1,
      status: 'NONE',
      savedAmount: 0,
      potentialSavedAmount: 0,
      startDate: null,
      endDate: null,
      failedTransactionId: null,
      dailyProgress: [],
    };
    error.value = null;
  };

  // 챌린지 닫기
  const closeChallenge = async (userChallengeId) => {
    try {
      isLoading.value = true;
      const response = await challengeService.closeChallenge(userChallengeId);

      // 챌린지 상태 초기화
      resetChallenge();

      console.log('✅ 챌린지 닫기 성공:', response);
      return { success: true, data: response };
    } catch (err) {
      error.value = err.message;
      console.error('❌ 챌린지 닫기 실패:', err);
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 잠재적 저금액 계산
  const calculatePotentialSavings = (challengeType, days) => {
    const categoryAverages = {
      cafe: 4500,
      delivery: 12000,
      taxi: 8000,
    };

    const dailyAverage = categoryAverages[challengeType] || 5000;
    return dailyAverage * days;
  };

  // 에러 클리어
  const clearError = () => {
    error.value = null;
  };

  // 실시간 모니터링 시작 (선택사항)
  const startMonitoring = () => {
    if (!activeChallenge.value.id || !isActive.value) return;

    const monitoringInterval = setInterval(async () => {
      await fetchProgress();

      // 실패 상태가 되면 모니터링 중단
      if (isFailed.value) {
        clearInterval(monitoringInterval);
      }
    }, 30000); // 30초마다 체크

    return monitoringInterval;
  };

  // 사용자 챌린지 진행 정보 조회 (Home.vue에서 사용)
  async function fetchChallengeProgress() {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await challengeService.getChallengeProgress();
      userChallengeData.value = data; // 챌린지 정보가 없으면 null이 할당됨

      // activeChallenge 업데이트
      if (data) {
        activeChallenge.value = {
          id: data.user_challenge_id,
          type: data.challenge_id, // challenge_id를 type으로 사용 (예: CAFE_CHALLENGE)
          title: data.title,
          days: data.period,
          currentDay: data.progress, // progress를 currentDay로 사용
          status: data.status,
          savedAmount: data.saving,
          potentialSavedAmount: 0, // 이 값은 백엔드에서 오지 않으므로 0으로 설정하거나 계산 필요
          startDate: null, // 백엔드에서 오지 않으므로 null
          endDate: null, // 백엔드에서 오지 않으므로 null
          failedTransactionId: null, // 백엔드에서 오지 않으므로 null
          dailyProgress: [], // 백엔드에서 오지 않으므로 빈 배열
        };
      } else {
        // 챌린지가 없는 경우 activeChallenge 초기화
        activeChallenge.value = {
          id: null,
          type: null,
          title: '',
          days: 0,
          currentDay: 1,
          status: 'NONE',
          savedAmount: 0,
          potentialSavedAmount: 0,
          startDate: null,
          endDate: null,
          failedTransactionId: null,
          dailyProgress: [],
        };
      }

      console.log('사용자 챌린지 진행 정보 로드 성공:', data);
    } catch (err) {
      error.value = err.message;
      console.error('사용자 챌린지 진행 정보 로드 실패:', err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    userChallengeData,
    currentChallenge,
    challengeHistory,
    activeChallenge,
    isLoading,
    error,

    // Getters
    isActive,
    isCompleted,
    isFailed,
    hasNoChallenge,
    challengeProgress,
    challengeMetadata,

    // Actions
    joinChallenge,
    fetchProgress,
    completeChallenge,
    failChallenge,
    retryChallenge,
    resetChallenge,
    closeChallenge,
    clearError,
    startMonitoring,
    fetchChallengeProgress,
  };
});
