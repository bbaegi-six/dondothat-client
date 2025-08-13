// services/challengeService.js
import { challengeAPI } from '@/utils/api';

export const challengeService = {
  // 특정 챌린지 조회
  async getChallengeById(challengeId) {
    try {
      const response = await challengeAPI.getChallenge(challengeId);
      return response;
    } catch (error) {
      console.error('챌린지 조회 실패:', error);
      throw new Error(`챌린지 조회 실패: ${this.getErrorMessage(error)}`);
    }
  },

  // 추천 챌린지 3개 조회
  async getRecommendations() {
    try {
      const response = await challengeAPI.getRecommendations();
      return response;
    } catch (error) {
      console.error('추천 챌린지 조회 실패:', error);
      throw new Error(`추천 챌린지 조회 실패: ${this.getErrorMessage(error)}`);
    }
  },

  // 챌린지 참여
  async joinChallenge(challengeId, period) {
    try {
      const response = await challengeAPI.joinChallengeByIdAndPeriod(
        challengeId,
        period
      );
      return response;
    } catch (error) {
      console.error('챌린지 참여 실패:', error);
      throw new Error(`챌린지 참여 실패: ${this.getErrorMessage(error)}`);
    }
  },

  // 챌린지 진척도 조회
  async getChallengeProgress() {
    try {
      const response = await challengeAPI.getProgress();
      return response;
    } catch (error) {
      // 404 에러는 참여중인 챌린지가 없는 경우이므로 에러로 처리하지 않음
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error('진척도 조회 실패:', error);
      throw new Error(`진척도 조회 실패: ${this.getErrorMessage(error)}`);
    }
  },

  // 챌린지 완료
  async completeChallenge(challengeId) {
    try {
      const response = await challengeAPI.completeChallenge(challengeId);
      return response;
    } catch (error) {
      console.error('챌린지 완료 실패:', error);
      throw new Error(`챌린지 완료 실패: ${this.getErrorMessage(error)}`);
    }
  },

  // 챌린지 실패 처리
  async failChallenge(challengeId) {
    try {
      const response = await challengeAPI.failChallenge(challengeId);
      return response;
    } catch (error) {
      console.error('챌린지 실패 처리 오류:', error);
      throw new Error(`챌린지 실패 처리 오류: ${this.getErrorMessage(error)}`);
    }
  },

  // 에러 메시지 추출
  getErrorMessage(error) {
    return (
      error.response?.data?.message ||
      error.message ||
      '알 수 없는 오류가 발생했습니다.'
    );
  },

  // Helper 함수들
  getChallengeIdByType(challengeType) {
    const challengeIdMap = {
      cafe: 'CAFE_CHALLENGE',
      delivery: 'DELIVERY_CHALLENGE',
      taxi: 'TAXI_CHALLENGE',
    };
    return challengeIdMap[challengeType] || 'DEFAULT_CHALLENGE';
  },

  getChallengeNameById(challengeId) {
    const challengeNames = {
      CAFE_CHALLENGE: '카페 금지 챌린지',
      DELIVERY_CHALLENGE: '배달음식 금지 챌린지',
      TAXI_CHALLENGE: '택시 금지 챌린지',
    };
    return challengeNames[challengeId] || '챌린지';
  },

  getChallengeDescriptionById(challengeId) {
    const challengeDescriptions = {
      CAFE_CHALLENGE: '카페에서 결제하지 않기',
      DELIVERY_CHALLENGE: '배달 음식 시키지 않기',
      TAXI_CHALLENGE: '택시 타지 않기',
    };
    return challengeDescriptions[challengeId] || '챌린지 설명';
  },
};

export default challengeService;
