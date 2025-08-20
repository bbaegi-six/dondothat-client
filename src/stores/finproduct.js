import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { finproductService } from '@/services/finproductService';
import { BANK_LOGO_MAP, BANK_URL_MAP, BANK_DISPLAY_NAME_MAP, DEFAULT_BANK } from '@/constants/bankMapping';

export const useFinproductStore = defineStore('finproduct', () => {
  // --- 상태 (State) ---
  const recommendedSavings = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // --- 게터 (Getters) ---
  // 추천 상품이 있는지 확인
  const hasRecommendations = computed(() => {
    return Array.isArray(recommendedSavings.value) && recommendedSavings.value.length > 0;
  });

  // 추천 상품 개수
  const recommendationCount = computed(() => {
    return recommendedSavings.value?.length || 0;
  });

  // UI에서 사용할 변환된 상품 데이터
  const transformedRecommendations = computed(() => {
    if (!hasRecommendations.value) return [];
    
    return recommendedSavings.value
      .map(transformToUIFormat)
      .filter(Boolean); // null 값 제거
  });

  // --- 액션 (Actions) ---
  // 추천 적금상품 조회
  async function fetchRecommendedSavings(limit = 3) {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await finproductService.fetchRecommendedSavings(limit);
      
      if (Array.isArray(data) && data.length > 0) {
        recommendedSavings.value = data;
        return true;
      } else {
        console.warn('추천 상품이 없습니다');
        recommendedSavings.value = [];
        return false;
      }
    } catch (err) {
      error.value = err.message;
      console.error('추천 상품 조회 실패:', err);
      recommendedSavings.value = [];
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 상태 초기화
  function resetState() {
    recommendedSavings.value = [];
    loading.value = false;
    error.value = null;
  }

  // 금리 포맷팅 (백분율)
  function formatInterestRate(rate) {
    if (!rate || rate === 0 || rate === null || rate === undefined) return '0.00%';
    
    try {
      const numRate = Number(rate);
      if (isNaN(numRate)) return '0.00%';
      return `${numRate.toFixed(2)}%`;
    } catch (error) {
      console.warn('금리 포맷팅 오류:', rate, error);
      return '0.00%';
    }
  }

  // 특별조건 텍스트 정리
  function formatSpecialCondition(condition) {
    if (!condition || condition === '-') return '특별조건 없음';
    return condition.length > 50 ? condition.substring(0, 47) + '...' : condition;
  }

  // 은행명으로 로고 파일 경로 매핑
  function getBankLogoPath(bankName) {
    if (!bankName) return new URL(`/src/assets/logo/${BANK_LOGO_MAP[DEFAULT_BANK]}.svg`, import.meta.url).href;
    
    const logoName = BANK_LOGO_MAP[bankName] || BANK_LOGO_MAP[DEFAULT_BANK];
    return new URL(`/src/assets/logo/${logoName}.svg`, import.meta.url).href;
  }

  // 은행별 적금상품 전체 페이지 URL 매핑
  function getBankProductUrl(bankName) {
    if (!bankName) return BANK_URL_MAP[DEFAULT_BANK];
    
    return BANK_URL_MAP[bankName] || BANK_URL_MAP[DEFAULT_BANK];
  }

  // 은행명을 사용자 친화적으로 변환
  function getDisplayBankName(bankName) {
    if (!bankName) return '은행명 없음';
    
    return BANK_DISPLAY_NAME_MAP[bankName] || bankName;
  }

  // API 데이터를 UI 형태로 변환하는 헬퍼 함수
  function transformToUIFormat(apiProduct) {
    if (!apiProduct || typeof apiProduct !== 'object') {
      console.warn('변환할 상품 데이터가 없습니다');
      return null;
    }
    
    try {
      // 필수 필드 검증
      const bankName = apiProduct.korCoNm || '은행명 없음';
      const productName = apiProduct.finPrdtNm || '상품명 없음';
      const baseRate = apiProduct.intrRate || 0;
      const maxRate = apiProduct.intrRate2 || 0;
      
      return {
        logo: getBankLogoPath(bankName),
        name: productName,
        bank: getDisplayBankName(bankName),
        maxRate: formatInterestRate(maxRate).replace('%', ''),
        baseRate: formatInterestRate(baseRate).replace('%', ''),
        url: getBankProductUrl(bankName),
        // 원본 데이터도 보관 (필요시 사용)
        original: apiProduct,
      };
    } catch (error) {
      console.error('상품 데이터 변환 중 오류:', error);
      
      // 오류 발생 시 기본값으로 반환
      return {
        logo: getBankLogoPath(DEFAULT_BANK),
        name: '상품명 없음',
        bank: DEFAULT_BANK,
        maxRate: '0.00',
        baseRate: '0.00',
        url: getBankProductUrl(DEFAULT_BANK),
        original: apiProduct,
      };
    }
  }

  return {
    // State
    recommendedSavings,
    loading,
    error,
    
    // Getters  
    hasRecommendations,
    recommendationCount,
    transformedRecommendations,
    
    // Actions
    fetchRecommendedSavings,
    resetState,
    
    // Utilities
    formatInterestRate,
    formatSpecialCondition,
    getBankLogoPath,
    getBankProductUrl,
    getDisplayBankName,
    transformToUIFormat,
  };
});