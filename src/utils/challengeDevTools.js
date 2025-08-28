// 개발자 도구용 챌린지 테스트 함수들
export function initChallengeDevTools(challengeStore, router, showProgress, showFailed) {
  if (process.env.NODE_ENV !== 'development') return;

  window.testChallengeStates = () => {
    console.log('🧪 테스트용 상태 변경 함수들:');
    console.log('- testOngoing() : 진행중 챌린지');
    console.log('- testCompleted() : 완료된 챌린지');
    console.log('- testFailed() : 실패한 챌린지');
    console.log('- testEmpty() : 챌린지 없음');
    console.log('- testFlow() : 플로우 테스트');
  };

  window.testOngoing = () => {
    challengeStore.activeChallenge = {
      userChallengeId: 3,
      challengeId: 1,
      title: '배달음식 금지 챌린지',
      status: 'ongoing',
      period: 10,
      progress: 2,
      saving: 5000,
    };
    showProgress.value = true;
    showFailed.value = false;
  };

  window.testCompleted = () => {
    challengeStore.activeChallenge = {
      userChallengeId: 3,
      challengeId: 1,
      title: '배달음식 금지 챌린지',
      status: 'completed',
      period: 10,
      progress: 10,
      saving: 50000,
    };
    showProgress.value = true;
    showFailed.value = false;
  };

  window.testFailed = () => {
    challengeStore.activeChallenge = {
      userChallengeId: 3,
      challengeId: 1,
      title: '배달음식 금지 챌린지',
      status: 'failed',
      period: 10,
      progress: 5,
      saving: 25000,
    };
    showFailed.value = true;
    showProgress.value = false;
  };

  window.testEmpty = () => {
    challengeStore.activeChallenge = {
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
    showProgress.value = false;
    showFailed.value = false;
  };

  window.testFlow = () => {
    router.push('/challenge/flow');
  };

  console.log('🧪 개발 모드: 테스트 함수들 등록 완료');
  console.log('사용법: testChallengeStates() 호출 후 원하는 함수 실행');
}