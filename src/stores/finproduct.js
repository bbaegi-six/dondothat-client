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
      recommendedSavings.value = Array.isArray(data) ? data : [];
      return true;
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
    if (!rate || rate === 0) return '0.00%';
    return `${Number(rate).toFixed(2)}%`;
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
    if (!apiProduct) return null;
    
    return {
      logo: getBankLogoPath(apiProduct.korCoNm),
      name: apiProduct.finPrdtNm || '상품명 없음',
      bank: getDisplayBankName(apiProduct.korCoNm),  // 사용자 친화적 은행명 사용
      maxRate: formatInterestRate(apiProduct.intrRate2).replace('%', ''),
      baseRate: formatInterestRate(apiProduct.intrRate).replace('%', ''),
      url: getBankProductUrl(apiProduct.korCoNm),
      // 원본 데이터도 보관 (필요시 사용)
      original: apiProduct,
    };
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