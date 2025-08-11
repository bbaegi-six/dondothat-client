import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API 기본 설정
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 모든 요청에 쿠키 포함
});

// 요청 인터셉터 - 모든 요청에 인증 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    // JWT 토큰을 Authorization 헤더에 추가 (쿠키와 함께 이중 지원)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 공통 에러 처리
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 401 에러 시 자동 로그아웃 (배포 환경에서 Mixed Content 에러 방지)
    if (error.response?.status === 401) {
      // localStorage.removeItem('token'); // JWT가 쿠키에 저장되므로 필요 없음
      // localStorage.removeItem('user'); // 사용자 정보도 서버에서 관리
      // 현재 도메인 기준으로 로그인 페이지로 이동
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = `${window.location.origin}/login`;
      }
    }

    // 에러 메시지 표준화
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      '알 수 없는 오류가 발생했습니다.';
    return Promise.reject(new Error(errorMessage));
  }
);

// API 메서드들
export const authAPI = {
  // 이메일 중복 확인
  checkEmail: (email) => api.get('/user/check-email', { params: { email } }),
  // 회원가입
  signUp: (userData) => api.post('/user/signup', userData),
  // 로그인
  login: (credentials) => api.post('/user/login', credentials),
  // 로그아웃
  logout: () => api.post('/user/logout'),
  // 사용자 정보 업데이트
  updateProfile: (userData) =>
    api.put('/user/update-nickname', null, {
      params: { nickname: userData.nickname },
    }),
  // 사용자 정보 조회
  fetchMe: () => api.get('/user/me'),
};

export const expensesAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getCategories: () => api.get('/expenses/categories'),
};
// account api 추가
export const accountAPI = {
  connectMain: (data) => api.post('/assets/connect', data),
  connectSub: (data) => api.post('/assets/connect/sub', data),
  delete: (status) => api.delete('/assets', { params: { status } }),
  updateConnected: (assetConnected) =>
    api.put(`/user/update-assetConnected?assetConnected=${assetConnected}`),
};

// 🎯 챌린지 API 추가
export const challengeAPI = {
  // 챌린지 상세 조회
  getChallenge: async (challengeId) => {
    if (process.env.NODE_ENV === 'development') {
      // Mock 데이터
      return Promise.resolve({
        data: {
          id: challengeId,
          name: getChallengeNameById(challengeId),
          description: getChallengeDescriptionById(challengeId),
          status: 'ACTIVE',
        },
      });
    }
    return api.get(`/challenges/${challengeId}`);
  },

  // 추천 챌린지 조회
  getRecommendations: async () => {
    if (process.env.NODE_ENV === 'development') {
      // Mock 데이터
      return Promise.resolve({
        data: [
          { id: 'CAFE_CHALLENGE', name: '카페 금지 챌린지', type: 'cafe' },
          {
            id: 'DELIVERY_CHALLENGE',
            name: '배달음식 금지 챌린지',
            type: 'delivery',
          },
          { id: 'TAXI_CHALLENGE', name: '택시 금지 챌린지', type: 'taxi' },
        ],
      });
    }
    return api.get('/challenges/recommendations');
  },

  // 챌린지 참여
  joinChallenge: async (challengeId, data) => {
    if (process.env.NODE_ENV === 'development') {
      // Mock 데이터 - 모든 챌린지가 성공으로 시작
      const mockResponse = {
        data: {
          success: true,
          challengeId: `user_challenge_${Date.now()}`,
          status: 'IN_PROGRESS', // 항상 성공 상태로 시작
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + data.duration * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      };

      console.log(`🎯 ${challengeId} 챌린지 시작 - 성공 상태`);
      return Promise.resolve(mockResponse);
    }
    return api.get(`/challenges/${challengeId}/join`, data);
  },

  // 챌린지 탈퇴
  leaveChallenge: async (challengeId) => {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve({ data: { success: true } });
    }
    return api.delete(`/challenges/${challengeId}/leave`);
  },

  // 진척도 조회
  getProgress: async (challengeId) => {
    if (process.env.NODE_ENV === 'development') {
      // Mock 데이터
      return Promise.resolve({
        data: {
          status: 'IN_PROGRESS',
          currentDay: 1,
          totalDays: 35,
          savedAmount: 0,
          potentialSavedAmount: 130400,
          dailyProgress: [],
        },
      });
    }
    return api.get(`/challenges/${challengeId}/progress`);
  },

  // 챌린지 완료
  completeChallenge: async (challengeId) => {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve({
        data: {
          success: true,
          completedAt: new Date().toISOString(),
          totalSavedAmount: 130400,
        },
      });
    }
    return api.post(`/challenges/${challengeId}/complete`);
  },

  // 챌린지 실패
  failChallenge: async (challengeId, failureData) => {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve({
        data: {
          success: true,
          failedAt: new Date().toISOString(),
          failReason: failureData.reason || 'TRANSACTION_DETECTED',
        },
      });
    }
    return api.post(`/challenges/${challengeId}/fail`, failureData);
  },
};

// 🛠️ Helper 함수들 (개발 모드용)
function getChallengeNameById(challengeId) {
  const challengeNames = {
    CAFE_CHALLENGE: '카페 금지 챌린지',
    DELIVERY_CHALLENGE: '배달음식 금지 챌린지',
    TAXI_CHALLENGE: '택시 금지 챌린지',
  };
  return challengeNames[challengeId] || '챌린지';
}

function getChallengeDescriptionById(challengeId) {
  const challengeDescriptions = {
    CAFE_CHALLENGE: '카페에서 결제하지 않기',
    DELIVERY_CHALLENGE: '배달 음식 시키지 않기',
    TAXI_CHALLENGE: '택시 타지 않기',
  };
  return challengeDescriptions[challengeId] || '챌린지 설명';
}

// 챌린지 타입 매핑 함수 (ChallengeFlow에서 사용)
export const getChallengeIdByType = (challengeType) => {
  const challengeIdMap = {
    cafe: 'CAFE_CHALLENGE',
    delivery: 'DELIVERY_CHALLENGE',
    taxi: 'TAXI_CHALLENGE',
  };
  return challengeIdMap[challengeType] || 'DEFAULT_CHALLENGE';
};

// export const challengesAPI = {
//   getById: (id) => api.get(`/challenges/${id}`),
// };

// export const chatAPI = {
//   getUserChatRooms: (userId) => api.get(`/chat/user/${userId}`),
//   getChatInfo: (challengeId) => api.get(`/chat/${challengeId}/info`),
//   getParticipants: (challengeId) =>
//     api.get(`/chat/${challengeId}/participants`),
//   getParticipantCount: (challengeId) =>
//     api.get(`/chat/${challengeId}/participants/count`),
// };

export default api;
