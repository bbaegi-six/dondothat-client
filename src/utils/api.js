import axios from 'axios';

// API 기본 설정
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 모든 요청에 인증 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    // 401 에러 시 자동 로그아웃
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),
  refreshToken: () => api.post('/auth/refresh'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
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

export const assetsAPI = {
  connect: (userId) => api.post(`/assets/connect?userId=${userId}`),
  delete: (userId) => api.delete(`/assets?userId=${userId}`),
};

export const challengesAPI = {
  getById: (id) => api.get(`/challenges/${id}`),
};

export const chatAPI = {
  getUserChatRooms: (userId) => api.get(`/chat/user/${userId}`),
  getChatInfo: (challengeId) => api.get(`/chat/${challengeId}/info`),
  getParticipants: (challengeId) =>
    api.get(`/chat/${challengeId}/participants`),
  getParticipantCount: (challengeId) =>
    api.get(`/chat/${challengeId}/participants/count`),
};

export default api;
