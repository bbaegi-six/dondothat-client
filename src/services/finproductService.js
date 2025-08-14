import api from '@/utils/api';

// 금융상품 추천 관련 API 서비스
export const finproductService = {
  // 사용자 맞춤 적금상품 추천 조회
  async fetchRecommendedSavings(limit = null) {
    try {
      // 파라미터 검증
      const params = {};
      if (limit && Number.isInteger(limit) && limit > 0) {
        params.limit = limit;
      }

      const response = await api.get('/finproduct/recommend', { params });
      
      // 응답 데이터 검증
      if (!Array.isArray(response)) {
        console.warn('예상과 다른 응답 형식:', response);
        return [];
      }
      
      return response;
    } catch (error) {
      // 구체적인 에러 메시지 제공
      const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류';
      console.error('적금상품 추천 조회 실패:', {
        status: error.response?.status,
        message: errorMessage,
        originalError: error
      });
      
      throw new Error(`적금상품 추천 조회 실패: ${errorMessage}`);
    }
  },
};