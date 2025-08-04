// src/services/chatApi.js

import axios from 'axios';

// ✅ 백엔드 API URL (REST)
const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`;

// ✅ axios 인스턴스
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터: JWT 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 호출 오류:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chatApi = {
  /** 사용자 챌린지 상태 확인 */
  async getUserChallengeStatus(userId) {
    try {
      console.log(`🔍 사용자 챌린지 상태 조회: userId=${userId}`);
      const response = await apiClient.get(`/chat/status/${userId}`);
      console.log('✅ 챌린지 상태 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 챌린지 상태 조회 실패:', error);
      throw new Error(
        error.response?.data?.message || '챌린지 상태를 확인할 수 없습니다.'
      );
    }
  },

  /** 채팅 메시지 이력 조회 */
  async getChatHistory(challengeId, userId, limit = 50) {
    try {
      console.log(
        `🔍 채팅 이력 조회: challengeId=${challengeId}, userId=${userId}, limit=${limit}`
      );
      const response = await apiClient.get(`/chat/${challengeId}/messages`, {
        params: { userId, limit },
      });
      console.log(`✅ 채팅 이력 조회 성공: ${response.data.length}개 메시지`);
      return response.data;
    } catch (error) {
      console.error('❌ 채팅 이력 조회 실패:', error);
      if (error.response?.status === 403) {
        throw new Error('해당 채팅방에 접근할 권한이 없습니다.');
      }
      throw new Error(
        error.response?.data?.message || '이전 채팅 내용을 불러올 수 없습니다.'
      );
    }
  },

  /** 채팅방 정보 조회 */
  async getChatRoomInfo(challengeId) {
    try {
      console.log(`🔍 채팅방 정보 조회: challengeId=${challengeId}`);
      const response = await apiClient.get(`/chat/${challengeId}/info`);
      console.log('✅ 채팅방 정보 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 채팅방 정보 조회 실패:', error);
      throw new Error(
        error.response?.data?.message || '채팅방 정보를 불러올 수 없습니다.'
      );
    }
  },

  /** 현재 접속자 수 조회 */
  async getParticipantCount(challengeId) {
    try {
      const response = await apiClient.get(
        `/chat/${challengeId}/participants/count`
      );
      return response.data;
    } catch (error) {
      console.error('접속자 수 조회 실패:', error);
      return { challengeId, participantCount: 0 };
    }
  },
};
