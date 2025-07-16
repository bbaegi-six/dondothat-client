import axios from 'axios'

// API 기본 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 모든 요청에 인증 토큰 자동 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 공통 에러 처리
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 401 에러 시 자동 로그아웃
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // 에러 메시지 표준화
    const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.'
    return Promise.reject(new Error(errorMessage))
  }
)

// API 메서드들
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  refreshToken: () => api.post('/auth/refresh'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
}

export const transactionsAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getCategories: () => api.get('/transactions/categories'),
  createCategory: (data) => api.post('/transactions/categories', data)
}

export const budgetAPI = {
  getAll: (params) => api.get('/budgets', { params }),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  copyFromPrevious: (year, month) => api.post('/budgets/copy', { year, month })
}

export const goalsAPI = {
  getAll: () => api.get('/goals'),
  getById: (id) => api.get(`/goals/${id}`),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  contribute: (id, amount, description) => api.post(`/goals/${id}/contribute`, { amount, description }),
  pause: (id) => api.patch(`/goals/${id}/pause`),
  resume: (id) => api.patch(`/goals/${id}/resume`),
  complete: (id) => api.patch(`/goals/${id}/complete`)
}

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  export: () => api.get('/settings/export'),
  import: (data) => api.post('/settings/import', data),
  clearCache: () => api.delete('/settings/cache')
}

export default api