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
  // 마이페이지 관련 API 추가
  getMyPageAccounts: () => api.get('/mypage/accounts'),
};

export const expensesAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getCategories: () => api.get('/expenses/categories'),
};

export const savingAPI = {
  getTotal: () => api.get('/saving/total'),
  getHistory: () => api.get('/saving/history'),
  save: (id) => api.post(`/saving/save/${id}`),
};

// account api 추가
export const accountAPI = {
  connectMain: (data) => api.post('/assets/connect', data),
  connectSub: (data) => api.post('/assets/connect/sub', data),
  delete: (status) => api.delete('/assets', { params: { status } }),
  updateConnected: (assetConnected) =>
    api.put(`/user/update-assetConnected?assetConnected=${assetConnected}`),
  updateSubConnected: (assetSubConnected) =>
    api.put(`/user/update-savingConnected?assetConnected=${assetSubConnected}`),
};

// 챌린지 API - API 호출만 담당
export const challengeAPI = {
  // 챌린지 상세 조회
  getChallenge: (challengeId) => api.get(`/challenges/${challengeId}`),

  // 추천 챌린지 조회
  getRecommendations: () => api.get('/challenges/recommendations'),

  // 챌린지 참여
  joinChallengeByIdAndPeriod: (challengeId, period) =>
    api.post(`/challenges/join/${challengeId}/${period}`),

  // 진척도 조회 - 새로 추가된 API
  getProgress: () => api.get('/challenges/progress'),

  // 챌린지 완료
  completeChallenge: (challengeId) =>
    api.post(`/challenges/${challengeId}/complete`),

  // 챌린지 실패
  failChallenge: (challengeId, failureData) =>
    api.post(`/challenges/${challengeId}/fail`, failureData),
};

// export const chatAPI = {
//   getUserChatRooms: (userId) => api.get(`/chat/user/${userId}`),
//   getChatInfo: (challengeId) => api.get(`/chat/${challengeId}/info`),
//   getParticipants: (challengeId) =>
//     api.get(`/chat/${challengeId}/participants`),
//   getParticipantCount: (challengeId) =>
//     api.get(`/chat/${challengeId}/participants/count`),
// };

export default api;
